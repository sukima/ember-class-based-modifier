import { capabilities } from '@ember/modifier';
import { set } from '@ember/object';
import { destroy, isNative } from './modifier-native'

class ClassBasedModifierManager {
  capabilities = capabilities('3.13');

  createModifier(factory, args) {
    return factory.create({ args });
  }

  installModifier(instance, element) {
    instance.element = element;
    instance.didReceiveArguments();
    instance.didInsertElement();
  }

  updateModifier(instance, args) {
    // TODO: this should be an args proxy
    set(instance, 'args', args);
    instance.didUpdateArguments();
    instance.didReceiveArguments();
  }

  destroyModifier(instance) {
    instance.willDestroyElement();
    instance.element = null;

    if (isNative(instance)) {
      destroy(instance);
    } else {
      instance.destroy();
    }
  }
}

export default new ClassBasedModifierManager();
