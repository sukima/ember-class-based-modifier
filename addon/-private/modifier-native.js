import Ember from 'ember';
import { setOwner } from '@ember/application';
import { setProperties } from '@ember/object';
import createManager from './create-manager';
import { deprecate } from '@ember/application/deprecations';
import { assert } from '@ember/debug';

class Modifier {
  constructor(attrs = {}, _owner) {
    setOwner(this, _owner);
    setProperties(this, attrs);
  }

  didInsertElement() {}
  didRecieveArguments() {}
  didUpdateArguments() {}
  willDestroyElement() {}

  static modifier(Klass) {
    deprecate("Modifier.modifier is deprecated.  Export the class directly.  See https://github.com/sukima/ember-oo-modifiers/pull/8", false, { id: 'modifier-call', until: "1.0.0" });
    return Klass;
  }
}

Ember._setModifierManager(createManager, Modifier);

export function modifier(modifierFn) {
  assert(
    'You must pass a function as the first argument to the `modifier` function',
    modifierFn !== undefined && typeof modifierFn === 'function'
  );

  return class extends Modifier {
    didReceiveArguments(positional, named) {
      modifierFn(this.element, positional, named);
    }
  }
}

export default Modifier;
