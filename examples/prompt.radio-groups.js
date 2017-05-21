var Prompt = require('..');
var prompt = new Prompt({
  name: 'install',
  message: 'Which packages do you want to install?',
  radio: true,
  choices: {
    dependencies: ['generate', 'micromatch'],
    devDependencies: ['mocha', 'kind-of']
  }
});

prompt.run()
  .then(function(answer) {
    console.log(answer);
  })
