var Question = require('prompt-question');
var Prompt = require('..');
var question = new Question('words', {
  type: 'checkbox',
  message: 'What choices do you want?',
  choices: [
    'first',
    'foo',
    'bar',
    'baz',
    'qux',
    'fez',
    'aaa',
    'bbb',
    'ccc',
    'ddd',
    'eee',
    'fff',
    'ggg',
    'hhh',
    'iii',
    'last',
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
