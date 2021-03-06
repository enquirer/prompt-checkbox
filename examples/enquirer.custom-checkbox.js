var radio = require('radio-symbol');
var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('..'));
enquirer.question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  checkbox: radio.star,
  choices: [
    'red',
    'blue',
    'yellow'
  ]
});

enquirer.prompt('colors')
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
