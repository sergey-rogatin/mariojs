import { ENTITY_TYPE_GOOMBA } from './entities/goomba';
import { ENTITY_TYPE_MARIO } from './entities/mario';
import { ENTITY_TYPE_WALL } from './entities/wall';
import { ENTITY_TYPE_COIN } from './entities/coin';
import { ENTITY_TYPE_QUESTION_BLOCK } from './entities/questionBlock';

Object.assign(window, {
  ENTITY_TYPE_COIN,
  ENTITY_TYPE_GOOMBA,
  ENTITY_TYPE_WALL,
  ENTITY_TYPE_MARIO,
  ENTITY_TYPE_QUESTION_BLOCK
});
