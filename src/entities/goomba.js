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
    if (!goomba.isInit) {
        goomba.speedX = 2;
        goomba.isInit = true;
    }

    drawSprite(assets.sprGoomba, goomba, 0.1);

    goomba.speedY += settings.gravity * time.deltaTime;
    const { horizWall, vertWall } = moveAndCheckForObstacles(goomba, [
        ENTITY_TYPE_WALL
    ]);

    if (horizWall !== null) {
        if (horizWall.x > goomba.x) {
            goomba.speedX = -2;
        } else {
            goomba.speedX = 2;
        }
    }

    const mario = checkCollision(goomba, [ENTITY_TYPE_MARIO]);
    if (mario != null) {
        if (mario.y < goomba.y) {
            removeEntity(goomba);
            playSound(assets.sndStomp);
        } else {
            removeEntity(mario);
            stopSound(assets.sndMainTheme);
            playSound(assets.sndGameOver);
        }
    }
}
