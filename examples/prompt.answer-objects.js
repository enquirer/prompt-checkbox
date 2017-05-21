var answers = {};
var Prompt = require('..');
var prompt = new Prompt({
  name: 'colors',
  message: 'What are your favorite colors?',
  choices: [
    {name: 'red', category: 'foo'},
    {name: 'green', category: 'baz'},
    {name: 'yellow', category: 'fez'},
    {name: 'brown', category: 'qux'},
    {name: 'abc', category: 'abc'},
    {name: 'xyz', category: 'xyz'}
  ],
  transform: function(answer) {
    return answer ? answer.map(this.choices.get.bind(this.choices)) : [];
  }
});

prompt.run(answers)
  .then(function(answer) {
    console.log(answer)
  })
  .catch(function(err) {
    console.log(err)
  })
