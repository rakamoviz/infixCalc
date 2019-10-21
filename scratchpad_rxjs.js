const {calculate} = require('./index');

calculate('1 + 2 * 3 + 4').subscribe(result => {
  console.log(result);
});