import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

import { RawOperation } from './types';

export const doc = load(readFileSync('rc-public-openapi.yml', 'utf8')) as OpenAPIV3.Document;

export const operations: RawOperation[] = [];
Object.values(doc.paths).forEach((pathObject) => {
  Object.values(pathObject!).forEach((ops) => {
    operations.push(ops as RawOperation);
  });
});
