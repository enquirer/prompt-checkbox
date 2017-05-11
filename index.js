'use strict';

var debug = require('debug')('prompt-checkbox');
var utils = require('readline-utils');
var Prompt = require('prompt-base');
var log = require('log-utils');

/**
 * Checkbox prompt
 */

function Checkbox(/*question, answers, ui*/) {
  debug('initializing from <%s> <parent: %s>', __filename, module.parent.id);
  Prompt.apply(this, arguments);
  if (!this.choices) {
    throw new TypeError('expected "options.choices" to be an object or array');
  }
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
  var opts = this.options;
  this.position = 0;
  this.checked = [];

  if (this.question.hasDefault) {
    this.choices.check(this.question.default);
    this.question.default = null;
  }
  if (this.choices.keys.length < 2) {
    this.options.radio = false;
  }
  if (opts.radio) {
    this.radioOptions();
  }
  if (opts.objects === true) {
    opts.choiceObject = true;
  }
  if (opts.paginate !== false) {
    opts.paginate = true;
  }
  if (typeof opts.limit !== 'number') {
    opts.limit = 9;
  }
};

/**
 * Render the prompt to the terminal
 */

Checkbox.prototype.render = function(state) {
  var append = typeof state === 'string' ? log.red('>> ') + state : '';
  this.rl.line = '';

  // render question
  var message = this.message;
  if (!this.spaceKeyPressed) {
    message += '(Press <space> to select) ';
  }

  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    message += log.cyan(this.checked.join(', '));
  } else {
    message += this.choices.render(this.position, this.options);
  }

  this.ui.render(message, append);
};

/**
 * Get selected choices (can be overridden)
 */

Checkbox.prototype.getAnswer = function() {
  return this.choices.checked;
};

/**
 * When user press `enter` key
 */

Checkbox.prototype.radio = function() {
  if (this.options.radio) {
    var choice = this.choices.get(this.position);
    var none = this.choices.getIndex('none');

    if (choice.name === 'all') {
      this.choices[choice.checked ? 'uncheck' : 'check']();
      this.choices.toggle('none');

    } else if (choice.name === 'none') {
      this.choices.uncheck();
      this.choices.check(this.position);

    } else {
      this.choices.uncheck(['all', 'none']);
      this.choices.toggle(this.position);
    }

  } else {
    this.choices.toggle(this.position);
  }
};

/**
 * Create Radio options when `options.radio` is true
 */

Checkbox.prototype.radioOptions = function() {
  var orig = this.choices.original;
  var blank = this.choices.separator('');
  var line = this.choices.separator();
  var choices = [blank, 'all', 'none', line].concat(orig);
  this.question.choices = new this.question.Choices(choices, this.options);
};

/**
 * Module exports
 */

module.exports = Checkbox;
