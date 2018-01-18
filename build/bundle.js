/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(1);


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

/* harmony default export */ __webpack_exports__["default"] = ({
  addEntityType,
  keys,
  keyCode,
  destroyEntity,
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * returns the middle of three numbers
 * @param {number} a
 * @param {number} b 
 * @param {number} c 
 */
function median(a, b, c) {
  return a > b ? (c > a ? a : (b > c ? b : c)) : (c > b ? b : (a > c ? a : c));
}


/* unused harmony default export */ var _unused_webpack_default_export = ({
  median,
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map