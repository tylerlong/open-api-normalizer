import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

import { Operation } from './types';

export const doc = load(readFileSync('rc-public-openapi.yml', 'utf8')) as OpenAPIV3.Document;

export const operations: Operation[] = [];
Object.values(doc.paths).forEach((pathObject) => {
  Object.values(pathObject!).forEach((ops) => {
    operations.push(ops as Operation);
  });
});
