import { loadSound, loadSprite } from './engine/engine';

import audioMainTheme from 'url:./sounds/mainTheme.mp3';
import imgCoin from 'url:./sprites/coin.png';
import audioCoin from 'url:./sounds/coin.wav';
import audioStomp from 'url:./sounds/stomp.wav';
import audioGameOver from 'url:./sounds/gameOver.wav';
import audioJump from 'url:./sounds/jump.wav';

import imgGoomba from 'url:./sprites/goomba.png';
import imgMarioRunning from 'url:./sprites/marioRunning.png';
import imgMarioIdle from 'url:./sprites/marioIdle.png';
import imgMarioJumping from 'url:./sprites/marioJumping.png';
import imgQuestionBlock from 'url:./sprites/questionBlock.png';
import imgGroundBlock from 'url:./sprites/groundBlock.png';

const assets = {
    sndMainTheme: loadSound(audioMainTheme),
    sndCoin: loadSound(audioCoin),
    sprCoin: loadSprite(imgCoin, 0, 0, 2),
    sndStomp: loadSound(audioStomp),
    sprGoomba: loadSprite(imgGoomba, -8, 0, 2),
    sprMarioRunning: loadSprite(imgMarioRunning, -8, 0, 2),
    sprMarioJumping: loadSprite(imgMarioJumping, -8, 0),
    sprMarioIdle: loadSprite(imgMarioIdle, -8, 0),
    sndJump: loadSound(audioJump),
    sprQuestionBlock: loadSprite(imgQuestionBlock, 0, 0, 1),
    sprGroundBlock: loadSprite(imgGroundBlock, 0, 0),
    sndGameOver: loadSound(audioGameOver)
};

export default assets;
