var answers = {};
var Prompt = require('..');
var prompt = new Prompt({
  name: 'colors',
  message: 'What are your favorite colors?',
  radio: true,
  objects: true,
  choices: [
    {name: 'red', category: 'foo'},
    {name: 'blue', category: 'bar', disabled: true},
    {name: 'green', category: 'baz'},
    {name: 'yellow', category: 'fez'},
    {name: 'brown', category: 'qux'},
    {name: 'abc', category: 'abc'},
    {name: 'xyz', category: 'xyz'},
  ]
});

prompt.run(answers)
  .then(function(answers) {
    console.log(answers)
  })
  .catch(function(err) {
    console.log(err)
  })
