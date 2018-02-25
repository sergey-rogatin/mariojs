import './entityTypes';
import { camera, createMap, playSound, stopSound } from './engine/engine';
import assets from './assets';

playSound(assets.sndMainTheme, true);

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
    '#    G      ####                                          ',
    '#           #  #                                          ',
    '#############  ###   #####################################'
];

camera.x = 6;
camera.y = 6;

createMap(asciiMapRows);
