import {
  loadSprite,
  addEntityType,
  moveAndCheckForObstacles,
  time,
  settings,
  drawSprite,
  addEntity,
  removeEntity,
  playSound,
  loadSound,
  checkCollision
} from '../engine/engine';
import {
  ENTITY_TYPE_WALL,
  ENTITY_TYPE_QUESTION_BLOCK,
  ENTITY_TYPE_MARIO
} from '../entityTypes';
import audioStomp from '../sounds/stomp.wav';
import imgGoomba from '../sprites/goomba.png';

const sndStomp = loadSound(audioStomp);
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

  // сталкиваемся с Марио
  const hitMario = checkCollision(goomba, [ENTITY_TYPE_MARIO]);
  if (hitMario) {
    if (hitMario.y <= goomba.y) {
      removeEntity(goomba);
      hitMario.speedY = -15;
      playSound(sndStomp);
    } else {
      removeEntity(hitMario);
      const newMario = addEntity(ENTITY_TYPE_MARIO);
      newMario.x = hitMario.startX;
      newMario.y = hitMario.startY;
    }
  }
}
