//#region imports
import { addEntityType, settings, drawSprite } from '../engine/engine';
import assets from '../assets';
//#endregion

export function updateWall(wall) {
    // Весь код ниже выполняется каждый кадр
    drawSprite(assets.sprGroundBlock, wall);
}
