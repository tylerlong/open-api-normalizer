import { writeFileSync } from 'fs';

import models from './models';

writeFileSync('models.json', JSON.stringify(models, null, 2));
