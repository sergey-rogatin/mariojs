import {
  loadSprite,
  addEntityType,
  moveAndCheckForObstacles,
  time,
  settings,
  drawSprite
} from '../engine/engine';
import { ENTITY_TYPE_WALL, ENTITY_TYPE_QUESTION_BLOCK } from '../entityTypes';

import imgGoomba from '../sprites/goomba.png';
const sprGoomba = loadSprite(imgGoomba, -8, -16, 2);

export const ENTITY_TYPE_GOOMBA = addEntityType('G', updateGoomba, {
  bbox: {
    left: -0.5,
    top: -1,
    width: 1,
    height: 1
  },
  speedX: 2
});

function updateGoomba(goomba) {
  // весь код ниже выполняется каждый кадр
  drawSprite(sprGoomba, goomba, 3 * time.deltaTime);
}
