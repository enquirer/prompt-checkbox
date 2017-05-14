'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');
var prompt;
var unmute;

describe('prompt-checkbox', function() {
  beforeEach(function() {
    prompt = new Prompt({name: 'fixture', radio: true});
    unmute = prompt.mute();
  });

  afterEach(function() {
    unmute();
  });

  it('should export a function', function() {
    assert.equal(typeof Prompt, 'function');
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      Prompt();
    }, /question/i);
  });
});
