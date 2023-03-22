import { NamedSchema } from '../../types';
import { deRef } from './de-ref';

export const adjust = (schemas: NamedSchema[]) => {
  return deRef(schemas);
};
