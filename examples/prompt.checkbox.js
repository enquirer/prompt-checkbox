var radio = require('radio-symbol');
var Question = require('prompt-question');
var Prompt = require('..');

var prompt = new Prompt({
  name: 'color',
  type: 'checkbox',
  message: 'What are your favorite colors?',
  checkbox: radio.star,
  choices: [
    'red',
    'blue',
    'yellow'
  ]
});

prompt.run()
  .then(function(answers) {
    console.log(arguments)
  })
  .catch(function(err) {
    console.log(err)
  })
