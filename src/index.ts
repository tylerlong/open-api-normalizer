import { writeFileSync } from 'fs';

import { models } from './definitions';

writeFileSync('models.json', JSON.stringify(models, null, 2));
