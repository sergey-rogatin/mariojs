//#region imports
import {
    addEntityType,
    drawSprite,
    keys,
    keyCode,
    time,
    settings,
    playSound,
    removeEntity,
    camera,
    addEntity,
    moveAndCheckForObstacles,
    stopSound,
    checkCollision
} from '../engine/engine';

import { ENTITY_TYPE_WALL, ENTITY_TYPE_MARIO } from '../entityTypes';
import assets from '../assets';
//#endregion

export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
}
