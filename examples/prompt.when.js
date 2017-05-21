var answers = {};

function when(answers) {
  return answers.which.indexOf(this.question.name) !== -1;
}

var Prompt = require('..');
var prompt = new Prompt({
  name: 'which',
  message: 'Which questions do you want to ask?',
  choices: ['letters', 'numbers']
});

var letters = new Prompt({
  name: 'letters',
  message: 'Favorite letters?',
  choices: ['a', 'b', 'c'],
  when: when
});

var numbers = new Prompt({
  name: 'numbers',
  message: 'Favorite numbers?',
  choices: ['1', '2', '3'],
  when: when
});

prompt.run(answers)
  .then(ask(letters))
  .then(ask(numbers))
  .then(function() {
    console.log(answers);
  })
  .catch(function(err) {
    console.log(err)
  })

function ask(fn) {
  return function() {
    return fn.run(answers);
  };
}
