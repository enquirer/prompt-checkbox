'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');
var prompt;
var unmute;

describe('.ask', function() {
  beforeEach(function() {
    prompt = new Prompt({name: 'fixture'});
    unmute = prompt.mute();
  });

  afterEach(function() {
    unmute();
  });

  it('should select a choice directly', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['blue']);
      cb();
    });

    prompt.choices.check('blue');
    prompt.rl.emit('line');
  });

  it('should select multiple choices directly', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red', 'blue']);
      cb();
    });

    prompt.choices.check(['red', 'blue']);
    prompt.rl.emit('line');
  });

  it('should select a choice with a "number" keypress event', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    var events = [];

    prompt.only('keypress', function(name) {
      events.push(name);
    });

    prompt.ask(function(answer) {
      assert.equal(events.length, 2);
      assert.equal(events[0], 'number');
      assert.equal(events[1], 'enter');
      assert.deepEqual(answer, ['red']);
      cb();
    });

    prompt.rl.input.emit('keypress', '1', {name: 'number'});
    prompt.rl.input.emit('keypress', '\n');
  });

  it('should select multiple choices from "number" events', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    var events = [];

    prompt.only('keypress', function(name) {
      events.push(name);
    });

    prompt.ask(function(answer) {
      assert.equal(events.length, 3);
      assert.equal(events[0], 'number');
      assert.equal(events[1], 'number');
      assert.equal(events[2], 'enter');
      assert.deepEqual(answer, ['red', 'green']);
      cb();
    });

    prompt.rl.input.emit('keypress', '1', {name: 'number'});
    prompt.rl.input.emit('keypress', '2', {name: 'number'});
    prompt.rl.input.emit('keypress', '\n');
  });

  it('should select a choice on "ask" event', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.once('ask', function() {
      prompt.choices.check('blue');
      prompt.rl.emit('line');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['blue']);
      cb();
    });
  });

  it('should select a choice with space keypress', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red']);
      cb();
    });

    prompt.rl.input.emit('keypress', ' ', {name: 'space'});
    prompt.rl.emit('line');
  });

  it('should select a choice with space keypress on "ask"', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red']);
      cb();
    });
  });

  it('should select multiple numbers from one keypress event', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.once('ask', function() {
      prompt.rl.input.emit('keypress', '23');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['green', 'blue']);
      cb();
    });
  });

  it('should select choices around a disabled choice', function(cb) {
    prompt.choices = ['red', {name: 'yellow', disabled: true}, 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '12');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red', 'green']);
      cb();
    });
  });

  it('should select multiple choices from space keypresses', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', 'n', {name: 'down', ctrl: true});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, ['red', 'green']);
      cb();
    });
  });
});
