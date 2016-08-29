var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('./'));
enquirer.question('color', 'What is your favorite color?', {
  default: 'blue',
  type: 'checkbox',
  // choices: ['red', 'yellow', 'blue']
});

enquirer.ask('color')
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  });
