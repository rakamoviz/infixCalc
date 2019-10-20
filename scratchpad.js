const calculator = require('./index');

calculator.calculatePromise('1 + 2 * 3 + 4').then(result => {
  console.log(result);
}).catch(error => console.log("error ", error))