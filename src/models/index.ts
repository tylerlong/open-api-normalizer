import { collect } from './collect';
import { adjust } from './adjust';
import { normalize } from './normalize';

export default normalize(adjust(collect()));
