import { Field, NamedSchema, Model } from '../types';

const normalizeField = (field: Field): Field => {
  if (field.$ref) {
    field.$ref = field.$ref.split('/').slice(-1)[0];
  }
  if (field.type === 'string' && field.format === 'binary') {
    field.$ref = 'Attachment';
    delete field.type;
    delete field.format;
  }
  if (field.items) {
    field.items = normalizeField(field.items);
  }
  return field;
};

export const toModel = (schema: NamedSchema): Model => {
  const properties = schema.properties || {};
  const fields = Object.entries(properties)
    .map(([k, v]) => ({
      ...(v as unknown as Field),
      name: k,
      required: schema.required?.includes(k),
    }))
    .map((f) => normalizeField(f));
  return {
    name: schema.name,
    description: schema.description,
    fields,
  };
};
