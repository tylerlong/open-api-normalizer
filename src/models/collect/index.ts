import { NamedSchema } from '../../types';
import { collectForms } from './form-bodies';
import { collectQueryParams } from './query-params';
import { collectSchemas } from './schemas';
import { handleSpecialCases } from './special-cases';

export const collect = () => {
  const schemas: NamedSchema[] = [];
  schemas.push(...handleSpecialCases());
  schemas.push(...collectQueryParams());
  schemas.push(...collectForms());
  schemas.push(...collectSchemas());
  return schemas;
};
