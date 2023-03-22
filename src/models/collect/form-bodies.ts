import { OpenAPIV3 } from 'openapi-types';

import { operations } from '../../raw-data';
import { NamedSchema } from '../../types';
import { capitalizeFirstLetter } from '../../utils';

export const collectForms = () => {
  const schemas: NamedSchema[] = [];
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
    if (!schema) {
      continue;
    }
    schema.name = capitalizeFirstLetter(operation.operationId!) + 'Request';
    if (!schema.description) {
      schema.description = `Request body for operation ${operation.operationId}`;
    }
    schemas.push(schema);
  }
  return schemas;
};
