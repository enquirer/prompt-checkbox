var colors = require('ansi-colors');
var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('..'));
enquirer.question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  pointer: colors.magenta('♥♥♥'),
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
