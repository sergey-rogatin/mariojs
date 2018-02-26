//#region imports
import {
    drawSprite,
    time,
    checkCollision,
    playSound,
    removeEntity,
    moveAndCheckForObstacles,
    settings,
    stopSound
} from '../engine/engine';
import assets from '../assets';
import { ENTITY_TYPE_MARIO, ENTITY_TYPE_WALL } from '../entityTypes';
//#endregion

export function updateGoomba(goomba) {
    drawSprite(assets.sprGoomba, goomba, 0.1);
}
