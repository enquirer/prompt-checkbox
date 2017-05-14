'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');
var prompt;
var unmute;

describe('.run', function() {
  beforeEach(function() {
    prompt = new Prompt({name: 'fixture'});
    unmute = prompt.mute();
  });

  afterEach(function() {
    unmute();
  });

  it('should use a default choice', function(cb) {
    prompt.question.default = 'green';
    prompt.choices = ['red', 'green', 'blue'];

    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.deepEqual(answer, ['green']);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });

  it('should use an array of default choices', function(cb) {
    prompt.question.default = ['green', 'red'];
    prompt.choices = ['red', 'green', 'blue'];

    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.deepEqual(answer, ['red', 'green']);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });

  it('should not use default if it is not a valid choice', function(cb) {
    prompt.question.default = ['black'];
    prompt.choices = ['red', 'green', 'blue'];

    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.deepEqual(answer, []);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });

  it('should return choice objects when options.objects is true', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.options.objects = true;
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

  it('should validate choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.question.validate = function() {
      if (!this.choices.checked.length) {
        setImmediate(function() {
          prompt.choices.check('red');
          prompt.rl.emit('line');
        });
        return 'check something!';
      }
      return true;
    };

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red']);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });

  it('should toggle all choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.toggle();

    prompt.run()
      .then(function(answer) {
        assert(Array.isArray(answer));
        assert.deepEqual(answer, ['red', 'green', 'blue']);
        cb();
      })
      .catch(cb);

    prompt.rl.emit('line');
  });

  it('should toggle all choices when emitted on "ask"', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.toggle();

    prompt.on('ask', function() {
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green', 'blue']);
        cb();
      })
      .catch(cb);
  });

  it('should toggle the specified choice', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.toggle('red');

    prompt.on('ask', function() {
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red']);
        cb();
      })
      .catch(cb);
  });

  it('should toggle the specified choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.toggle(['red', 'blue']);

    prompt.on('ask', function() {
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'blue']);
        cb();
      })
      .catch(cb);
  });

  it('should check the specified choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.check(['red', 'blue']);

    prompt.on('ask', function() {
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'blue']);
        cb();
      })
      .catch(cb);
  });

  it('should uncheck the specified choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    prompt.choices.toggle();
    prompt.choices.uncheck(['red', 'blue']);

    prompt.on('ask', function() {
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['green']);
        cb();
      })
      .catch(cb);
  });

  it('should check "all" of the choices', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', 'a');
      prompt.rl.emit('line');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green', 'blue']);
        cb();
      })
      .catch(cb);
  });

  it('should add input from multiple keypress events to readline', function(cb) {
    var count = 0;
    prompt.only('keypress', function() {
      count++;
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, 'foo');
        assert.equal(count, 4);
        cb();
      })
      .catch(cb);

    prompt.rl.input.emit('keypress', 'f');
    prompt.rl.input.emit('keypress', 'o');
    prompt.rl.input.emit('keypress', 'o');
    prompt.rl.input.emit('keypress', '\n');
  });

  it('should handle "number" keypress events', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    var events = [];

    prompt.only('keypress', function(name) {
      events.push(name);
    });

    prompt.run()
      .then(function(answer) {
        assert.equal(events.length, 2);
        assert.equal(events[0], 'number');
        assert.equal(events[1], 'enter');
        assert.deepEqual(answer, ['red']);
        cb();
      })
      .catch(cb);

    setImmediate(function() {
      prompt.rl.input.emit('keypress', '1');
      prompt.rl.input.emit('keypress', '\n');
    });
  });

  it('should select a choice with a number keypress', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '2');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['green']);
        cb();
      })
      .catch(cb);
  });

  it('should select multiple choices from number keypresses', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '23');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['green', 'blue']);
        cb();
      })
      .catch(cb);
  });

  it('should select around disabled choices', function(cb) {
    prompt.choices = ['red', {name: 'yellow', disabled: true}, 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '12');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green']);
        cb();
      })
      .catch(cb);
  });

  it('should select a choice from a space keypress', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red']);
        cb();
      })
      .catch(cb);
  });

  it('should select multiple choices from space events', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];
    var events = [];

    prompt.only('keypress', function(name) {
      events.push(name);
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green']);

        assert.equal(events.length, 3);
        assert.equal(events[0], 'space');
        assert.equal(events[1], 'down');
        assert.equal(events[2], 'space');
        cb();
      })
      .catch(cb);

    setImmediate(function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', 'n', {name: 'down', ctrl: true});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.emit('line');
    });
  });

  it('should select multiple choices from space event on "ask"', function(cb) {
    prompt.choices = ['red', 'green', 'blue'];

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', 'n', {name: 'down', ctrl: true});
      prompt.rl.input.emit('keypress', ' ', {name: 'space'});
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, ['red', 'green']);
        cb();
      })
      .catch(cb);
  });
});
