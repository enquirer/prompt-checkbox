'use strict';

var debug = require('debug')('prompt-checkbox');
var Prompt = require('prompt-base');
var cyan = require('ansi-cyan');
var red = require('ansi-red');

/**
 * Checkbox prompt
 */

function Checkbox() {
  debug('initializing from <%s>', __filename);
  Prompt.apply(this, arguments);
  this.firstRender = true;
  this.helpMessage = this.options.helpMessage || '(Press '
    + cyan('<space>')
    + ' to toggle)';

  this.position = 0;
}

/**
 * Inherit prompt-base
 */

Prompt.extend(Checkbox);

/**
 * Render the prompt to the terminal
 */

Checkbox.prototype.render = function(state) {
  var append = typeof state === 'string' ? red('>> ') + state : '';

  // render question
  var message = this.message;
  if (this.firstRender) {
    this.firstRender = false;
    message += this.helpMessage;
  }

  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    var keys = this.choices.checked.map(function(choice) {
      return typeof choice === 'string' ? choice : choice.value;
    });
    message += cyan(keys.join(', '));
  } else {
    message += this.choices.render(this.position, this.options);
  }

  this.ui.render(message, append);
};

/**
 * Module exports
 */

module.exports = Checkbox;
