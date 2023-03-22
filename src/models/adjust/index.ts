import { NamedSchema } from '../../types';
import { deRef } from './de-ref';
import { fixFax } from './fax';
import { ref } from './ref';

export const adjust = (schemas: NamedSchema[]): NamedSchema[] => {
  return fixFax(ref(deRef(schemas)));
};
