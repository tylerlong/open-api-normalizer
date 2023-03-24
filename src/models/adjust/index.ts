import { NamedSchema } from '../../types';
import { deRef } from './de-ref';
import { fixFax } from './fax';
import { fixGreeting } from './greeting';
import { mergeOf } from './merge-of';
import { ref } from './ref';

export const adjust = (_schemas: NamedSchema[]): NamedSchema[] => {
  let schemas = mergeOf(_schemas);
  schemas = deRef(schemas);
  schemas = ref(schemas);
  schemas = fixFax(schemas);
  schemas = fixGreeting(schemas);
  // todo: fix miscellaneous issues
  return schemas;
};
