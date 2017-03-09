var Question = require('prompt-question');
var Prompt = require('..');
var question = new Question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  choiceObject: true,
  choices: [
    {name: 'red', category: 'foo'},
    {name: 'blue', category: 'bar', disabled: true},
    {name: 'green', category: 'baz'},
    {name: 'yellow', category: 'fez'}
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
