import Modifier from 'ember-class-based-modifier';

export default class ClickModifier extends Modifier {
  callback() {
    alert('You clicked me!');
  }

  didInsertElement() {
    this.element.addEventListener('click', this.callback);
  }

  willDestroyElement() {
    this.element.removeEventListener('click', this.callback);
  }
}
