'use strict';

require('mocha');
var assert = require('assert');
var answer = require('prompt-answer');
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

  it('should accept a number keypress on run', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    answer(prompt, 2);

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['green']);
        cb();
      })
  });

  it('should accept an array of number keypresses on run', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    answer(prompt, [1, 2]);

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green']);
        cb();
      })
  });

  it('should accept a number keypress on ask', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    answer(prompt, 2);

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['green']);
      cb();
    });
  });

  it('should accept an array of number keypresses on ask', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    answer(prompt, [1, 2]);

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red', 'green']);
      cb();
    });
  });
});
