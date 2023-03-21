import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';
import { Field, Model, NamedSchema, Operation } from '../types';

import { capitalizeFirstLetter } from '../utils';

const doc = load(readFileSync('rc-public-openapi.yml', 'utf8')) as OpenAPIV3.Document;
const schemas: NamedSchema[] = [];

const operations: Operation[] = [];
Object.keys(doc.paths).forEach((p) => {
  const pathObject = doc.paths[p] as {
    [key: string]: OpenAPIV3.OperationObject;
  };
  Object.keys(pathObject).forEach((method) => {
    operations.push(pathObject[method] as Operation);
  });
});

const handleSpecialCases = () => {
  //  infinite recursion
  const ScimSchemaAttribute = doc.components!.schemas!.ScimSchemaAttribute as OpenAPIV3.SchemaObject;
  const subScimSchemaAttribute = JSON.parse(JSON.stringify(ScimSchemaAttribute));
  delete subScimSchemaAttribute.properties!.subAttributes;
  (ScimSchemaAttribute.properties!.subAttributes as OpenAPIV3.ArraySchemaObject).items = subScimSchemaAttribute;

  // attachment
  const Attachment: NamedSchema = {
    name: 'Attachment',
    description: 'Attachment is a file to be uploaded',
    required: ['content'],
    properties: {
      filename: {
        type: 'string',
        description: 'Filename with extension, such as "image.png"',
      },
      content: {
        type: 'string',
        format: 'binary',
        description: 'Binary content of the file',
      },
      contentType: {
        type: 'string',
        description: 'Content type of the file, such as "image/png"',
      },
    },
  };
  schemas.push(Attachment);
};

const gatherSchemas = () => {
  // schemas
  for (const key of Object.keys(doc.components!.schemas!)) {
    const temp = doc.components!.schemas![key] as NamedSchema;
    temp.name = key;
    schemas.push(temp);
  }
};

const gatherQueryParams = () => {
  for (const operation of operations) {
    if (!operation.parameters) {
      continue;
    }
    const queryParameters = operation.parameters.filter((p) => p.in !== 'path' && p.in !== 'header');
    if (queryParameters.length === 0) {
      continue;
    }
    const name = capitalizeFirstLetter(operation.operationId!) + 'Parameters';
    const schema = {
      name,
      description: `Query parameters for operation ${operation.operationId}`,
      properties: Object.fromEntries(
        queryParameters.map((p) => {
          let schemaObject = p as unknown as OpenAPIV3.SchemaObject;
          schemaObject = Object.assign(schemaObject, p.schema, {
            in: undefined,
            schema: undefined,
          });
          return [p.name, schemaObject];
        }),
      ),
    };
    schemas.push(schema as NamedSchema);
  }
};

const gatherForm = () => {
  for (const operation of operations) {
    const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;
    if (!requestBody) {
      continue;
    }
    const form =
      requestBody.content?.['application/x-www-form-urlencoded'] || requestBody.content?.['multipart/form-data'];
    if (!form) {
      continue;
    }
    const schema = form.schema as NamedSchema;
    if (!schema || !('properties' in schema)) {
      continue;
    }
    schema.name = capitalizeFirstLetter(operation.operationId!) + 'Request';
    if (!schema.description) {
      schema.description = `Request body for operation ${operation.operationId}`;
    }
    schemas.push(schema);
  }
};

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

const normalizeSchema = (schema: NamedSchema): Model => {
  const properties = schema.properties || {};
  const fields = Object.keys(properties)
    .map((k) => ({
      ...(properties[k] as unknown as Field),
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

const normalizeModel = () => {
  for (const schema of schemas) {
    models.push(normalizeSchema(schema));
  }
};

const models: Model[] = [];
export const gatherModels = () => {
  handleSpecialCases();
  gatherSchemas();
  gatherQueryParams();
  gatherForm();
  normalizeModel();
  console.log(JSON.stringify(models.slice(-3), null, 2));
};
