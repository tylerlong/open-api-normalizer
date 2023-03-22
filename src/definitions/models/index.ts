import { NamedSchema } from '../../types';
import { capitalizeFirstLetter } from '../../utils';
import { gatherSchemas } from '../schemas';
import { deRef } from './references';

export const gatherModels = () => {
  const schemas = gatherSchemas();
  const separateSchemas: NamedSchema[] = [];
  const iterateSchema = (schema: NamedSchema) => {
    separateSchemas.push(schema);
    console.log(schema);
    if (schema.additionalProperties) {
      schema.properties = schema.properties || {};
    }
    for (const [key, _val] of Object.entries(schema.properties!)) {
      const val = _val as NamedSchema;
      if (val.type === 'object' || 'properties' in val) {
        val.name = schema.name + capitalizeFirstLetter(key);
        iterateSchema(val);
      }
    }
  };
  for (const schema of schemas) {
    iterateSchema(deRef(schema)!);
  }
  return schemas.map((schema) => deRef(schema));
};

// import { Field, NamedSchema, Model } from '../types';

// const normalizeField = (field: Field): Field => {
//   if (field.$ref) {
//     field.$ref = field.$ref.split('/').slice(-1)[0];
//   }
//   if (field.type === 'string' && field.format === 'binary') {
//     field.$ref = 'Attachment';
//     delete field.type;
//     delete field.format;
//   }
//   if (field.items) {
//     field.items = normalizeField(field.items);
//   }
//   return field;
// };

// export const toModel = (schema: NamedSchema): Model => {
//   const properties = schema.properties || {};
//   const fields = Object.entries(properties)
//     .map(([k, v]) => ({
//       ...(v as unknown as Field),
//       name: k,
//       required: schema.required?.includes(k),
//     }))
//     .map((f) => normalizeField(f));
//   return {
//     name: schema.name,
//     description: schema.description,
//     fields,
//   };
// };

// todo: interate each schema and convert to models
