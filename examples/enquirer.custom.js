var Enquirer = require('enquirer');
var radio = require('radio-symbol');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('..'));
enquirer.question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  default: 'red',
  checkbox: radio.star,
  pointer: '♥',
  choices: [
    'red',
    'blue',
    'yellow'
  ]
});

enquirer.ask('colors')
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
