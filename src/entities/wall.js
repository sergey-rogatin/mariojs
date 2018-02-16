export const ENTITY_TYPE_WALL = addEntityType('#', updateWall, {
  bbox: {
    left: 0,
    top: 0,
    width: settings.tileSize,
    height: settings.tileSize
  }
});

function updateWall(wall) {
  // Весь код ниже выполняется каждый кадр
  drawSprite(sprGroundBlock, wall);
}
