import utils from './utils';

// canvas initialization
const SCALING_FACTOR = 4;

const globalCanvas = document.querySelector('#game');
globalCanvas.style.imageRendering = 'pixelated';
globalCanvas.width = 300;
globalCanvas.height = 200;
globalCanvas.style.width = globalCanvas.width * SCALING_FACTOR;
globalCanvas.style.height = globalCanvas.height * SCALING_FACTOR;
const globalCtx = globalCanvas.getContext('2d');

// global variables
const globalSettings = {
  pixelsPerMeter: 16,
  tileSize: 1,
  timeSpeed: 1,
  gravity: 20
};

const globalEntityTypeInfo = {};
const globalEntitiesList = utils.unorderedList();

const globalKeyCode = {
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
};
const globalKeys = {};

const globalTimeInfo = {
  deltaTime: 0,
  totalTime: 0,
  prevFrameTime: performance.now(),
};

const globalCamera = {
  x: globalCanvas.width / 2,
  y: globalCanvas.height / 2
};

// add all keys defined in keyCode to globalKeys object
Object.values(globalKeyCode).forEach(
  code => (globalKeys[code] = { isDown: false, wentDown: false, wentUp: false })
);

// start the game
mainGameLoop();


const api = {
  settings: globalSettings,
  keyCode: globalKeyCode,
  keys: globalKeys,
  time: globalTimeInfo,
  camera: globalCamera,

  addEntityType: (mapSymbol, updateFunc, defaultState) =>
    addEntityType(globalEntityTypeInfo, mapSymbol, updateFunc, defaultState),

  addEntity: (type) =>
    addEntity(globalEntityTypeInfo, globalEntitiesList, type),

  removeEntity: (entity) =>
    removeEntity(globalEntitiesList, entity),

  createMap: (asciiMapRows) =>
    createMap(globalEntityTypeInfo, globalEntitiesList, globalSettings, asciiMapRows),


  loadSprite,

  drawSprite: (sprite, entity, animationSpeed, scaleX, scaleY) =>
    drawSprite(globalCtx, sprite, entity, animationSpeed, scaleX, scaleY),

  drawRect: (x, y, width, height, color) =>
    drawRect(globalCtx, x, y, width, height, color),


  loadSound,

  playSound,


  checkCollision: (entity, otherTypes, offsetX, offsetY) =>
    checkCollision(globalEntitiesList, entity, otherTypes, offsetX, offsetY),

  moveAndCheckForObstacles: (entity, otherTypes) =>
    moveAndCheckForObstacles(globalEntitiesList, globalTimeInfo, entity, otherTypes)
};

export default api;

// entities
function addEntityType(globalEntityTypeInfo, mapSymbol, updateFunc, defaultState = {}) {
  globalEntityTypeInfo[mapSymbol] = {
    updateFunc,
    defaultState
  };
  return mapSymbol;
}

function addEntity(globalEntityTypeInfo, globalEntitiesList, type) {
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
    isInitialized: false,
  };

  const typeInfo = globalEntityTypeInfo[type];
  Object.assign(entity, typeInfo.defaultState); // set object default state as was defined in addEntityType()
  entity.index = globalEntitiesList.add(entity);

  return entity;
}

function removeEntity(globalEntitiesList, entity) {
  globalEntitiesList.remove(entity.index);
}

function createMap(globalEntityTypeInfo, globalEntitiesList, globalSettings, asciiMapRows) {
  for (let y = 0; y < asciiMapRows.length; y++) {
    const row = asciiMapRows[y];
    for (let x = 0; x < row.length; x++) {
      if (globalEntityTypeInfo[row[x]]) {
        const e = addEntity(globalEntityTypeInfo, globalEntitiesList, row[x]);
        e.x = x * globalSettings.tileSize;
        e.y = y * globalSettings.tileSize;
      }
    }
  }
}


// keyboard input

document.onkeydown = function (event) {
  const key = globalKeys[event.keyCode];
  if (!key) {
    return;
  }
  if (!key.isDown) {
    key.wentDown = true;
    key.isDown = true;
  }
};

document.onkeyup = function (event) {
  const key = globalKeys[event.keyCode];
  if (!key) {
    return;
  }
  if (key.isDown) {
    key.wentUp = true;
    key.isDown = false;
  }
};


// timing and main game loop

function mainGameLoop() {
  globalCtx.fillStyle = '#444';
  globalCtx.fillRect(0, 0, globalCanvas.width, globalCanvas.height);

  globalCtx.save();
  globalCtx.translate(
    -(globalCamera.x * globalSettings.pixelsPerMeter - globalCanvas.width / 2),
    -(globalCamera.y * globalSettings.pixelsPerMeter - globalCanvas.height / 2)
  );

  for (let index = 0; index < globalEntitiesList.items.length; index++) {
    const entity = globalEntitiesList.items[index];
    if (entity !== utils.unorderedList.REMOVED_ITEM) {
      const typeInfo = globalEntityTypeInfo[entity.type];
      if (typeInfo.updateFunc) {
        typeInfo.updateFunc(entity);
      }
    }
  }

  globalCtx.restore();

  // clear keyboard inputs
  Object.values(globalKeys).forEach(key => {
    key.wentDown = false;
    key.wentUp = false;
  });

  const newTime = performance.now();
  globalTimeInfo.deltaTime = (newTime - globalTimeInfo.prevFrameTime) * 0.001 * globalSettings.timeSpeed;
  if (globalTimeInfo.deltaTime > 0.1) {
    globalTimeInfo.deltaTime = 0.016;
  }
  globalTimeInfo.totalTime += globalTimeInfo.deltaTime;
  globalTimeInfo.prevFrameTime = newTime;
  requestAnimationFrame(mainGameLoop);
}


// graphics functions

function loadSprite(fileName, offsetX = 0, offsetY = 0, frameCount = 1) {
  const img = new Image();
  img.src = fileName;
  const sprite = {
    bitmap: img,
    width: 0,
    height: 0,
    offsetX,
    offsetY,
    frameCount,
    entityFrameMap: new Map(),
  };
  img.onload = () => {
    sprite.width = img.width / frameCount;
    sprite.height = img.height;
  };

  return sprite;
}

function drawSprite(globalCtx, sprite, entity, animationSpeed = 0, scaleX = 1, scaleY = 1) {
  // the current frame of the sprite is saved in a map(entity -> currentFrame)
  let savedFrame = sprite.entityFrameMap.get(entity) || 0;

  const currentFrame = Math.floor(savedFrame);
  savedFrame += animationSpeed;
  if (savedFrame >= sprite.frameCount) {
    savedFrame = 0;
  }
  sprite.entityFrameMap.set(entity, savedFrame);

  globalCtx.save();
  globalCtx.scale(
    scaleX,
    scaleY
  );
  globalCtx.drawImage(
    sprite.bitmap,
    currentFrame * sprite.width,
    0,
    sprite.width,
    sprite.height,
    entity.x * scaleX * globalSettings.pixelsPerMeter + sprite.offsetX,
    entity.y * scaleY * globalSettings.pixelsPerMeter + sprite.offsetY,
    sprite.width,
    sprite.height
  );
  globalCtx.restore();
}

function drawRect(globalCtx, x, y, width, height, color) {
  globalCtx.fillStyle = color;
  globalCtx.fillRect(
    x * globalSettings.pixelsPerMeter,
    y * globalSettings.pixelsPerMeter,
    width * globalSettings.pixelsPerMeter,
    height * globalSettings.pixelsPerMeter
  );
}


// audio functions

function loadSound(fileName) {
  const sound = new Audio(fileName);
  return sound;
}

function playSound(sound, loop = false, volume = 0.02) {
  sound.pause();
  sound.currentTime = 0;
  sound.loop = loop;
  sound.volume = volume;
  sound.play();
}


// collision functions

function checkCollision(globalEntitiesList, entity, otherTypes, offsetX = 0, offsetY = 0) {
  for (let other of globalEntitiesList.items) {
    if (other !== utils.unorderedList.REMOVED_ITEM && entity !== other) {
      if (!otherTypes.includes(other.type)) {
        continue;
      }
      const eLeft = entity.x + offsetX + entity.bbox.left;
      const eTop = entity.y + offsetY + entity.bbox.top;
      const eRight = eLeft + entity.bbox.width;
      const eBottom = eTop + entity.bbox.height;

      const oLeft = other.x + other.bbox.left;
      const oTop = other.y + other.bbox.top;
      const oRight = oLeft + other.bbox.width;
      const oBottom = oTop + other.bbox.height;

      const eps = 0.000001;

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

function moveAndCheckForObstacles(globalEntitiesList, globalTimeInfo, entity, otherTypes) {
  const horizWall = checkCollision(
    globalEntitiesList,
    entity,
    otherTypes,
    entity.speedX * globalTimeInfo.deltaTime,
    0
  );
  if (horizWall) {
    if (entity.speedX > 0) {
      entity.x = horizWall.x + horizWall.bbox.left - entity.bbox.left - entity.bbox.width;
    } else {
      entity.x = horizWall.x + horizWall.bbox.left + horizWall.bbox.width - entity.bbox.left;
    }
    entity.speedX = 0;
  }

  const vertWall = checkCollision(
    globalEntitiesList,
    entity,
    otherTypes,
    entity.speedX * globalTimeInfo.deltaTime,
    entity.speedY * globalTimeInfo.deltaTime
  );
  if (vertWall) {
    if (entity.speedY > 0) {
      entity.y = vertWall.y + vertWall.bbox.top - entity.bbox.top - entity.bbox.height;
      entity.speedY = 0;
    } else {
      entity.y = vertWall.y + vertWall.bbox.top + vertWall.bbox.height - entity.bbox.top;
      entity.speedY *= -0.5;
    }
  }

  entity.x += entity.speedX * globalTimeInfo.deltaTime;
  entity.y += entity.speedY * globalTimeInfo.deltaTime;

  return { horizWall, vertWall };
}