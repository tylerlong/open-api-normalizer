import { NamedSchema } from '../../types';
import { deRef } from './de-ref';
import { fixFax } from './fax';
import { fixGreeting } from './greeting';
import { ref } from './ref';

export const adjust = (_schemas: NamedSchema[]): NamedSchema[] => {
  let schemas = deRef(_schemas);
  schemas = ref(schemas);
  schemas = fixFax(schemas);
  schemas = fixGreeting(schemas);
  return schemas;
};
