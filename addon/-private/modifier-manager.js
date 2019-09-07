import { capabilities } from './utils';

function triggerLifecycleHook(instance, hookName, args) {
  // Checking for undefined as a style choice came from
  // https://emberjs.github.io/rfcs/0373-Element-Modifier-Managers.html
  if (instance[hookName] !== undefined) {
    return instance[hookName](args.positional, args.named);
  }
}

export default class ModifierManager {
  capabilities = capabilities('3.13');

  constructor(owner) {
    this.owner = owner;
  }

  createModifier(Klass, args) {
    let isEmberObject = Klass.class.create !== undefined;

    if (isEmberObject) {
      return Klass.create(args.named);
    } else {
      let Constructor = Klass.class;
      return new Constructor(args.named, this.owner);
    }
  }

  installModifier(instance, element, args) {
    instance.element = element;
    triggerLifecycleHook(instance, 'didInsertElement', args);
    triggerLifecycleHook(instance, 'didReceiveArguments', args);
  }

  updateModifier(instance, args) {
    triggerLifecycleHook(instance, 'didReceiveArguments', args);
    triggerLifecycleHook(instance, 'didUpdateArguments', args);
  }

  destroyModifier(instance, args) {
    triggerLifecycleHook(instance, 'willDestroyElement', args);
    instance.element = null;
  }
}
