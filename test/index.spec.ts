import { writeFileSync } from 'fs';

import { prepareSpec } from '../src';

describe('index', () => {
  test('default', async () => {
    const parsed = prepareSpec(process.env.SPEC_FILE_PATH!);
    const jsonStr = JSON.stringify(parsed, null, 2);
    writeFileSync('parsed.json', jsonStr);
    expect(parsed.models).toBeDefined();
    expect(parsed.models.length).toBeGreaterThan(0);
    expect(parsed.paths).toBeDefined();
    expect(parsed.paths.length).toBeGreaterThan(0);

    const extensionPath = parsed.paths.find((path) => path.paths.join('-') === 'restapi-account-extension')!;
    expect(extensionPath.parameter).toBe('extensionId');

    const pagingOnlyGroupPath = parsed.paths.find(
      (path) => path.paths.join('-') === 'restapi-account-paging-only-groups',
    )!;
    expect(pagingOnlyGroupPath.parameter).toBe('pagingOnlyGroupId');

    const brandPath = parsed.paths.find((path) => path.paths.join('-') === 'restapi-dictionary-brand')!;
    expect(brandPath.parameter).toBe('brandId');

    const scimPath = parsed.paths.find((path) => path.paths.join('-') === 'scim')!;
    expect(scimPath.parameter).toBe('version');
    expect(scimPath.defaultParameter).toBe('v2');
  });
});
