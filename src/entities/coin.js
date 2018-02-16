import { scoreEntity } from './score';

export const ENTITY_TYPE_COIN = addEntityType('0', updateCoin, {
  bbox: {
    left: 0,
    top: 0,
    width: 1,
    height: 1
  }
});

function updateCoin(coin) {
  // Код ниже выполняется каждый кадр
  drawSprite(sprCoin, coin, 2 * time.deltaTime);
}
