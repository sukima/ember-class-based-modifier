import Ember from 'ember';
import { setOwner } from '@ember/application';
import { setProperties } from '@ember/object';
import createManager from './create-manager';

export default class Modifier {
  constructor(attrs = {}, _owner) {
    setOwner(this, _owner);
    setProperties(this, attrs);
  }

  didInsertElement() {}
  didRecieveArguments() {}
  didUpdateArguments() {}
  willDestroyElement() {}

  static modifier(Klass) {
    return Ember._setModifierManager(createManager, Klass);
  }
}
