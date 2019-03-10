import ModifierManager from './modifier-manager';

const MANAGERS = new WeakMap();

export default function createManager(owner) {
  let manager = MANAGERS.get(owner);
  if (manager === undefined) {
    manager = new ModifierManager(owner);
  }
  return manager;
}
