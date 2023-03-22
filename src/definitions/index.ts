import { deRef } from './models/references';
import { gatherSchemas } from './schemas';

export const gatherModels = () => {
  const schemas = gatherSchemas();

  return schemas.map(deRef);

  // const models: Model[] = [];
  // for (const schema of schemas) {
  //   models.push(toModel(schema));
  // }
  // return models;
};
