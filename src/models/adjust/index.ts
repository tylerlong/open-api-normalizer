import { NamedSchema } from '../../types';
import { deRef } from './de-ref';
import { ref } from './ref';

export const adjust = (schemas: NamedSchema[]) => {
  return ref(deRef(schemas));
};
