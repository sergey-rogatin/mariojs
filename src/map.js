import './entityTypes';
import { camera, createMap, playSound, stopSound } from './engine/engine';
import assets from './assets';

const asciiMapRows = [
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '                                                          ',
    '#      #                                                  ',
    '#           ####                                          ',
    '#           #  #                #                         ',
    '#############  ###   #####################################'
];

camera.x = 6;
camera.y = 6;

createMap(asciiMapRows);
