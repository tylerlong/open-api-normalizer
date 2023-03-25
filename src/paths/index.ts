import endpointPaths from './endpoints';
import { getBridgePaths } from './bridges';

export default [...endpointPaths, ...getBridgePaths(endpointPaths)].sort((path1, path2) =>
  path1.paths.join('/').length > path2.paths.join('/').length ? 1 : -1,
);
