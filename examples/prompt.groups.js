var answers = {};
var Prompt = require('..');
var prompt = new Prompt({
  name: 'colors',
  message: 'What are your favorite colors?',
  choices: {
    foo: ['a', 'b', 'c'],
    bar: ['d', 'e', 'f']
  }
});

prompt.run(answers)
  .then(function(answer) {
    console.log(answer)
  })
  .catch(function(err) {
    console.log(err)
  })
