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
    const keyRight = keys[keyCode.ARROW_RIGHT];
    const keyLeft = keys[keyCode.ARROW_LEFT];
    const keyJump = keys[keyCode.SPACE];

    if (keyLeft.isDown) {
        mario.direction = -1;
    }
    if (keyRight.isDown) {
        mario.direction = 1;
    }

    if (!mario.isOnGround) {
        drawSprite(assets.sprMarioJumping, mario, 0, mario.direction);
    } else if (mario.speedX === 0) {
        drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);
    } else {
        drawSprite(assets.sprMarioRunning, mario, 0.2, mario.direction);
    }

    mario.speedX = (keyRight.isDown - keyLeft.isDown) * 5;
    mario.speedY += settings.gravity * time.deltaTime;

    if (mario.isOnGround && keyJump.wentDown) {
        playSound(assets.sndJump);
        mario.speedY = -12;
    }

    const { horizWall, vertWall } = moveAndCheckForObstacles(mario, [
        ENTITY_TYPE_WALL
    ]);
    mario.isOnGround = vertWall !== null;

    camera.x = mario.x;
}
