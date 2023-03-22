import { doc } from '../../raw-data';
import { NamedSchema } from '../../types';

const shouldBeInline = (schema: NamedSchema): boolean => {
  if (schema.type === 'string') {
    return true;
  }
  // array
  if ('items' in schema) {
    return shouldBeInline(schema.items as NamedSchema);
  }
  return false;
};

export const deRef = (schemas: NamedSchema[]) => {
  for (const schema of schemas) {
    // replace pure $ref with the actual schema
    if ('$ref' in schema) {
      const name = (schema.$ref as string).split('/').pop()!;
      Object.assign(schema, doc.components!.schemas![name]);
      delete schema.$ref;
    }
  }
  const inlineSchemas = schemas.filter((schema) => shouldBeInline(schema));
  const objectSchemas = schemas.filter((schema) => !shouldBeInline(schema));
  for (const os of objectSchemas) {
    if (!('properties' in os)) {
      continue;
    }
    for (const val of Object.values(os.properties!)) {
      if ('$ref' in val) {
        const name = (val.$ref as string).split('/').pop()!;
        const found = inlineSchemas.find((is) => is.name === name);
        if (found) {
          Object.assign(val, found, { name: undefined });
          delete (val as any).$ref;
        }
      }
      if ('items' in val && '$ref' in val.items) {
        const name = (val.items.$ref as string).split('/').pop()!;
        const found = inlineSchemas.find((is) => is.name === name);
        if (found) {
          Object.assign(val.items, found, { name: undefined });
          delete (val.items as any).$ref;
        }
      }
    }
  }
  return objectSchemas;
};
