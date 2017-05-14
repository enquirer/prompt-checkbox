var Separator = require('choices-separator');

module.exports = {
  input: {
    message: 'message',
    name: 'name'
  },

  confirm: {
    message: 'message',
    name: 'name'
  },

  password: {
    message: 'message',
    name: 'name'
  },

  list: {
    message: 'message',
    name: 'name',
    choices: ['foo', new Separator(), 'bar', 'bum']
  },

  rawlist: {
    message: 'message',
    name: 'name',
    choices: ['foo', 'bar', new Separator(), 'bum']
  },

  expand: {
    message: 'message',
    name: 'name',
    choices: [
      {key: 'a', name: 'acab'},
      new Separator(),
      {key: 'b', name: 'bar'},
      {key: 'c', name: 'chile'},
      {key: 'd', name: 'd', value: false}
    ]
  },

  checkbox: {
    message: 'message',
    name: 'name',
    choices: [
      'choice 1',
      new Separator(),
      'choice 2',
      'choice 3'
    ]
  },

  editor: {
    message: 'message',
    name: 'name',
    default: 'foo'
  }
};
