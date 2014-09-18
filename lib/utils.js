/**
 * Padding a string to minlength by appending spaces.
 */
exports.paddingRight = function (str, minlength) {
  while (str.length < minlength) {
    str = str + ' ';
  }
  return str;
};

/**
 * Returns length of longest element.
 */
exports.longest = function (arr) {
  return arr.reduce(function (a, x) {
    if (x.length > a) {
      return x.length;
    }
    return a;
  }, 0);
};
