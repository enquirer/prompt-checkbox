var Question = require('prompt-question');
var Prompt = require('..');
var question = new Question('colors', 'What are your favorite colors?', {
  type: 'checkbox',
  choiceObject: true,
  groups: {
    foo: {
      choices: [
        {name: 'red'},
        {name: 'blue', disabled: true},
        {name: 'green'},
        {name: 'yellow'}
      ]
    },
    bar: {
      choices: [
        {name: 'red'},
        {name: 'blue', disabled: true},
        {name: 'green'},
        {name: 'yellow'}
      ]
    }
  }
});

var prompt = new Prompt(question);
prompt.run()
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
