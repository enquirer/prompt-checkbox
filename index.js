'use strict';

var util = require('util');
var Paginator = require('terminal-paginator');
var Prompt = require('enquirer-prompt');
var radio = require('radio-symbol');
var cursor = require('cli-cursor');
var log = require('log-utils');

/**
 * Checkbox prompt
 */

function Checkbox(/*question, answers, rl*/) {
  Prompt.apply(this, arguments);
  if (!this.question.choices) {
    throw new Error('expected "options.choices" to be an array');
  }
  this.setDefault();
  this.pointer = 0;
  this.question.default = null;
  this.paginator = new Paginator();
}

/**
 * Inherit Prompt
 */

util.inherits(Checkbox, Prompt);

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the `Checkbox` instance
 */

Checkbox.prototype.ask = function(cb) {
  this.callback = cb;

  this.ui.on('up', this.onUpKey.bind(this));
  this.ui.on('down', this.onDownKey.bind(this));
  this.ui.on('space', this.onSpaceKey.bind(this));
  this.ui.on('number', this.onNumberKey.bind(this));

  this.ui.once('line', this.onSubmit.bind(this));
  this.ui.once('error', this.onError.bind(this));

  // Init the prompt
  cursor.hide();
  this.render();
  return this;
};

/**
 * Render the prompt to the terminal
 */

Checkbox.prototype.render = function(error) {
  // Render question
  var message = this.message;
  var append = '';

  if (!this.spaceKeyPressed) {
    message += '(Press <space> to select) ';
  }

  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    message += log.cyan(this.selection.join(', '));
  } else {
    var choicesStr = renderChoices(this.question.choices, this.pointer);
    var idx = this.question.choices.indexOf(this.question.choices.getChoice(this.pointer));
    message += '\n' + this.paginator.paginate(choicesStr, idx, this.question.pageSize);
  }

  if (error) {
    append = log.red('>> ') + error;
  }
  this.ui.render(message, append);
};

/**
 * When an error event is emitted
 */

Checkbox.prototype.onError = function(answer) {
  this.render(answer.isValid);
};

/**
 * When user press `enter` key
 */

Checkbox.prototype.onSubmit = function(line) {
  this.answer = this.getCurrentValue(line);
  this.status = 'answered';
  this.render();
  this.ui.write();
  cursor.show();
  this.callback(this.answer);
};

Checkbox.prototype.onUpKey = function() {
  var len = this.question.choices.realLength;
  this.pointer = (this.pointer > 0) ? this.pointer - 1 : len - 1;
  this.render();
};

Checkbox.prototype.onDownKey = function() {
  var len = this.question.choices.realLength;
  this.pointer = (this.pointer < len - 1) ? this.pointer + 1 : 0;
  this.render();
};

Checkbox.prototype.onNumberKey = function(event) {
  var num = Number(event.value);
  if (num <= this.question.choices.realLength) {
    this.pointer = num - 1;
    this.toggleChoice(this.pointer);
  }
  this.render();
};

Checkbox.prototype.onSpaceKey = function() {
  this.spaceKeyPressed = true;
  this.toggleChoice(this.pointer);
  this.render();
};

/**
 * Set the default value to use
 */

Checkbox.prototype.setDefault = function() {
  if (Array.isArray(this.question.default)) {
    var len = this.question.choices.length;
    var idx = -1;
    while (++idx < len) {
      var choice = this.question.choices[idx];
      if (contains(this.question.default, choice.value)) {
        choice.checked = true;
      }
    }
  }
};

/**
 * Get the currently selected value
 */

Checkbox.prototype.getCurrentValue = function() {
  var choices = this.question.choices.filter(function(choice) {
    return Boolean(choice.checked) && !choice.disabled;
  });
  this.selection = choices.map(function(choice) {
    return choice.short;
  });
  return choices.map(function(choice) {
    return choice.value;
  });
};

/**
 * Toggle the choice at the given `index`
 */

Checkbox.prototype.toggleChoice = function(idx) {
  var checked = this.question.choices.getChoice(idx).checked;
  this.question.choices.getChoice(idx).checked = !checked;
};

/**
 * Function for rendering checkbox choices
 * @param  {Number} pointer Position of the pointer
 * @return {String} Rendered choices string
 */

function renderChoices(choices, pointer) {
  var output = '';
  var separatorOffset = 0;

  choices.forEach(function(choice, i) {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += ' ' + choice;

    } else if (choice.disabled) {
      separatorOffset++;
      output += disabled(choice);

    } else {
      var isSelected = (i - separatorOffset === pointer);
      output += isSelected ? log.cyan('❯') : ' ';
      output += getCheckbox(choice) + ' ' + choice.name;
    }

    output += '\n';
  });

  return output.replace(/\n$/, '');
}

/**
 * Utils
 */

function disabled(choice) {
  var symbol = process.platform === 'win32' ? ' (×) ' : ' ⓧ ';
  return log.dim(symbol + choice.name + ' (' + (choice.disabled || 'Disabled') + ')');
}

function inactive(choice) {
  return '  ' + choice.name;
}

function active(choice, options) {
  return log.cyan(pointer(options) + choice.name);
}

function pointer(options) {
  if (typeof options.pointer === 'string') {
    return options.pointer.trim() + ' ';
  }
  switch(process.platform) {
    case 'win32':
      return '> ';
    case 'linux':
      return '‣ ';
    default: {
      return '❯ ';
    }
  }
}

/**
 * Get the checkbox based on state.
 * @param  {Boolean} `checked` If active/checked, adds an X to the checkbox
 * @return {String} Checkbox string
 */

function getCheckbox(choice) {
  return choice.checked ? log.green(radio.on) : radio.off;
}

/**
 * Cast `val` to an array.
 */

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

/**
 * Return true if `arr` contains the given `element`
 */

function contains(val, ele) {
  return arrayify(val).indexOf(ele) !== -1;
}

/**
 * Module exports
 */

module.exports = Checkbox;
