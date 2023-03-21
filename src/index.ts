import { gatherModels } from './models';

const models = gatherModels();
console.log(JSON.stringify(models.slice(-3), null, 2));
