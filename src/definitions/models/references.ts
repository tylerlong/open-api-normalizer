import { OpenAPIV3 } from 'openapi-types';

import { doc } from '../../raw-data';
import { NamedSchema } from '../../types';

const getSchemaByRef = (ref: string): NamedSchema | undefined => {
  const rName = ref.split('/').pop()!;
  if (ref.indexOf('#/components/schemas/') !== -1) {
    return { name: rName, ...doc.components!.schemas![rName] };
  }
  if (ref.indexOf('#/components/parameters/') !== -1) {
    const pObject = doc.components!.parameters![rName] as OpenAPIV3.ParameterObject;
    if (pObject.in === 'path') {
      return undefined;
    }
    return { name: rName, ...pObject.schema };
  }
  throw new Error(`Unknown ref: ${ref}`);
};

export const deRef = (schema: NamedSchema | undefined): NamedSchema | undefined => {
  if (schema === undefined) {
    return undefined;
  }
  if ('$ref' in schema) {
    return deRef(getSchemaByRef(schema.$ref as string));
  }
  if ('items' in schema) {
    schema.items = deRef(schema.items as NamedSchema)!;
    return schema;
  }
  if ('allOf' in schema || 'anyOf' in schema || 'oneOf' in schema) {
    let allOf = (schema.allOf || schema.anyOf || schema.oneOf)!;
    allOf = allOf.filter((af) => Reflect.get(af, 'type') === 'object' || '$ref' in af);
    return Object.assign({}, ...allOf.map((af) => deRef(af as NamedSchema)));
  }
  if ('properties' in schema) {
    const properties = schema.properties!;
    for (const key of Object.keys(properties)) {
      const temp = deRef(properties[key] as NamedSchema);
      if (temp !== undefined) {
        properties[key] = temp;
      }
    }
  }
  return schema;
};
