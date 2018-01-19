/**
 * returns the middle of three numbers
 * @param {number} a
 * @param {number} b
 * @param {number} c
 */
function averageOfThree(a, b, c) {
  return a > b === a < c ? a : b > a === b < c ? b : c;
}

function unorderedList() {
  return {
    items: [],
    freeSpaces: [],
    add(value) {
      let index = this.items.length;
      if (this.freeSpaces.length) {
        index = this.freeSpaces.pop();
      }
      this.items[index] = value;
      return index;
    },
    remove(index) {
      this.freeSpaces.push(index);
      this.items[index] = unorderedList.REMOVED_ITEM;
    }
  };
}
unorderedList.REMOVED_ITEM = Symbol('REMOVED_ITEM');

export default {
  averageOfThree,
  unorderedList
};
