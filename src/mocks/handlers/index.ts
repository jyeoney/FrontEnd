import { qnaHandlers } from './qna';
import { infoHandlers } from './info';
import { signUpHandlers } from './signup';

export const handlers = [...qnaHandlers, ...infoHandlers, ...signUpHandlers];
