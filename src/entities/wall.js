import {
  loadSprite,
  addEntityType,
  settings,
  drawSprite
} from '../engine/engine';

import imgGroundBlock from '../sprites/groundBlock.png';

const sprGroundBlock = loadSprite(imgGroundBlock, 0, 0);

export const ENTITY_TYPE_WALL = addEntityType('#', updateWall, {
  bbox: {
    left: 0,
    top: 0,
    width: settings.tileSize,
    height: settings.tileSize
  }
});

function updateWall(wall) {
  drawSprite(sprGroundBlock, wall);
}
