import { camera, drawText, addEntity, addEntityType } from '../engine/engine';

function updateScore(score) {
  if (!score.isInitialized) {
    score.isInitialized = true;
    score.count = 0;
  }
  drawText(
    score.count,
    -camera.width / 2 + 0.5,
    -camera.height / 2 + 1.5,
    'white'
  );
}

const ENTITY_TYPE_SCORE = addEntityType('%', updateScore);
export const scoreEntity = addEntity(ENTITY_TYPE_SCORE);
