import Modifier from 'ember-oo-modifiers';

const ClickModifier = Modifier.extend({
  didInsertElement() {
    this._super(...arguments);
    this.callback = () => alert('You clicked me!');
    this.element.addEventListener('click', this.callback);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.element.removeEventListener('click', this.callback);
  }
});

export default Modifier.modifier(ClickModifier);
