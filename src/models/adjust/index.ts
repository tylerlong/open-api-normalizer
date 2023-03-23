import { NamedSchema } from '../../types';
import { deRef } from './de-ref';
import { fixFax } from './fax';
import { fixGreeting } from './greeting';
import { ref } from './ref';

export const adjust = (schemas: NamedSchema[]): NamedSchema[] => {
  return fixGreeting(fixFax(ref(deRef(schemas))));
};
