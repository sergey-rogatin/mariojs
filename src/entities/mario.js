import audioJump from '../sounds/jump.wav';
import audioCoin from '../sounds/coin.wav';
import audioStomp from '../sounds/stomp.wav';
import imgMarioRunning from '../sprites/marioRunning.png';
import imgMarioIdle from '../sprites/marioIdle.png';
import imgMarioJumping from '../sprites/marioJumping.png';

import {
  ENTITY_TYPE_WALL,
  ENTITY_TYPE_QUESTION_BLOCK,
  ENTITY_TYPE_COIN,
  ENTITY_TYPE_GOOMBA
} from '../entityTypes';

import {
  loadSprite,
  loadSound,
  addEntityType,
  drawSprite,
  keys,
  keyCode,
  time,
  settings,
  addEntity,
  moveAndCheckForObstacles,
  playSound,
  removeEntity,
  camera,
  checkCollision
} from '../engine/engine';

const sprMarioRunning = loadSprite(imgMarioRunning, -8, -16, 2);
const sprMarioJumping = loadSprite(imgMarioJumping, -8, -16);
const sprMarioIdle = loadSprite(imgMarioIdle, -8, -16);

const sndJump = loadSound(audioJump);
const sndCoin = loadSound(audioCoin);
const sndStomp = loadSound(audioStomp);

let playerStartX = 0;
let playerStartY = 0;

export const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
  bbox: {
    left: -0.45,
    top: -1,
    width: 0.9,
    height: 1
  }
});

export function updateMario(mario) {
  if (!mario.isInitialized) {
    playerStartX = mario.x;
    playerStartY = mario.y;

    mario.isInitialized = true;
  }

  const absSpeedX = Math.abs(mario.speedX);
  const dir = mario.direction || 1;

  if (!mario.isOnGround) {
    drawSprite(sprMarioJumping, mario, 0, dir);
  } else if (absSpeedX > 1) {
    drawSprite(sprMarioRunning, mario, 0.03 * absSpeedX, dir);
  } else {
    drawSprite(sprMarioIdle, mario, 0, dir);
  }

  const keyLeft = keys[keyCode.ARROW_LEFT];
  const keyRight = keys[keyCode.ARROW_RIGHT];
  const keySpace = keys[keyCode.SPACE];

  const accelConst = 60;
  const friction = 10;

  const accelX = (keyRight.isDown - keyLeft.isDown) * accelConst;

  if (keyRight.isDown) {
    mario.direction = 1;
  }
  if (keyLeft.isDown) {
    mario.direction = -1;
  }

  mario.speedX += accelX * time.deltaTime;
  mario.speedY += settings.gravity * time.deltaTime;
  mario.speedX *= 1 - friction * time.deltaTime;

  const { vertWall } = moveAndCheckForObstacles(mario, [
    ENTITY_TYPE_WALL,
    ENTITY_TYPE_QUESTION_BLOCK
  ]);
  mario.isOnGround = vertWall && vertWall.y <= mario.y;

  if (keySpace.wentDown && mario.isOnGround) {
    mario.speedY = -12;
    playSound(sndJump);
  }

  // question blocks
  if (
    vertWall &&
    vertWall.type === ENTITY_TYPE_QUESTION_BLOCK &&
    vertWall.y < mario.y
  ) {
    const coin = addEntity(ENTITY_TYPE_COIN);
    coin.x = vertWall.x;
    coin.y = vertWall.y - settings.tileSize;
    coin.isFlying = true;
  }

  const hitEnemy = checkCollision(mario, [ENTITY_TYPE_GOOMBA]);
  if (hitEnemy) {
    if (hitEnemy.y > mario.y) {
      removeEntity(hitEnemy);
      mario.speedY = -15;
      playSound(sndStomp);
    } else {
      removeEntity(mario);
      // TODO: сделать меню после проигрыша
      const newMario = addEntity(ENTITY_TYPE_MARIO);
      newMario.x = playerStartX;
      newMario.y = playerStartY;
    }
  }

  if (mario.y > 30) {
    removeEntity(mario);
    const newMario = addEntity(ENTITY_TYPE_MARIO);
    newMario.x = playerStartX;
    newMario.y = playerStartY;
  }

  const hitCoin = checkCollision(mario, [ENTITY_TYPE_COIN]);
  if (hitCoin) {
    removeEntity(hitCoin);
    playSound(sndCoin);
  }

  camera.x = mario.x;
}
