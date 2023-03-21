import { OpenAPIV3 } from 'openapi-types';

export type NamedSchema = OpenAPIV3.SchemaObject & { name: string };

export interface Operation {
  operationId?: string;
  parameters?: OpenAPIV3.ParameterObject[];
  requestBody?: OpenAPIV3.RequestBodyObject;
}

export interface Model {
  name: string;
  description?: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type?: string;
  $ref?: string;
  description?: string;
  enum?: string[];
  example?: string;
  format?: string;
  items?: Field;
  default?: string | boolean;
  minimum?: number;
  maximum?: number;
  required?: boolean;
}
