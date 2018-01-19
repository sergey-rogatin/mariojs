import utils from './utils';

utils.testMethod();

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

function checkCollision(entity, otherEntityType, offsetX = 0, offetY = 0) {
  const typeInfo = entityTypes[otherEntityType];
  for (let other of typeInfo.collisionList.items) {
    if (other !== utils.unorderedList.REMOVED_ITEM && entity !== other) {
      const eLeft = entity.x + offsetX + entity.bbox.left;
      const eTop = entity.y + offetY + entity.bbox.top;
      const eRight = eLeft + entity.bbox.width;
      const eBottom = eTop + entity.bbox.height;

      const oLeft = other.x + other.bbox.left;
      const oTop = other.y + other.bbox.top;
      const oRight = oLeft + other.bbox.width;
      const oBottom = oTop + other.bbox.height;

      if (
        eLeft >= oRight ||
        eRight <= oLeft ||
        eTop >= oBottom ||
        eBottom <= oTop
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
        entity.bbox.width -
        entity.bbox.left;
    } else {
      entity.x =
        horizWall.x +
        horizWall.bbox.width -
        entity.bbox.left +
        horizWall.bbox.left;
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
        vertWall.y + vertWall.bbox.top - entity.bbox.height - entity.bbox.top;
      isOnGround = true;
      entity.speedY = 0;
    } else {
      entity.y =
        vertWall.y + vertWall.bbox.height - entity.bbox.top + vertWall.bbox.top;
      //entity.speedY *= -0.5;
      entity.speedY = 0;
    }
  }

  entity.x += entity.speedX * time.deltaTime;
  entity.y += entity.speedY * time.deltaTime;

  return isOnGround;
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
  }
});

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

  mario.speedX += accelX * time.deltaTime;
  mario.speedY += accelY * time.deltaTime; //settings.gravity * time.deltaTime;
  mario.speedX *= 1 - friction * time.deltaTime;
  mario.speedY *= 1 - friction * time.deltaTime;

  const isOnGround = moveAndCheckForObstacles(mario, ENTITY_TYPE_WALL);

  if (keySpace.wentDown && isOnGround) {
    mario.speedY = -12;
  }

  drawRect(
    mario.x + mario.bbox.left,
    mario.y + mario.bbox.top,
    mario.bbox.width,
    mario.bbox.height,
    'yellow'
  );
}

const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
  bbox: {
    left: -0.2,
    top: -0.2,
    width: 0.4,
    height: 0.6
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
