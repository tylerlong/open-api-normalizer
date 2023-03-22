import { OpenAPIV3 } from 'openapi-types';

import { doc } from '../../raw-data';

const getSchemaByRef = (ref: string) => {
  const rName = ref.split('/').pop()!;
  if (ref.indexOf('#/components/schemas/') !== -1) {
    return doc.components!.schemas![rName];
  }
  if (ref.indexOf('#/components/parameters/') !== -1) {
    const pObject = doc.components!.parameters![rName] as OpenAPIV3.ParameterObject;
    if (pObject.in === 'path') {
      return undefined;
    }
    return pObject.schema;
  }
  throw new Error(`Unknown ref: ${ref}`);
};

export const deRef = (
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
): OpenAPIV3.SchemaObject | undefined => {
  if (schema === undefined) {
    return undefined;
  }
  if ('$ref' in schema) {
    return deRef(getSchemaByRef(schema.$ref));
  }
  if ('items' in schema) {
    schema.items = deRef(schema.items)!;
    return schema;
  }
  if ('properties' in schema) {
    const properties = schema.properties!;
    for (const key of Object.keys(properties)) {
      const temp = deRef(properties[key]);
      if (temp !== undefined) {
        properties[key] = temp;
      }
    }
  }
  return schema;
};
