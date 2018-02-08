import {
  loadSprite,
  addEntityType,
  drawSprite,
  removeEntity,
  time,
  playSound,
  loadSound,
  checkCollision
} from '../engine/engine';
import imgCoin from '../sprites/coin.png';
import audioCoin from '../sounds/coin.wav';
import { ENTITY_TYPE_MARIO } from '../entityTypes';
import { scoreEntity } from './score';

const sndCoin = loadSound(audioCoin);
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
  // Код ниже выполняется каждый кадр
  drawSprite(sprCoin, coin, 2 * time.deltaTime);
}
