import { studyHandlers } from './study';
import { qnaHandlers } from './qna';
import { infoHandlers } from './info';

export const handlers = [...studyHandlers, ...qnaHandlers, ...infoHandlers];
