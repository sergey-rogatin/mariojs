//#region imports
import { addEntityType, settings, drawSprite } from '../engine/engine';
import assets from '../assets';
//#endregion

export function updateWall(wall) {
    drawSprite(assets.sprGroundBlock, wall);
}
