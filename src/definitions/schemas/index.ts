import { NamedSchema } from '../../types';
import { readForms } from './form-bodies';
import { readQueryParams } from './query-params';
import { readSchemas } from './schemas';
import { handleSpecialCases } from './special-cases';

export const gatherSchemas = () => {
  const schemas: NamedSchema[] = [];
  schemas.push(...handleSpecialCases());
  schemas.push(...readQueryParams());
  schemas.push(...readForms());
  schemas.push(...readSchemas());
  return schemas;
};
