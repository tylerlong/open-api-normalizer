import { writeFileSync } from 'fs';

import { prepareSpec } from '../src';

writeFileSync('parsed.json', JSON.stringify(prepareSpec('rc-public-openapi.yml'), null, 2));
