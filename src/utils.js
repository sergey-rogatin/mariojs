/**
 * returns the middle of three numbers
 * @param {number} a
 * @param {number} b
 * @param {number} c
 */
function median(a, b, c) {
  return a > b ? (c > a ? a : b > c ? b : c) : c > b ? b : a > c ? a : c;
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

const testMethod = () => {
  console.log('parcel is working dsad');
};

export default {
  median,
  unorderedList,
  testMethod
};
