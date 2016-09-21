var Question = require('prompt-question');
var Prompt = require('..');
var question = new Question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  choices: [
    'red',
    {name: 'blue', disabled: true},
    'green',
    'yellow'
  ]
});

var prompt = new Prompt(question);
prompt.run()
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
