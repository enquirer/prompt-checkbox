var Question = require('prompt-question');
var Prompt = require('..');
var question = new Question('colors', {
  type: 'checkbox',
  message: 'What are your favorite colors?',
  choices: [
    'red',
    'blue',
    'yellow',
    'green',
    'magenta'
  ]
});

var prompt = new Prompt(question);
prompt.run()
  .then(function(answers) {
    console.log(arguments)
  })
  .catch(function(err) {
    console.log(err)
  })
