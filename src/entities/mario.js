export const ENTITY_TYPE_MARIO = addEntityType('@', updateMario, {
  bbox: {
    left: -0.45,
    top: -1,
    width: 0.9,
    height: 1
  }
});

export function updateMario(mario) {
  if (!mario.isInitialized) {
    // Код в этом блоке выполняется только при создании объекта
    mario.startX = mario.x;
    mario.startY = mario.y;

    mario.isInitialized = true;
  }

  // Весь код ниже выполняется каждый кадр
  const dir = mario.direction || 1;
  const absSpeedX = Math.abs(mario.speedX);

  // Рисуем спрайт марио на экране
  drawSprite(sprMarioIdle, mario, 0, dir);

  // Двигаемся, если игрок нажимает на клавиши
  const keyLeft = keys[keyCode.ARROW_LEFT];
  const keyRight = keys[keyCode.ARROW_RIGHT];
  const keySpace = keys[keyCode.SPACE];

  const accelConst = 60;
  const friction = 10;

  const accelX = (keyRight.isDown - keyLeft.isDown) * accelConst;

  if (keyRight.isDown) {
    mario.direction = 1;
  }
  if (keyLeft.isDown) {
    mario.direction = -1;
  }

  mario.speedX += accelX * time.deltaTime;
  mario.speedY += settings.gravity * time.deltaTime;
  mario.speedX *= 1 - friction * time.deltaTime;

  const { vertWall } = moveAndCheckForObstacles(mario, [
    ENTITY_TYPE_WALL,
    ENTITY_TYPE_QUESTION_BLOCK
  ]);
  mario.isOnGround = Boolean(vertWall && vertWall.y <= mario.y);

  // прыгаем
  if (keySpace.wentDown && mario.isOnGround) {
    mario.speedY = -12;
    playSound(sndJump);
  }

  // Создаем марио заново, если он упал за пределы экрана
  if (mario.y > 30) {
    removeEntity(mario);
    const newMario = addEntity(ENTITY_TYPE_MARIO);
    newMario.x = mario.startX;
    newMario.y = mario.startY;
  }

  camera.x = mario.x;
}
