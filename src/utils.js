/**
 * returns the middle of three numbers
 * @param {number} a
 * @param {number} b 
 * @param {number} c 
 */
function median(a, b, c) {
  return a > b ? (c > a ? a : (b > c ? b : c)) : (c > b ? b : (a > c ? a : c));
}


export default {
  median,
};
