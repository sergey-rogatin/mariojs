import utils from './utils';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

const REMOVED_ENTITY = {};

const entities = {
  items: [],
  freeSpaces: [],
};

function addEntity(type) {
  let index = entities.items.length;
  if (entities.freeSpaces.length) {
    index = entities.freeSpaces.pop();
  }
  const entity = {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    type,
    index,
  };
  entities.items[index] = entity;
  return entity;
}

function destroyEntity(entity) {
  entities.freeSpaces.push(entity.index);
  entities.items[entity.index] = REMOVED_ENTITY;
}

const time = {
  speed: 1,
  deltaTime: 0,
};

const keyCode = {
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};

const keys = {};

Object.values(keyCode).forEach(code =>
  keys[code] = { isDown: false, wentDown: false, wentUp: false });

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

function addEntityType(mapSymbol, updateFunc) {
  const type = entityTypes.length;
  entityTypes.push({
    mapSymbol,
    updateFunc,
  });
  return type;
}

function updateGame() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < entities.items.length; index++) {
    const entity = entities.items[index];
    if (entity !== REMOVED_ENTITY) {
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

  requestAnimationFrame(updateGame);
}

addEntity();
updateGame();

export default {
  addEntityType,
  keys,
  keyCode,
  destroyEntity,
};