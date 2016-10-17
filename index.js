'use strict';

var debug = require('debug')('prompt-checkbox');
var Prompt = require('prompt-base');
var cursor = require('cli-cursor');
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
  this.checked = [];
  this.position = 0;
  this.setDefault();
  this.question.default = null;
}

/**
 * Inherit Prompt
 */

Prompt.extend(Checkbox);

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the `Checkbox` instance
 */

Checkbox.prototype.ask = function(cb) {
  this.callback = cb;

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
  cursor.hide();
  this.render();
  return this;
};

/**
 * Render the prompt to the terminal
 */

Checkbox.prototype.render = function(state) {
  var append = typeof state === 'string'
    ? log.red('>> ') + state
    : '';

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

  this.ui.render(message, append);
};

/**
 * When user presses the `space` bar
 */

Checkbox.prototype.onSpaceKey = function() {
  this.spaceKeyPressed = true;
  this.choices.toggle(this.position);
  this.render();
};

/**
 * When user presses a number key
 */

Checkbox.prototype.onNumberKey = function(event) {
  var num = Number(event.value);
  if (num <= this.choices.length) {
    this.position = num - 1;
  }
  this.render();
};

/**
 * When user press `enter` key
 */

Checkbox.prototype.onSubmit = function() {
  this.answer = this.getChecked();
  this.status = 'answered';
  this.on('answer', function() {
    cursor.show();
  });
  // removes listeners
  this.only();
  this.submitAnswer();
};

/**
 * Set the default value to use
 */

Checkbox.prototype.setDefault = function() {
  if (this.question.hasDefault) {
    this.choices.enable(this.question.default);
  }
};

/**
 * Get the currently selected value
 */

Checkbox.prototype.getChecked = function() {
  var choices = this.choices.items;
  var len = choices.length;
  var idx = -1;
  var res = [];
  while (++idx < len) {
    var choice = choices[idx];
    if (choice.checked && !choice.disabled) {
      this.checked.push(choice.short);
      res.push(choice.value);
    }
  }
  return res;
};

/**
 * Module exports
 */

module.exports = Checkbox;
