import { addEntityType, settings } from './engine/engine';
import { updateMario } from './entities/mario';
import { updateWall } from './entities/wall';
import { updateGoomba } from './entities/goomba';
import { updateCoin } from './entities/coin';

export const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
    bbox: {
        left: -0.5,
        top: 0,
        width: 1,
        height: 1
    }
});

export const ENTITY_TYPE_WALL = addEntityType('#', updateWall, {
    bbox: {
        left: 0,
        top: 0,
        width: settings.tileSize,
        height: settings.tileSize
    }
});

export const ENTITY_TYPE_GOOMBA = addEntityType('G', updateGoomba, {
    bbox: {
        left: -0.5,
        top: 0,
        width: 1,
        height: 1
    }
});

export const ENTITY_TYPE_COIN = addEntityType('0', updateCoin, {
    bbox: {
        left: 0,
        top: 0,
        width: 1,
        height: 1
    }
});
