import { OpenAPIV3 } from 'openapi-types';

import { doc, operations } from '../../raw-data';
import { NamedSchema } from '../../types';
import { capitalizeFirstLetter } from '../../utils';

export const readQueryParams = () => {
  const schemas: NamedSchema[] = [];
  for (const operation of operations) {
    if (!operation.parameters) {
      continue;
    }
    let queryParameters = operation.parameters;
    for (const qp of queryParameters) {
      // inline parameters
      if ('$ref' in qp) {
        const name = (qp.$ref as string).split('/').pop()!;
        Object.assign(qp, doc.components?.parameters?.[name]);
        delete qp.$ref;
      }
    }
    // no path or header parameters
    queryParameters = operation.parameters.filter((p) => p.in !== 'path' && p.in !== 'header');
    if (queryParameters.length === 0) {
      continue;
    }
    const name = capitalizeFirstLetter(operation.operationId!) + 'Parameters';
    const schema = {
      name,
      description: `Query parameters for operation ${operation.operationId}`,
      properties: Object.fromEntries(
        queryParameters.map((p) => {
          const schemaObject = p as unknown as OpenAPIV3.SchemaObject;
          Object.assign(schemaObject, p.schema, {
            in: undefined,
            schema: undefined,
            name: undefined,
          });
          return [p.name, schemaObject];
        }),
      ),
    };
    schemas.push(schema as NamedSchema);
  }
  return schemas;
};
