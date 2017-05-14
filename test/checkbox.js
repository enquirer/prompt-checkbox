'use strict';

// var UI = require('readline-ui');
var clone = require('clone-deep');
var assert = require('assert');
var fixtures = require('./fixtures');
var Prompt = require('..');
var fixture;
var prompt;
var unmute;
var rl;

function last(arr, n) {
  return arr[arr.length - (n || 1)];
}

describe('prompt-checkbox', function() {
  beforeEach(function() {
    fixture = clone(fixtures.checkbox);
    prompt = new Prompt(fixture);
    unmute = prompt.mute();
  });

  afterEach(function() {
    unmute();
  });

  it('should return a single selected choice in an array', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.equal(answer.length, 1);
        assert.equal(answer[0], 'choice 1');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should return multiples selected choices in an array', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.equal(answer.length, 2);
        assert.equal(answer[0], 'choice 1');
        assert.equal(answer[1], 'choice 2');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', null, {name: 'down'});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should check defaults choices', function(cb) {
    fixture.choices = [
      {name: '1', checked: true},
      {name: '2', checked: false},
      {name: '3', checked: false}
    ];

    prompt = new Prompt(fixture);
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 1);
        assert.equal(answer[0], '1');
        cb();
      });

    setImmediate(function() {
      prompt.rl.emit('line');
    });
  });

  it('provide an array of checked choice to validate', function() {
    fixture.choices = [
      {name: '1', checked: true},
      {name: '2', checked: true},
      {name: '3', checked: false}
    ];

    fixture.validate = function(answer) {
      assert.deepEqual(answer, ['1', '2']);
      return true;
    };

    prompt = new Prompt(fixture, rl);
    var promise = prompt.run();

    setImmediate(function() {
      prompt.rl.emit('line');
    });
    return promise;
  });

  it('should check defaults choices if given as an array', function(cb) {
    fixture.choices = [
      {name: '1'},
      {name: '2'},
      {name: '3'}
    ];
    fixture.default = ['1', '3'];
    prompt = new Prompt(fixture, rl);
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 2);
        assert.equal(answer[0], '1');
        assert.equal(answer[1], '3');
        cb();
      });

    setImmediate(function() {
      prompt.rl.emit('line');
    });
  });

  it('should toggle choice when hitting space', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 1);
        assert.equal(answer[0], 'choice 1');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', null, {name: 'down'});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should support arrow navigation', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 1);
        assert.equal(answer[0], 'choice 2');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', null, {name: 'down'});
      prompt.rl.input.emit('keypress', null, {name: 'down'});
      prompt.rl.input.emit('keypress', null, {name: 'up'});

      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should support emacs-style navigation', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 1);
        assert.equal(answer[0], 'choice 2');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', 'n', {name: 'n', ctrl: true});
      prompt.rl.input.emit('keypress', 'n', {name: 'n', ctrl: true});
      prompt.rl.input.emit('keypress', 'p', {name: 'p', ctrl: true});

      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should support 1-9 shortcut key', function(cb) {
    prompt.run()
      .then(function(answer) {
        assert.equal(answer.length, 1);
        assert.equal(answer[0], 'choice 2');
        cb();
      });

    setImmediate(function() {
      prompt.rl.input.emit('keypress', '2');
      prompt.rl.emit('line');
    });
  });

  it('should select all answers if <a> is pressed', function() {
    var promise = prompt.run();

    setImmediate(function() {
      prompt.rl.input.emit('keypress', 'a', {name: 'a'});
      prompt.rl.emit('line');
    });

    return promise.then(function(answer) {
      assert.equal(answer.length, 3);
    });
  });

  it('should select no answers if <a> is pressed a second time', function() {
    var promise = prompt.run();

    setImmediate(function() {
      prompt.rl.input.emit('keypress', 'a', {name: 'a'});
      prompt.rl.input.emit('keypress', 'a', {name: 'a'});
      prompt.rl.emit('line');
    });

    return promise.then(function(answer) {
      assert.equal(answer.length, 0);
    });
  });

  it('should select the inverse of the current selection when <i> is pressed', function() {
    var promise = prompt.run();

    setImmediate(function() {
      prompt.rl.input.emit('keypress', 'i', {name: 'i'});
      prompt.rl.emit('line');
    });

    return promise.then(function(answer) {
      assert.equal(answer.length, 3);
    });
  });

  describe('with disabled choices', function() {
    beforeEach(function() {
      fixture.choices.push({
        name: 'dis1',
        disabled: true
      });

      fixture.choices.push({
        name: 'dis2',
        disabled: 'uh oh'
      });

      prompt = new Prompt(fixture);
    });

    it('should output disabled choices and custom messages', function() {
      var dis1 = last(prompt.choices.choices, 2);
      var dis2 = last(prompt.choices.choices, 1);

      assert.equal(dis1.line, ' \u001b[90mⓧ\u001b[39m \u001b[2mdis1 (Disabled)\u001b[22m\n');
      assert.equal(dis2.line, ' \u001b[90mⓧ\u001b[39m \u001b[2mdis2 (uh oh)\u001b[22m\n');
    });

    it('skip disabled choices', function(cb) {
      prompt.run()
        .then(function(answer) {
          assert.equal(answer[0], 'choice 1');
          cb();
        });

      setImmediate(function() {
        prompt.rl.input.emit('keypress', null, {name: 'down'});
        prompt.rl.input.emit('keypress', null, {name: 'down'});
        prompt.rl.input.emit('keypress', null, {name: 'down'});

        prompt.rl.input.emit('keypress', ' ', {name: 'space'});
        prompt.rl.emit('line');
      });
    });

    it('uncheck disabled defaults choices', function(cb) {
      fixture.choices = [
        {name: '1', checked: true, disabled: true},
        {name: '2'}
      ];

      prompt = new Prompt(fixture);
      prompt.run()
        .then(function(answer) {
          assert.equal(answer.length, 0);
          cb();
        });

      setImmediate(function() {
        prompt.rl.emit('line');
      });
    });

    it('should support disabled as a function', function() {
      fixture.choices = [
        {
          name: 'dis1',
          disabled: function(answers) {
            return true;
          }
        }
      ];

      prompt = new Prompt(fixture);
      prompt.run()
        .then(function() {
          var dis1 = last(prompt.choices.choices);
          assert.equal(dis1.disabled, true);
        });

      setImmediate(function() {
        prompt.rl.emit('line');
      });
    });
  });
});
