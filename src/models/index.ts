import { Model, NamedSchema } from '../types';
import { gatherForms } from './forms';
import { toModel } from './models';
import { gatherQueryParams } from './query-params';
import { gatherSchemas } from './schemas';
import { handleSpecialCases } from './special-cases';

export const gatherModels = () => {
  const schemas: NamedSchema[] = [];
  schemas.push(...handleSpecialCases());
  schemas.push(...gatherSchemas());
  schemas.push(...gatherQueryParams());
  schemas.push(...gatherForms());

  const models: Model[] = [];
  for (const schema of schemas) {
    models.push(toModel(schema));
  }
  return models;
};
