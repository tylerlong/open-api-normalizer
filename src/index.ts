import { writeFileSync } from 'fs';

import models from './models';
import paths from './paths';

writeFileSync(
  'parsed.json',
  JSON.stringify(
    {
      models,
      paths,
    },
    null,
    2,
  ),
);
