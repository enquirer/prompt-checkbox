'use strict';

var debug = require('debug')('prompt-checkbox');
var utils = require('readline-utils');
var Prompt = require('prompt-base');
var log = require('log-utils');

/**
 * Checkbox prompt
 */

function Checkbox(/*question, answers, ui*/) {
  debug('initializing from <%s>', __filename);
  Prompt.apply(this, arguments);
  if (!this.choices) {
    throw new TypeError('expected "options.choices" to be an object or array');
  }
  this.originalDefault = this.question.default;
  this.initCheckbox();
}

/**
 * Inherit Prompt
 */

Prompt.extend(Checkbox);

/**
 * Set the default value to use
 */

Checkbox.prototype.initCheckbox = function() {
  this.checked = [];
  this.position = 0;
  if (this.question.hasDefault) {
    this.choices.enable(this.question.default);
    this.question.default = null;
  }
  if (this.choices.keys.length < 2) {
    this.options.radio = false;
  }
  if (this.options.radio) {
    createRadioOptions.call(this);
  }
};

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the `Checkbox` instance
 */

Checkbox.prototype.ask = function(callback) {
  this.callback = callback;
  this.resume();

  this.ui.once('error', this.onError.bind(this));
  this.only('line', this.onSubmit.bind(this));

  this.only('keypress', function(event) {
    if (event.key.name === 'number') {
      this.onNumberKey(event);
      return;
    }
    if (event.key.name === 'space') {
      this.onSpaceKey();
      return;
    }
    this.move(event.key.name, event);
  }.bind(this));

  // Initialize prompt
  utils.cursorHide(this.rl);
  this.emit('ask', this);
  this.render();
  return this;
};

/**
 * Render the prompt to the terminal
 */

Checkbox.prototype.render = function(err) {
  var error = typeof err === 'string' ? log.red('>> ') + err : '';

  // render question
  var message = this.message;
  if (!this.spaceKeyPressed) {
    message += '(Press <space> to select) ';
  }

  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    message += log.cyan(this.checked.join(', '));
  } else {
    message += this.choices.render(this.position, {paginate: true});
  }

  this.ui.render(message, error);
};

/**
 * Called when user hits a number key
 */

Checkbox.prototype.onNumberKey = function(event) {
  var num = Number(event.value);
  if (num <= this.choices.length) {
    this.position = num - 1;
    this.radio();
  }
  this.render();
};

/**
 * Called when user hits the `space` bar
 */

Checkbox.prototype.onSpaceKey = function() {
  this.spaceKeyPressed = true;
  this.radio();
  this.render();
};

/**
 * When user press `enter` key
 */

Checkbox.prototype.onSubmit = function() {
  var self = this;
  this.answer = this.getSelected();
  this.status = 'answered';
  this.once('answer', function() {
    utils.showCursor(self.rl);
  });

  // removes listeners
  this.only();
  this.submitAnswer();
};

/**
 * Get selected choices (can be overridden)
 */

Checkbox.prototype.getSelected = function() {
  return this.choices.checked.filter(function(ele) {
    return ele !== 'all' && ele !== 'none';
  });
};

/**
 * When user press `enter` key
 */

Checkbox.prototype.radio = function() {
  if (this.options.radio) {
    var choice = this.choices.getChoice(this.position);
    var keys = this.radioKeys;
    var name = choice.name;

    if (name === 'all' || name === 'none') {
      this.choices.toggle(this.position, true);

      if (name === 'all') {
        this.choices.forEach(function(c) {
          if (c.name !== 'all' && c.name !== 'none') {
            c.checked = true;
          }
        });
      }

    } else if (keys.indexOf(name) !== -1) {
      this.choices.toggle(this.position);
      var checked = keys.filter(function(key) {
        return this.choices.getChoice(key).checked;
      }, this);

      this.choices.forEach(function(c) {
        if (checked.indexOf(c.type) !== -1 || checked.indexOf(c.name) !== -1) {
          c.checked = true;
        } else {
          c.checked = false;
        }
      });

    } else {
      this.choices.disable(['all', 'none'].concat(keys));
      this.choices.toggle(this.position);
    }

  } else {
    this.choices.toggle(this.position);
  }
};

function createRadioOptions() {
  this.radioKeys = [];
  var choices = ['all'];
  var orig = this.choices.original;
  var groups = [];

  if (Array.isArray(this.options.radio)) {
    var keys = this.options.radio.slice();
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var heading = false;
      var len = orig.length;
      var idx = -1;
      while (++idx < len) {
        var ele = orig[idx];
        if (typeof ele === 'string') {
          throw new TypeError('expected choice to be an object');
        }

        if (ele.type === key) {
          if (heading === false) {
            heading = true;
            this.radioKeys.push(key);
            choices.push(key);
            groups.push(this.choices.separator(log.underline(log.cyan(key))));
          }
          groups.push(ele);
        }
      }

      if (heading === false) {
        choices = choices.filter(function(name) {
          return name !== key;
        });
      }
    }

    choices.push('none');
  } else {
    groups = orig;
    choices.push('none', this.choices.separator());
  }

  choices = choices.concat(groups);
  this.choices = new this.question.Choices(choices, this.options);
}

/**
 * Module exports
 */

module.exports = Checkbox;
