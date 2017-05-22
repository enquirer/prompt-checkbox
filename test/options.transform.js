'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');
var prompt;
var unmute;

describe('options.transform', function() {
  beforeEach(function() {
    prompt = new Prompt({name: 'fixture'});
    unmute = prompt.mute();
  });

  afterEach(function() {
    unmute();
  });

  it('should return choice objects', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.options.transform = function(answer) {
      return answer ? answer.map(this.choices.get.bind(this.choices)) : [];
    };
    prompt.choices.toggle();

    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.deepEqual(answer, [
          { name: 'red', short: 'red', value: 'red', checked: true },
          { name: 'green', short: 'green', value: 'green', checked: true },
          { name: 'blue', short: 'blue', value: 'blue', checked: true }
        ]);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });
});
