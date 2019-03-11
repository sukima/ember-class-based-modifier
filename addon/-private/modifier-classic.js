import Ember from 'ember';
import EmberObject from '@ember/object';
import createManager from './create-manager';

const Modifier = EmberObject.extend({
  element: null,
  didInsertElement() {},
  didRecieveArguments() {},
  didUpdateArguments() {},
  willDestroyElement() {}
});

Modifier.reopenClass({
  modifier(Klass) {
    return Ember._setModifierManager(createManager, Klass);
  }
});

export default Modifier;
