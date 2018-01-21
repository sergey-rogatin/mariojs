import engine from './engine';

import imgMarioRunning from './sprites/marioRunning.png';
import imgMarioIdle from './sprites/marioIdle.png';
import imgMarioJumping from './sprites/marioJumping.png';
import imgGroundBlock from './sprites/groundBlock.png';
import imgCoin from './sprites/coin.png';
import imgGoomba from './sprites/goomba.png';

const {
  loadSprite,
  drawSprite,
  addEntityType,
  settings,
  keys,
  time,
  keyCode,
  moveAndCheckForObstacles,
  checkCollision,
  addEntity,
  destroyEntity,
  camera,
  createMap,
} = engine;

// загрузка спрайтов будет не в юзеркоде наверн
const sprMarioRunning = loadSprite(imgMarioRunning, -8, -16, 2);
const sprMarioJumping = loadSprite(imgMarioJumping, -8, -16);
const sprMarioIdle = loadSprite(imgMarioIdle, -8, -16);
const sprGroundBlock = loadSprite(imgGroundBlock, 0, 0);
const sprGoomba = loadSprite(imgGoomba, -8, -16, 2);

function updateWall(wall) {
  drawSprite(sprGroundBlock, wall.x, wall.y);
}

const ENTITY_TYPE_WALL = addEntityType('#', updateWall, {
  bbox: {
    left: 0,
    top: 0,
    width: settings.tileSize,
    height: settings.tileSize
  }
});


let playerStartX = 0;
let playerStartY = 0;

function updateMario(mario) {
  if (!mario.isInitialized) {
    playerStartX = mario.x;
    playerStartY = mario.y;

    mario.isInitialized = true;
  }

  const keyLeft = keys[keyCode.ARROW_LEFT];
  const keyRight = keys[keyCode.ARROW_RIGHT];
  const keySpace = keys[keyCode.SPACE];

  const metersPerSecondSq = 60;
  const friction = 10;

  const accelX = (keyRight.isDown - keyLeft.isDown) * metersPerSecondSq;

  if (keyRight.isDown) {
    mario.direction = 1;
  }
  if (keyLeft.isDown) {
    mario.direction = -1;
  }

  mario.speedX += accelX * time.deltaTime;
  mario.speedY += settings.gravity * time.deltaTime;
  mario.speedX *= 1 - friction * time.deltaTime;

  const { vertWall } = moveAndCheckForObstacles(mario, ENTITY_TYPE_WALL);
  const isOnGround = vertWall && vertWall.y <= mario.y;

  if (keySpace.wentDown && isOnGround) {
    mario.speedY = -12;
  }

  const absSpeedX = Math.abs(mario.speedX);
  const dir = mario.direction || 1;

  if (!isOnGround) {
    // TODO сделать все спрайты правильного размера, чтобы их не нужно было масштабировать в юзеркоде
    drawSprite(sprMarioJumping, mario.x, mario.y, 0, 1 * dir, 1);
  } else if (absSpeedX > 1) {
    drawSprite(
      sprMarioRunning,
      mario.x,
      mario.y,
      0.03 * absSpeedX,
      1 * dir,
      1
    );
  } else {
    drawSprite(sprMarioIdle, mario.x, mario.y, 0, 1 * dir, 1);
  }

  const hitEnemy = checkCollision(mario, ENTITY_TYPE_GOOMBA);
  if (hitEnemy) {
    if (hitEnemy.y > mario.y) {
      destroyEntity(hitEnemy);
      mario.speedY = -15;
    } else {
      destroyEntity(mario);
      const newMario = addEntity(ENTITY_TYPE_MARIO);
      newMario.x = playerStartX;
      newMario.y = playerStartY;
    }
  }

  if (mario.y > 30) {
    destroyEntity(mario);
    const newMario = addEntity(ENTITY_TYPE_MARIO);
    newMario.x = playerStartX;
    newMario.y = playerStartY;
  }

  camera.x = mario.x;
  camera.y = 6;
}

const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
  bbox: {
    left: -0.45,
    top: -1,
    width: 0.9,
    height: 1
  }
});


function updateGoomba(goomba) {
  const { horizWall } = moveAndCheckForObstacles(goomba, ENTITY_TYPE_WALL);
  if (horizWall) {
    if (goomba.x < horizWall.x) {
      goomba.speedX = -2;
    } else {
      goomba.speedX = 2;
    }
  }
  goomba.speedY += settings.gravity * time.deltaTime;
  drawSprite(sprGoomba, goomba.x, goomba.y, 1 * time.deltaTime);
}

const ENTITY_TYPE_GOOMBA = addEntityType('G', updateGoomba, {
  bbox: {
    left: -0.5,
    top: -1,
    width: 1,
    height: 1
  },
  speedX: 2,
});

const asciiMapRows = [
  ' # ##########        ',
  '                     ',
  '      ###            ',
  '##  #####      ####  ',
  '#                    ',
  '        #  G         ',
  '#         ###        ',
  '#                    ',
  '                     ',
  '#                    ',
  '#   @    #   G G   # ',
  '######   ########### '
];

createMap(asciiMapRows);