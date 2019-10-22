const stdin = process.openStdin();
const calculator = require('./index');

process.stdout.write("? ");
stdin.addListener("data", data => {
  calculator.calculatePromise(data.toString().trim()).then(result => {
    console.log(`= ${result}`);

    process.stdout.write("? ");
  }).catch(error => {
    console.log("! ", error);
    process.stdout.write("? ");
  });
});