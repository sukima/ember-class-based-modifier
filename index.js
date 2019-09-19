'use strict';
const chalk = require('chalk');

module.exports = {
  name: require('./package').name,

  included: function() {
    this.ui.writeLine(chalk.yellow('DEPRECATION: ember-oo-modifiers has been renamed to ember-class-based-modifier. Updates will continue there.'));
    return this._super.included.call(this, ...arguments);
  }
};
