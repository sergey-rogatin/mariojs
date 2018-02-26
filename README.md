# Mario.JS

**Mario.JS** - это игровой 2D-движок, написанный с использованием *Javascript* и *HTML5 Canvas API*, предназначенный для обучения основам разработки игр.

В данном уроке мы на его примере научимся:
* Считывать ввод игрока с клавиатуры и двигать игрового персонажа (сущность)
* Симулировать физику (силу тяжести, коллизии)
* Анимировать персонажа с помощью спрайтов
* Создавать игровые сущности и добавлять им искусственный интеллект
* Добавлять персонажу взаимодействие с другими сущностями
* Добавлять в игру звуки

## Подготовка к работе
Для работы вам понадобится веб-браузер (например, *Google Chrome*), консоль (например, *cmd* или *powershell*) и текстовый редактор. Вы можете выбрать любой редактор на ваш вкус (даже блокнот подойдет), но я рекомендую *Visual Studio Code*, так как он поддерживает многие часто используемые фичи 'из коробки' и не требует особой настройки.

* Откройте папку Mario.JS в консоли. **Вся дальнейшая работа будет происходить в этой папке**
* Чтобы сделать это в Visual Studio Code:
    * Откройте приложение
    * Файл -> Открыть папку -> выберите папку MarioJS -> Выбор папки
    * Нажмите `ctrl + ~`
* Введите команду `./go-bundler` (powershell) или `go-bundler` (cmd)
* Откройте браузер и перейдите по адресу `localhost:8080`

Если все сделано правильно, вы увидите кирпичные блоки на сером фоне:
![screen](https://i.paste.pics/bfbad6e6054b138d1e0d3fba577f5904.png)

## Базовое движение
Откройте файл `src/map.js`
В нем вы увидите наш игровой уровень в виде ASCII-арта:
```javascript
const asciiMapRows = [
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '#                                                         ',
    '#      #    ####                                          ',
    '#           #  #                                          ',
    '#############  ###   #####################################'
];
```
В этих строках каждый символ означает какую-либо игровую сущность, а пробел - ее отсутствие. Символ **#** означает кирпичный блок ( стену). При запуске игры движок считывает символы по порядку и создает уровень в игре. Попробуйте добавить или удалить блоки, отредактировав строки `asciiMapRows`. Чтобы проверить свои изменения, перезагрузите вкладку в браузере `F5`.

Символ **@** означает персонажа игрока. Вставьте его в уровень и проверьте, что Марио появился в игре:
```javascript
const asciiMapRows = [
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '#   @                                                     ',
    '#      #    ####                                          ',
    '#           #  #                                          ',
    '#############  ###   #####################################'
];
```
![screen](https://i.paste.pics/066ce9f6d78c958478a11766b9f23e0d.png)
Чтобы настроить поведение Марио, откройте файл `src/entities/mario.js`
```javascript
//#region imports...

export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
}
```
Когда игра запущена, функция `updateMario` выполняется  каждый кадр и рисует спрайт Марио на экране с помощью функции `drawSprite`.
```javascript
/**
 * Рисует спрайт по координатам заданной сущности
 * @param {object} sprite: Спрайт, который будет нарисован на экране
 * @param {object} entity: Игровая сущность, по координатам x и y которой
 *   будет нарисован спрайт
 * @param {number} animationSpeed: Скорость смены кадров спрайта
 * @param {number} scaleX: Масштаб по оси x - например, если этот
 *   параметр равен -1, то спрайт будет отражен по горизонтали
 * @param {number} scaleY: Масштаб по оси y
 */
function drawSprite(
    sprite, entity,
    animationSpeed = 0, scaleX = 1, scaleY = 1,
) {...}
```
Параметры `animationSpeed`, `scaleX` и `scaleY` опциональны, так как у них есть значения по умолчанию.
___

Чтобы Марио начал двигаться, функция `updateMario` должна изменять его координаты `mario.x` и `mario.y`. Изменим ее.
__*Измененные строчки отмечены знаком* >. *Этот символ вводить не надо.*__ 
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
>   mario.x += 10 * time.deltaTime;
}
```
Значение `time.deltaTime` означает промежуток времени, прошедший за один кадр. Если интересно, зачем оно нужно, спросите меня =)

Теперь каждый кадр `mario.x` будет увеличиваться на небольшое значение. Перезагрузите страницу `F5` и посмотрите, что получилось. Попробуйте вместо `10` вставить `-10`.
___

Теперь давайте сделаем, чтобы игрок мог управлять движением Марио. Для этого в движке есть специальный массив `keys`, в котором хранится информация о нажатых в данный кадр клавишах. Чтобы получить доступ к нужной клавише, используется объект `keyCode`, который содержит коды клавиш, используемых в игре:
```javascript
const keyRight = keys[keyCode.ARROW_RIGHT];
/**
 * keyRight= {
 *     isDown,    // true, если клавиша нажата в данный момент
 *     wentDown,  // true, если клавиша была нажата в данный кадр
 *     wentUp,    // true, если клавиша отпущена в данный кадр
 * };
 */
```
Теперь мы можем управлять движением Марио с помощью условного оператора `if`:
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
	
>   const keyRight = keys[keyCode.ARROW_RIGHT];
>   if (keyRight.isDown) {
>       mario.x += 10 * time.deltaTime;
>   }
}
```
Марио будет двигаться только тогда,  когда нажата клавиша `->`.
**Самостоятельное задание:** по аналогии добавьте код, чтобы при нажатии `<-` Марио двигался влево.
<details> 
  <summary>Решение</summary>

    export function updateMario(mario) {
        drawSprite(assets.sprMarioIdle, mario);

        const keyRight = keys[keyCode.ARROW_RIGHT];
        if (keyRight.isDown) {
            mario.x += 10 * time.deltaTime;
        }
        
    >   const keyLeft = keys[keyCode.ARROW_LEFT];
    >   if (keyLeft.isDown) {
    >       mario.x -= 10 * time.deltaTime;
    >   }
    }
</details>

___
Теперь спустим Марио с небес на землю силой гравитации. Для этого мы изменим значение `mario.speedY`, которое отвечает за вертикальное перемещение Марио.
Как мы знаем из физики, под воздействием силы тяжести объекты движутся с ускорением, направленным вниз, то есть их скорость постоянно увеличивается. Чтобы симулировать это, мы каждый кадр будем увеличивать скорость Марио на константу `settings.gravity`:
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
	
    const keyRight = keys[keyCode.ARROW_RIGHT];
    if (keyRight.isDown) {
        mario.x += 10 * time.deltaTime;
    }
    const keyLeft = keys[keyCode.ARROW_LEFT];
    if (keyLeft.isDown) {
        mario.x -= 10 * time.deltaTime;
    }
	
>   mario.speedY += settings.gravity * time.deltaTime;
>   mario.y += mario.speedY * time.deltaTime;
}
```

## Продвинутое движение
К этому моменту все уже заметили еще один фатальный недостаток нашего персонажа - он проходит сквозь стены. Чтобы решить эту проблему, в движке есть специальная функция:
```javascript
/**
 * Передвигает сущность и останавливает ее, если
 *   она сталкивается с другими заданными сущностями
 * @param {object} entity: Игровая сущность, которая будет
 *   передвигаться на расстояние entity.speedX и entity.speedY
 * @param {array} otherTypes: Список типов сущностей, с которыми
 *   будет рассчитываться столкновение
 * @returns {object} Сущности, с которыми произошло столкновение в данный кадр
 *   по горизонтали и вертикали
 */
function moveAndCheckForObstacles(entity, otherTypes) {...}
```
Изменим нашу функцию `updateMario`. Теперь мы не будем изменять координаты `mario.x` и `mario.y` напрямую, а будем только управлять его скоростью `mario.speedX` и `mario.speedY` и позволим функции `moveAndCheckForObstacles` сделать остальное:
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);
	
>   const keyRight = keys[keyCode.ARROW_RIGHT];
>   const keyLeft = keys[keyCode.ARROW_LEFT];

>   mario.speedX = (keyRight.isDown - keyLeft.isDown) * 5;
>   mario.speedY += settings.gravity * time.deltaTime;

>   moveAndCheckForObstacles(mario, [ENTITY_TYPE_WALL]);    
}
```
Теперь Марио не проваливается сквозь пол и стены:
![screen](https://i.paste.pics/4bd9a5580a9ed99089555c835940b617.png)

___
Нам осталось только добавить возможность прыгать.
Так как мы не хотим, чтобы Марио мог бесконечно прыгать в воздухе, мы должны разрешать прыгать только если он стоит на блоке. К счастью, функция `moveAndCheckForObstacles` позволяет нам узнать это.
```javascript
const { horizWall, vertWall } = moveAndCheckForObstacles(mario, [ENTITY_TYPE_WALL]);
/**
 * horizWall - результат проверки горизонтальной коллизии
 * vertWall - результат проверки вертикального коллизии
 */
```
Если в данном кадре не произошло коллизии по вертикали или горизонтали, `horizWall` или `vertWall` соответственно будут равны `null`. То есть, если Марио стоит на земле, `vertWall` будет не равен `null`.
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);

    const keyRight = keys[keyCode.ARROW_RIGHT];
    const keyLeft = keys[keyCode.ARROW_LEFT];
>   const keyJump = keys[keyCode.SPACE];

    mario.speedX = (keyRight.isDown - keyLeft.isDown) * 5;
    mario.speedY += settings.gravity * time.deltaTime;

>   if (mario.isOnGround && keyJump.wentDown) {
>       mario.speedY = -12;
>   }

>   const { horizWall, vertWall } = moveAndCheckForObstacles(mario, [ENTITY_TYPE_WALL]);
>   mario.isOnGround = vertWall !== null;
}
```
___
И давайте теперь добавим код, чтобы камера следовала за Марио:
```javascript
export function updateMario(mario) {
    drawSprite(assets.sprMarioIdle, mario);

    const keyRight = keys[keyCode.ARROW_RIGHT];
    const keyLeft = keys[keyCode.ARROW_LEFT];
    const keyJump = keys[keyCode.SPACE];

    mario.speedX = (keyRight.isDown - keyLeft.isDown) * 5;
    mario.speedY += settings.gravity * time.deltaTime;

    if (mario.isOnGround && keyJump.wentDown) {
        mario.speedY = -12;
    }

    const { horizWall, vertWall } = moveAndCheckForObstacles(mario, [ENTITY_TYPE_WALL]);
    mario.isOnGround = vertWall !== null;
	
>   camera.x = mario.x;
}
```
Готово! Теперь у нас есть полноценный игровой персонаж.

## Анимация
Чтобы Марио не оставался в стоячем положении, когда он бегает и прыгает, добавим ему анимацию с помощью уже известной нам функции `drawSprite`. 

Во-первых, мы можем передать туда опциональный четвертый аргумент `scaleX`, чтобы изменить направление изображения, чтобы Марио не бегал спиной вперед. Для этого запишем новое значение `mario.direction`, которое будет меняться в зависимости от того, какая клавиша была нажата последней:
```javascript
export function updateMario(mario) {
    const keyRight = keys[keyCode.ARROW_RIGHT];
    const keyLeft = keys[keyCode.ARROW_LEFT];
    const keyJump = keys[keyCode.SPACE];

    // анимация
>   drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);

    // движение и коллизии
    mario.speedX = (keyRight.isDown - keyLeft.isDown) * 5;
    mario.speedY += settings.gravity * time.deltaTime;

    if (mario.isOnGround && keyJump.wentDown) {
        mario.speedY = -12;
    }

    const { horizWall, vertWall } = moveAndCheckForObstacles(mario, [ENTITY_TYPE_WALL]);
    mario.isOnGround = vertWall !== null;
	
    camera.x = mario.x;
}
```
**Самостоятельное задание**: нужно изменять значение `mario.direction` на **1**, если была нажата клавиша **->**, и на **-1**, если **<-**.

<details> 
  <summary>Решение</summary>

    export function updateMario(mario) {
        const keyRight = keys[keyCode.ARROW_RIGHT];
        const keyLeft = keys[keyCode.ARROW_LEFT];
        const keyJump = keys[keyCode.SPACE];
        
        // анимация
    >   if (keyLeft.isDown) {
    >      mario.direction = -1;
    >   }
    >   if (keyRight.isDown) {
    >       mario.direction = 1;
    >   }

        drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);

        // движение и коллизии
		...
    }

</details>

Во-вторых, мы можем добавить анимацию бега. Для этого нам нужно проверить, равна ли скорость Марио по оси **x** нулю, и если да, рисовать спрайт покоя:
```javascript
drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);
```
Иначе рисовать спрайт бега:
```javascript
drawSprite(assets.sprMarioRunning, mario, 0.2, mario.direction);
```
**Попробуйте сделать это самостоятельно**

<details> 
  <summary>Решение</summary>

    export function updateMario(mario) {
        const keyRight = keys[keyCode.ARROW_RIGHT];
        const keyLeft = keys[keyCode.ARROW_LEFT];
        const keyJump = keys[keyCode.SPACE];
        
        // анимация
        if (keyLeft.isDown) {
           mario.direction = -1;
        }
        if (keyRight.isDown) {
            mario.direction = 1;
        }
        
    >   if (mario.speedX === 0) {
	>       drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);
	>   } else {
	>       drawSprite(assets.sprMarioRunning, mario, 0.2, mario.direction);
	>   }

        // движение и коллизии
        ...
    }

</details>

Теперь осталось добавить только анимацию прыжка. Для того, чтобы определить, находится Марио в воздухе или нет, у нас уже есть значение `mario.isOnGround`:
```javascript
export function updateMario(mario) {
    const keyRight = keys[keyCode.ARROW_RIGHT];
    const keyLeft = keys[keyCode.ARROW_LEFT];
    const keyJump = keys[keyCode.SPACE];
    
    // анимация
    if (keyLeft.isDown) {
       mario.direction = -1;
    }
    if (keyRight.isDown) {
        mario.direction = 1;
    }

>   if (!mario.isOnGround) {
>       drawSprite(assets.sprMarioJumping, mario, 0, mario.direction);
>   } else if (mario.speedX === 0) {
        drawSprite(assets.sprMarioIdle, mario, 0, mario.direction);
    } else {
        drawSprite(assets.sprMarioRunning, mario, 0.2, mario.direction);
    }

    // движение и коллизии
    ...
}
```

## Враги
Добавим на карту в файле `src/map.js` символ **G**:
```javascript
const asciiMapRows = [
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '#   @  #                                                  ',
    '#           ####                                          ',
    '#     G     #  #                                          ',
    '#############  ###   #####################################'
];
```
![screen](https://i.paste.pics/bfc3fb82c35ebb9278736a27a78577de.png)

В игре появился гумба, но если мы заглянем в файл `src/entities/goomba.js`, то увидим, что его функция `updateGoomba` выглядит почти так же, как и `updateMario` до начала нашей работы:
```javascript
export function updateGoomba(goomba) {
    drawSprite(assets.sprGoomba, goomba, 0.1);
}
```
То есть она лишь рисует спрайт, все остальное мы сейчас добавим сами.
Применим к гумбе силу тяжести, как мы делали это с Марио:
```javascript
export function updateGoomba(goomba) {
    drawSprite(assets.sprGoomba, goomba, 0.1);
    
>   goomba.speedY += settings.gravity * time.deltaTime;
>   const { horizWall, vertWall } = moveAndCheckForObstacles(goomba, [ENTITY_TYPE_WALL]);
}
```

Добавим в начало функции сегмент, который будет выполняться не каждый кадр, а лишь однажды, в начале игры. В этом сегменте мы сможем задать начальные параметры сущности, например, начальную скорость:
```javascript
export function updateGoomba(goomba) {
>   if (!goomba.isInit) {
>       goomba.speedX = 2;
>	goomba.isInit = true;
>   }

    drawSprite(assets.sprGoomba, goomba, 0.1);
    
    goomba.speedY += settings.gravity * time.deltaTime;
    const { horizWall, vertWall } = moveAndCheckForObstacles(goomba, [ENTITY_TYPE_WALL]);
}
```
После того, как функция выполнится первый раз, значение `goomba.isInit` станет равно `false`, и условие `!goomba.isInit` больше никогда не позволит выполнить этот сегмент.
___
Теперь гумба идет вправо и навсегда упирается в стену. Добавим его каплю искусственного интеллекта, чтобы он мог определять, что уперся в стену, и поворачивать в противоположную сторону.

Теперь мы используем `horizWall`, чтобы узнать, столкнулись ли мы со стеной по оси **х**.

**Попробуйте решить это самостоятельно**

*Подсказка*: Если было столкновение (`horizWall !== null`) мы можем сравнить положение `goomba.x` и `horizWall.x`, чтобы узнать, уперся ли гумба в стену слева или справа от него, и изменить `goomba.speedX` соответственно. 

<details> 
  <summary>Решение</summary>

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

	>   if (horizWall !== null) {
	>       if (horizWall.x > goomba.x) {
	>           goomba.speedX = -2;
	>       } else {
	>           goomba.speedX = 2;
	>       }
	>   }
	}

</details>

___
Теперь, чтобы Марио не проходил сквозь гумб, сделаем так, чтобы их коллизия оказалось фатальной для одного из них. Для этого мы используем функцию `checkCollision`, очень похожую на ранее использованную `moveAndCheckForObstacles`:
```javascript
/**
 * Проверяет, произошло ли столкновение сущности entity с какой-либо
 *   другой сущностью
 * @param {object} entity: Сущность, которая проверяет столкновение
 * @param {array} otherTypes: Список типов сущностей, с которыми будет
 *   рассчитываться столкновение
 * @returns {object}: Сущность, с которой произошло столкновение в данный
 *   кадр или null
 */
function checkCollision(entity, otherTypes) {...}
```
Она тоже рассчитывает коллизии, но не передвигает сущность, а лишь сообщает нам результат, столкнулись мы с кем-то или нет.
```javascript
const mario = checkCollision(goomba, [ENTITY_TYPE_MARIO]);
```
В значение `mario` будет записана сущность Марио, если мы с ней столкнемся в данный кадр. И, если `mario !== null`, нам осталось только проверить, больше ли `goomba.y`, чем `mario.y`, и удалить одного из них с помощью функции `removeEntity`:
```javascript
/**
 * Удаляет сущность из игры
 * @param {object} entity Удаляемая сущность
 */
function removeEntity(entity) {...}
```
**Попробуйте сделать это самостоятельно**

<details> 
  <summary>Решение</summary>

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

	>   const mario = checkCollision(goomba, [ENTITY_TYPE_MARIO]);
	>   if (mario != null) {
	>       if (mario.y < goomba.y) {
	>           removeEntity(goomba);
	>       } else {
	>           removeEntity(mario);
	>       }
	>   }
	}

</details>

## Звуки
```javascript
/**
 * Проигрывает звук
 * @param {object} sound: Звук
 * @param {bool} loop: Зацикливание звука
 * @param {number} volume: Громкость
 */
function playSound(sound, loop = false, volume = 0.02) {...}

/**
 * Останавливает проигрывание звука
 * @param {object} sound: Звук
 */
function stopSound(sound) {...}
```
Чтобы оживить нашу игру, вставим везде разных звуков.
Включим в начале игры главную тему. Для этого в `src/map.js` добавим вызов этой функции, и передадим вторым аргументом `true`, чтобы зациклить звук.
```javascript
import './entityTypes';
import { camera, createMap, playSound } from './engine/engine';
import assets from './assets';

>playSound(assets.sndMainTheme, true);

const asciiMapRows = ...
```
**Самостоятельное задание**:
У нас есть следующие звуки:
- `assets.sndJump`: звук прыжка
- `assets.sndStomp`: звук смерти гумбы
- `assets.sndGameOver`: звук смерти Марио <br/>
Сделайте так, чтобы они играли в подходящие моменты. Когда начинается воспроизведение `assets.sndGameOver`, стоит остановить воспроизведение главной темы.

## Дополнительное задание
* Сделайте так, чтобы Марио подпрыгивал, когда убивал гумбу
* Попробуйте изменить гравитацию `settings.gravity`
* Попробуйте изменить скорость течения времени `settings.timeSpeed`
* Добавьте в игру монетки. Символ на карте - **0** (ноль), функция `updateCoin` лежит в файле `src/entities/coin.js`. Сделайте так, чтобы монетки исчезали со звуком `assets.sndCoin`, когда их касается Марио.

## Спасибо за участие :3
Если вам понравилось, и вы хотите узнать больше:
* Если вы хотите больше узнать о JavaScript
https://learn.javascript.ru
* Если вы воспринимаете английский на слух, и хотите узнать о геймдеве на C++
https://hero.handmade.network/episode/intro-to-c/day1/
* Если хотите узнать, как написать свой движок на JS, спросите меня)
