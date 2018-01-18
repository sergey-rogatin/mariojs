/* eslint-disable */

// как я представляю себе использование готового апи
import engine from './index';

let {
  addEntityType,
  destroyEntity,
  keys,
  keyCode,
  addEntity,
} = engine;

let ENTITY_TYPE_MARIO = addEntityType('@', updateMario);
let ENTITY_TYPE_GOOMBA = addEntityType('&', updateGoomba);
let ENTITY_TYPE_WALL = addEntityType('#', updateWall);

let map = `
#                                      
#                                      
#                                      
#                                      
#                           #          
#     #                     #          
# @   #                     #          
###################  ##################`;

createMap(map);


function updateMario(mario) {
  let keyRight = keys[keyCode.ARROW_RIGHT];
  if (keyRight.isPressed) {
    mario.speedX += 1;
  }

  moveAndCheckForObstacles(mario, ENTITY_TYPE_WALL);

  let hitEnemy = checkCollision(mario, ENTITY_TYPE_GOOMBA);
  if (hitEnemy) {
    if (mario.y > hitEnemy.y + hitEnemy.height / 2) {
      destroyEntity(hitEnemy);
    } else {
      destroyEntity(mario);
    }
  }

  if (mario.speedX) {
    drawSprite(sprites.marioRunning, mario.x, mario.y);
  } else {
    drawSprite(sprites.marioIdle, mario.x, mario.y);
  }
}
