import Modifier from 'ember-class-based-modifier';

export default class ClickModifier extends Modifier {
  callback() {
    alert('You clicked me!');
  }

  didInstall() {
    this.element.addEventListener('click', this.callback);
  }

  willRemove() {
    this.element.removeEventListener('click', this.callback);
  }
}
