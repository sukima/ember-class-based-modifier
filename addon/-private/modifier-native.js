import Ember from 'ember';
import { getOwner, setOwner } from '@ember/application';
import { setModifierManager } from '@ember/modifier';
import { schedule } from '@ember/runloop';
import Manager from './modifier-manager';

const IS_NATIVE = Symbol('native');
const DESTROYING = Symbol('destroying');
const DESTROYED = Symbol('destroyed');

export default class ClassBasedModifier {
  static create(options) {
    let owner = getOwner(options);
    let { args } = options;
    return new this(owner, args);
  }

  [IS_NATIVE] = true;
  [DESTROYING] = false;
  [DESTROYED] = false;

  constructor(owner, args) {
    setOwner(this, owner);
    this.element = null;
    this.args = args;
  }

  didReceiveArguments() {}
  didUpdateArguments() {}
  didInsertElement() {}
  willDestroyElement() {}
  willDestroy() {}

  get isDestroying() {
    return this[DESTROYING];
  }

  get isDestroyed() {
    return this[DESTROYED];
  }
}

setModifierManager(() => Manager, ClassBasedModifier);

export function isNative(modifier) {
  return modifier[IS_NATIVE] === true;
}

export function destroy(modifier) {
  if (modifier[DESTROYING]) {
    return;
  }

  let meta = Ember.meta(modifier);

  meta.setSourceDestroying();
  modifier[DESTROYING] = true;

  schedule('actions', modifier, modifier.willDestroy);
  schedule('destroy', undefined, scheduleDestroy, modifier, meta);
}

function scheduleDestroy(modifier, meta) {
  if (modifier[DESTROYED]) {
    return;
  }

  Ember.destroy(modifier);

  meta.setSourceDestroyed()
  modifier[DESTROYED] = true;
}
