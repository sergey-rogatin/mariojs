import {
  loadSprite,
  addEntityType,
  drawSprite,
  removeEntity,
  time
} from '../engine/engine';
import imgCoin from '../sprites/coin.png';

const sprCoin = loadSprite(imgCoin, 0, 0, 2);

export const ENTITY_TYPE_COIN = addEntityType('0', updateCoin, {
  bbox: {
    left: 0,
    top: 0,
    width: 1,
    height: 1
  }
});

function updateCoin(coin) {
  if (!coin.isInitialized) {
    coin.startY = coin.y;
    coin.isInitialized = true;
  }

  drawSprite(sprCoin, coin, 2 * time.deltaTime);
  if (coin.isFlying) {
    coin.y -= 4 * time.deltaTime;
    if (coin.y < coin.startY - 1) {
      removeEntity(coin);
    }
  }
}
