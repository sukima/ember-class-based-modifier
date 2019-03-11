import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Service, { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import { Modifier } from 'ember-oo-modifiers';

module('Integration | Modifier Manager | oo modifier (classic)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.registerModifier = (name, modifier) => {
      this.owner.register(`modifier:${name}`, modifier);
    };
    this.registerModifierClass = (name, ModifierClass) => {
      this.registerModifier(name, Modifier.modifier(ModifierClass));
    };
  });

  module('didInsertElement', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didInsertElement() { assert.equal(this.element.tagName, 'H1'); }
        })
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didInsertElement([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didInsertElement(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didRecieveArguments', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didReceiveArguments() { assert.equal(this.element.tagName, 'H1'); }
        })
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didReceiveArguments([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didReceiveArguments(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didUpdateArguments', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didUpdateArguments() { assert.equal(this.element.tagName, 'H1'); }
        })
      );
      await render(hbs`<h1 {{songbird this.value}}>Hello</h1>`);
      this.set('value', 1);
    });

    test('positional arguments are passed', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didUpdateArguments([, a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird this.value "1" "2"}}>Hey</h1>`);
      this.set('value', 1);
    });

    test('named arguments are passed', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          didUpdateArguments(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`<h1 {{songbird this.value a="1" b="2"}}>Hey</h1>`);
      this.set('value', 1);
    });
  });

  module('willDestroyElement', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.shouldRender = true;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          willDestroyElement() { assert.equal(this.element.tagName, 'H1'); }
        })
      );
      await render(hbs`
        {{#if this.shouldRender}}
          <h1 {{songbird}}>Hello</h1>
        {{/if}}
      `);
      this.set('shouldRender', false);
    });

    test('positional arguments are passed', async function(assert) {
      this.shouldRender = true;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          willDestroyElement([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`
        {{#if this.shouldRender}}
          <h1 {{songbird "1" "2"}}>Hey</h1>
        {{/if}}
      `);
      this.set('shouldRender', false);
    });

    test('named arguments are passed', async function(assert) {
      this.shouldRender = true;
      this.registerModifierClass(
        'songbird',
        Modifier.extend({
          willDestroyElement(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        })
      );
      await render(hbs`
        {{#if this.shouldRender}}
          <h1 {{songbird a="1" b="2"}}>Hey</h1>
        {{/if}}
      `);
      this.set('shouldRender', false);
    });
  });

  test('has correct lifecycle hooks ordering', async function(assert) {
    let callstack = [];
    this.value = 0;
    this.shouldRender = true;
    this.registerModifierClass(
      'songbird',
      Modifier.extend({
        didInsertElement() { callstack.push('didInsertElement'); },
        didReceiveArguments() { callstack.push('didReceiveArguments'); },
        didUpdateArguments() { callstack.push('didUpdateArguments'); },
        willDestroyElement() { callstack.push('willDestroyElement'); }
      })
    );
    await render(hbs`
      {{#if this.shouldRender}}
        <h1 {{songbird this.value}}>Hey</h1>
      {{/if}}
    `);
    this.set('value', 1);
    await settled();
    this.set('shouldRender', false);
    await settled();
    assert.deepEqual(callstack, [
      'didInsertElement',
      'didReceiveArguments',
      'didReceiveArguments',
      'didUpdateArguments',
      'willDestroyElement'
    ]);
  });

  test('can participate in ember dependency injection', async function(assert) {
    this.owner.register(
      'service:test-service',
      Service.extend({ value: 'test-service-value' })
    );
    this.registerModifierClass(
      'songbird',
      Modifier.extend({
        testService: service(),
        didInsertElement() {
          assert.equal(this.testService.value, 'test-service-value');
        }
      })
    );
    await render(hbs`<h1 {{songbird}}>Hello</h1>`);
  });
});
