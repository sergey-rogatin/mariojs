import utils from './utils';
import imgMarioRunning from './sprites/marioRunning.png';
import imgMarioIdle from './sprites/marioIdle.png';
import imgMarioJumping from './sprites/marioJumping.png';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
canvas.width = 1366;
canvas.height = 768;

const entities = utils.unorderedList();

const settings = {
  pixelsPerMeter: 64,
  tileSize: 1,
  timeSpeed: 1,
  gravity: 20
};

const time = {
  deltaTime: 0,
  totalTime: 0
};

window.settings = settings;

function addEntity(type) {
  const entity = {
    x: 0,
    y: 0,
    bbox: {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    },
    speedX: 0,
    speedY: 0,

    type,
    index: 0,
    collisionIndex: 0
  };

  const typeInfo = entityTypes[type];
  Object.assign(entity, typeInfo.defaultState);

  const index = entities.add(entity);
  entity.index = index;

  const collisionIndex = typeInfo.collisionList.add(entity);
  entity.collisionIndex = collisionIndex;

  return entity;
}

function destroyEntity(entity) {
  entities.remove(entity.index);

  const typeInfo = entityTypes[entity.type];
  typeInfo.collisionList.remove(entity.collisionIndex);
}

const keyCode = {
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
};

const keys = {};

Object.values(keyCode).forEach(
  code => (keys[code] = { isDown: false, wentDown: false, wentUp: false })
);

document.onkeydown = function (event) {
  const key = keys[event.keyCode];
  if (!key) {
    return;
  }
  if (!key.isDown) {
    key.wentDown = true;
    key.isDown = true;
  }
};

document.onkeyup = function (event) {
  const key = keys[event.keyCode];
  if (!key) {
    return;
  }
  if (key.isDown) {
    key.wentUp = true;
    key.isDown = false;
  }
};

const entityTypes = [];
const dictSymbolToEntityType = {};

function addEntityType(mapSymbol, updateFunc, defaultState = {}) {
  const type = entityTypes.length;
  entityTypes.push({
    updateFunc,
    collisionList: utils.unorderedList(),
    defaultState
  });
  dictSymbolToEntityType[mapSymbol] = type;
  return type;
}

let prevTime = performance.now();

function updateGame() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < entities.items.length; index++) {
    const entity = entities.items[index];
    if (entity !== utils.unorderedList.REMOVED_ITEM) {
      const typeInfo = entityTypes[entity.type];
      if (typeInfo.updateFunc) {
        typeInfo.updateFunc(entity);
      }
    }
  }

  // clear keyboard inputs
  Object.values(keys).forEach(key => {
    key.wentDown = false;
    key.wentUp = false;
  });

  const newTime = performance.now();
  time.deltaTime = (newTime - prevTime) * 0.001 * settings.timeSpeed;
  if (time.deltaTime > 0.1) {
    time.deltaTime = 0.016;
  }
  time.totalTime += time.deltaTime;
  prevTime = newTime;
  requestAnimationFrame(updateGame);
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x * settings.pixelsPerMeter,
    y * settings.pixelsPerMeter,
    width * settings.pixelsPerMeter,
    height * settings.pixelsPerMeter
  );
}

function createMap(asciiMapRows) {
  for (let y = 0; y < asciiMapRows.length; y++) {
    const row = asciiMapRows[y];
    for (let x = 0; x < row.length; x++) {
      const entityType = dictSymbolToEntityType[row[x]];
      if (entityType !== undefined) {
        const e = addEntity(entityType);
        e.x = x * settings.tileSize;
        e.y = y * settings.tileSize;
      }
    }
  }
}

function checkCollision(entity, otherEntityType, offsetX = 0, offsetY = 0) {
  const typeInfo = entityTypes[otherEntityType];
  for (let other of typeInfo.collisionList.items) {
    if (other !== utils.unorderedList.REMOVED_ITEM && entity !== other) {
      const eLeft = entity.x + offsetX + entity.bbox.left;
      const eTop = entity.y + offsetY + entity.bbox.top;
      const eRight = eLeft + entity.bbox.width;
      const eBottom = eTop + entity.bbox.height;

      const oLeft = other.x + other.bbox.left;
      const oTop = other.y + other.bbox.top;
      const oRight = oLeft + other.bbox.width;
      const oBottom = oTop + other.bbox.height;

      const eps = 0.0001;

      if (
        eLeft >= oRight - eps ||
        eRight <= oLeft + eps ||
        eTop >= oBottom - eps ||
        eBottom <= oTop + eps
      ) {
        continue;
      }

      return other;
    }
  }
  return null;
}

function moveAndCheckForObstacles(entity, obstacleEntityType) {
  let isOnGround = false;

  const horizWall = checkCollision(
    entity,
    obstacleEntityType,
    entity.speedX * time.deltaTime,
    0
  );
  if (horizWall) {
    if (entity.speedX > 0) {
      entity.x =
        horizWall.x +
        horizWall.bbox.left -
        entity.bbox.left -
        entity.bbox.width;
    } else {
      entity.x =
        horizWall.x +
        horizWall.bbox.left +
        horizWall.bbox.width -
        entity.bbox.left;
    }
    entity.speedX = 0;
  }

  const vertWall = checkCollision(
    entity,
    obstacleEntityType,
    entity.speedX * time.deltaTime,
    entity.speedY * time.deltaTime
  );
  if (vertWall) {
    if (entity.speedY > 0) {
      entity.y =
        vertWall.y + vertWall.bbox.top - entity.bbox.top - entity.bbox.height;
      isOnGround = true;
      entity.speedY = 0;
    } else {
      entity.y =
        vertWall.y + vertWall.bbox.top + vertWall.bbox.height - entity.bbox.top;
      entity.speedY = 0;
    }
  }

  entity.x += entity.speedX * time.deltaTime;
  entity.y += entity.speedY * time.deltaTime;

  return isOnGround;
}

function loadSprite(fileName, offsetX = 0, offsetY = 0, frameCount = 1) {
  const img = new Image();
  img.src = fileName;
  const sprite = {
    bitmap: img,
    width: 0,
    height: 0,
    frame: 0,
    offsetX,
    offsetY,
    frameCount,
  };
  img.onload = () => {
    sprite.width = img.width / frameCount;
    sprite.height = img.height;
  };

  return sprite;
}

function drawSprite(sprite, x, y, speed = 0, scaleX = 1, scaleY = 1) {
  const currentFrame = Math.floor(sprite.frame);
  sprite.frame += speed;
  if (sprite.frame >= sprite.frameCount) {
    sprite.frame = 0;
  }

  ctx.save();
  ctx.scale(scaleX, scaleY);
  ctx.drawImage(
    sprite.bitmap,
    (currentFrame * sprite.width), 0, sprite.width, sprite.bitmap.height,
    x * settings.pixelsPerMeter / scaleX + sprite.offsetX,
    y * settings.pixelsPerMeter / scaleY + sprite.offsetY,
    sprite.width, sprite.bitmap.height
  );
  ctx.restore();
}

// test code

updateGame();

function updateWall(wall) {
  drawRect(
    wall.x + wall.bbox.left,
    wall.y + wall.bbox.top,
    wall.bbox.width,
    wall.bbox.height,
    'lawngreen'
  );
}

const ENTITY_TYPE_WALL = addEntityType('#', updateWall, {
  bbox: {
    left: 0,
    top: 0,
    width: settings.tileSize,
    height: settings.tileSize
  },
});

const sprMarioRunning = loadSprite(imgMarioRunning, -76, -170, 2);
const sprMarioJumping = loadSprite(imgMarioJumping, -76, -170);
const sprMarioIdle = loadSprite(imgMarioIdle, -76, -170);

function updateMario(mario) {
  const keyLeft = keys[keyCode.ARROW_LEFT];
  const keyRight = keys[keyCode.ARROW_RIGHT];
  const keyUp = keys[keyCode.ARROW_UP];
  const keyDown = keys[keyCode.ARROW_DOWN];
  const keySpace = keys[keyCode.SPACE];

  const metersPerSecondSq = 60;
  const friction = 10;

  const accelX = (keyRight.isDown - keyLeft.isDown) * metersPerSecondSq;
  const accelY = (keyDown.isDown - keyUp.isDown) * metersPerSecondSq;

  if (keyRight.isDown) {
    mario.direction = 1;
  }
  if (keyLeft.isDown) {
    mario.direction = -1;
  }

  mario.speedX += accelX * time.deltaTime;
  mario.speedY += settings.gravity * time.deltaTime;
  mario.speedX *= 1 - friction * time.deltaTime;
  //mario.speedY *= 1 - friction * time.deltaTime;

  const isOnGround = moveAndCheckForObstacles(mario, ENTITY_TYPE_WALL);

  if (keySpace.wentDown && isOnGround) {
    mario.speedY = -12;
  }

  // drawRect(
  //   mario.x + mario.bbox.left,
  //   mario.y + mario.bbox.top,
  //   mario.bbox.width,
  //   mario.bbox.height,
  //   'yellow'
  // );
  const absSpeedX = Math.abs(mario.speedX);
  const dir = mario.direction || 1;

  if (!isOnGround) {
    // TODO сделать все спрайты правильного размера, чтобы их не нужно было масштабировать в юзеркоде
    drawSprite(sprMarioJumping, mario.x, mario.y, 0, 0.4 * dir, 0.4);
  } else if (absSpeedX > 1) {
    drawSprite(sprMarioRunning, mario.x, mario.y, 0.03 * absSpeedX, 0.4 * dir, 0.4);
  } else {
    drawSprite(sprMarioIdle, mario.x, mario.y, 0, 0.4 * dir, 0.4);
  }
}

const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
  bbox: {
    left: -0.45,
    top: -1,
    width: 0.9,
    height: 1
  }
});

const asciiMapRows = [
  ' # ##########        ',
  '                     ',
  '      ###            ',
  '##  #####      ####  ',
  '#                    ',
  '        #            ',
  '#         ###        ',
  '#                    ',
  '                     ',
  '#        ####        ',
  '#   @                ',
  '######      ######   '
];

createMap(asciiMapRows);

export default {
  addEntityType,
  keys,
  keyCode,
  destroyEntity,
  addEntity,
  createMap,
  settings,
  moveAndCheckForObstacles,
  checkCollision
};
