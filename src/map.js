import {
  createMap,
  camera,
  playSound,
  drawText,
  addEntity,
  addEntityType,
  loadSound,
  settings
} from './engine/engine';
import audioMainTheme from './sounds/mainTheme.mp3';
const sndMainTheme = loadSound(audioMainTheme);

camera.x = 0;
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
