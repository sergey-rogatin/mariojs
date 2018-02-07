import { createMap, camera, playSound } from './engine/engine';
import audioMainTheme from './sounds/mainTheme.mp3';

camera.x = 10;
camera.y = 6;

const asciiMapRows = [
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '                                                          ',
  '##########################################################'
];

createMap(asciiMapRows);
