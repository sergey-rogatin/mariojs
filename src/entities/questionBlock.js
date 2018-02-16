export const ENTITY_TYPE_QUESTION_BLOCK = addEntityType(
  '?',
  updateQuestionBlock,
  {
    bbox: {
      left: 0,
      top: 0,
      width: 1,
      height: 1
    }
  }
);

function updateQuestionBlock(block) {
  drawSprite(sprQuestionBlock, block);
}
