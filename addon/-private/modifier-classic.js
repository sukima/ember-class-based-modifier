import EmberObject from '@ember/object';
import { setModifierManager } from '@ember/modifier';
import Manager from './modifier-manager';

const ClassBasedModifier = EmberObject.extend({
  args: null,

  init() {
    this._super(...arguments);
    this.element = null;
  },

  didReceiveArguments() {},
  didUpdateArguments() {},
  didInsertElement() {},
  willDestroyElement() {}
});

setModifierManager(() => Manager, ClassBasedModifier);

export default ClassBasedModifier;
