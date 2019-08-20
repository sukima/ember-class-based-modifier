import EmberObject from '@ember/object';
import createManager from './create-manager';
import  { deprecate } from '@ember/application/deprecations';
import { setModifierManager } from './utils';

const Modifier = EmberObject.extend({
  element: null,
  didInsertElement() {},
  didRecieveArguments() {},
  didUpdateArguments() {},
  willDestroyElement() {}
});

Modifier.reopenClass({
  modifier(Klass) {
    deprecate("Modifier.modifier is deprecated.  Export the class directly.  See https://github.com/sukima/ember-oo-modifiers/pull/8", false, { id: 'modifier-call', until: "1.0.0" });
    return Klass;
  }
});

setModifierManager(createManager, Modifier);

export default Modifier;
