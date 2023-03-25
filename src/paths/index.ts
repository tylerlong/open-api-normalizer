import { getEndpointPaths } from './endpoints';
import { getBridgePaths } from './bridges';

const endpointPaths = getEndpointPaths();
const bridgePaths = getBridgePaths(endpointPaths);

const result = [...endpointPaths, ...bridgePaths].sort((path1, path2) =>
  path1.paths.join('/').length > path2.paths.join('/').length ? 1 : -1,
);

export default result;
