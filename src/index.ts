import { gatherModels } from './definitions';

const models = gatherModels();
console.log(JSON.stringify(models.slice(-1), null, 2));
