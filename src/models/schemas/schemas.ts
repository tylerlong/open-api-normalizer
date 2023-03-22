import { doc } from '../../raw-data';
import { NamedSchema } from '../../types';

export const readSchemas = () => {
  const schemas: NamedSchema[] = [];
  for (const [key, val] of Object.entries(doc.components!.schemas!)) {
    const temp = val as NamedSchema;
    temp.name = key;
    schemas.push(temp);
  }
  return schemas;
};
