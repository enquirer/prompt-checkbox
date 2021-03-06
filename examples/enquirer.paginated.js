var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.register('checkbox', require('..'));
enquirer.question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  default: 'red',
  choices: [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'violet',
    'indigo',
    'cyan',
    'magenta'
  ]
});

enquirer.ask('colors')
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
