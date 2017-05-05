'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('./');

describe('prompt-checkbox', function() {
  it('should export a function', function() {
    assert.equal(typeof Prompt, 'function');
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      new Prompt();
    }, /question/i);
  });

  it('should return an answers object on run', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    prompt.on('ask', function() {
      setImmediate(function() {
        prompt.onNumberKey({value: 1});
        prompt.rl.write('\n');
      });
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red']);
        cb();
      })
  });

  it('should return an answers object on ask', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    prompt.on('ask', function() {
      setImmediate(function() {
        prompt.onNumberKey({value: 1});
        prompt.rl.write('\n');
      });
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red']);
      cb();
    });
  });
});
