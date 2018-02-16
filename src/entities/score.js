const ENTITY_TYPE_SCORE = addEntityType('%', updateScore);

function updateScore(score) {
  if (!score.isInitialized) {
    score.isInitialized = true;
    score.count = 0;
  }
  // Весь код ниже выполняется каждый кадр
  drawText(
    score.count,
    -camera.width / 2 + 0.5,
    -camera.height / 2 + 1.5,
    'white'
  );
}

export const scoreEntity = addEntity(ENTITY_TYPE_SCORE);
