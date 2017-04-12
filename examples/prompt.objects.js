var answers = {};
var Prompt = require('..');
var prompt = new Prompt({
  name: 'colors',
  message: 'What are your favorite colors?',
  type: 'checkbox',
  choiceObject: true,
  radio: true,
  choices: [
    {name: 'red', category: 'foo'},
    {name: 'blue', category: 'bar', disabled: true},
    {name: 'green', category: 'baz'},
    {name: 'yellow', category: 'fez'}
  ]
});

prompt.run(answers)
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
