const calculator = require('./index');

calculator.calculatePromise('1/2 * 3_3/4').then(result => {
  console.log(result);
}).catch(error => console.log("error ", error))