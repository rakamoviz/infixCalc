const {calculatePromise} = require('./index');

calculatePromise('1 + 2 * 3 + 4').then(result => {
  console.log(result);
});