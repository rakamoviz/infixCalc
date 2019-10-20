const calculator = require('./index');

calculator.calculatePromise('3_1/2').then(result => {
  console.log(result);
}).catch(error => console.log("error ", error))