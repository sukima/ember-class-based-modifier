import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import Modifier, { modifier } from 'ember-oo-modifiers';
import { registerDeprecationHandler } from '@ember/debug';

let isRegistered = false;
let deprecations;

module('Integration | Modifier Manager | oo modifier (native)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    deprecations = [];
    if (!isRegistered) {
      registerDeprecationHandler((message, options, next) => {
        deprecations.push(message);
        next(message, options);
      });
      isRegistered = true;
    }

    this.registerModifier = (name, modifier) => {
      this.owner.register(`modifier:${name}`, modifier);
    };
    this.registerModifierClass = (name, ModifierClass) => {
      this.registerModifier(name, ModifierClass);
    };
  });

  module('didInsertElement with calling deprecated Modifier.modfier', function() {
    test('it has DOM element on this.element', async function(assert) {
      class SongbirdModifier extends Modifier {
        didInsertElement() { assert.equal(this.element.tagName, 'H1'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      class SongbirdModifier extends Modifier {
        didInsertElement([a, b]) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      class SongbirdModifier extends Modifier {
        didInsertElement(_, { a, b }) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didInsertElement without calling Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didInsertElement() { assert.equal(this.element.tagName, 'H1'); }
        }
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didInsertElement([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didInsertElement(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didRecieveArguments with calling deprecated Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      class SongbirdModifier extends Modifier {
        didReceiveArguments() { assert.equal(this.element.tagName, 'H1'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      class SongbirdModifier extends Modifier {
        didReceiveArguments([a, b]) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      class SongbirdModifier extends Modifier {
        didReceiveArguments(_, { a, b }) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didRecieveArguments without calling Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didReceiveArguments() { assert.equal(this.element.tagName, 'H1'); }
        }
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });

    test('positional arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didReceiveArguments([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird "1" "2"}}>Hey</h1>`);
    });

    test('named arguments are passed', async function(assert) {
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didReceiveArguments(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird a="1" b="2"}}>Hey</h1>`);
    });
  });

  module('didUpdateArguments with calling deprecated Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.value = 0;
      class SongbirdModifier extends Modifier {
        didUpdateArguments() { assert.equal(this.element.tagName, 'H1'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird this.value}}>Hello</h1>`);
      this.set('value', 1);
    });

    test('positional arguments are passed', async function(assert) {
      this.value = 0;
      class SongbirdModifier extends Modifier {
        didUpdateArguments([, a, b]) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird this.value "1" "2"}}>Hey</h1>`);
      this.set('value', 1);
    });

    test('named arguments are passed', async function(assert) {
      this.value = 0;
      class SongbirdModifier extends Modifier {
        didUpdateArguments(_, { a, b }) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird this.value a="1" b="2"}}>Hey</h1>`);
      this.set('value', 1);
    });
  });

  module('didUpdateArguments without calling Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didUpdateArguments() { assert.equal(this.element.tagName, 'H1'); }
        }
      );
      await render(hbs`<h1 {{songbird this.value}}>Hello</h1>`);
      this.set('value', 1);
    });

    test('positional arguments are passed', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didUpdateArguments([, a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird this.value "1" "2"}}>Hey</h1>`);
      this.set('value', 1);
    });

    test('named arguments are passed', async function(assert) {
      this.value = 0;
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didUpdateArguments(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`<h1 {{songbird this.value a="1" b="2"}}>Hey</h1>`);
      this.set('value', 1);
    });
  });

  module('willDestroyElement with calling deprecated Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.shouldRender = true;
      class SongbirdModifier extends Modifier {
        willDestroyElement() { assert.equal(this.element.tagName, 'H1'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
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
      class SongbirdModifier extends Modifier {
        willDestroyElement([a, b]) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
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
      class SongbirdModifier extends Modifier {
        willDestroyElement(_, { a, b }) {
          assert.equal(a, '1');
          assert.equal(b, '2');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`
        {{#if this.shouldRender}}
          <h1 {{songbird a="1" b="2"}}>Hey</h1>
        {{/if}}
      `);
      this.set('shouldRender', false);
    });
  });

  module('willDestroyElement without calling Modifier.modifier', function() {
    test('it has DOM element on this.element', async function(assert) {
      this.shouldRender = true;
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          willDestroyElement() { assert.equal(this.element.tagName, 'H1'); }
        }
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
        class SongbirdModifier extends Modifier {
          willDestroyElement([a, b]) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
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
        class SongbirdModifier extends Modifier {
          willDestroyElement(_, { a, b }) {
            assert.equal(a, '1');
            assert.equal(b, '2');
          }
        }
      );
      await render(hbs`
        {{#if this.shouldRender}}
          <h1 {{songbird a="1" b="2"}}>Hey</h1>
        {{/if}}
      `);
      this.set('shouldRender', false);
    });
  });

  module('Lifecycle and dependency with calling deprecated Modifier.modifier', function() {
    test('has correct lifecycle hooks ordering', async function(assert) {
      let callstack = [];
      this.value = 0;
      this.shouldRender = true;
      class SongbirdModifier extends Modifier {
        didInsertElement() { callstack.push('didInsertElement'); }
        didReceiveArguments() { callstack.push('didReceiveArguments'); }
        didUpdateArguments() { callstack.push('didUpdateArguments'); }
        willDestroyElement() { callstack.push('willDestroyElement'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
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
        class TestService extends Service {
          value = 'test-service-value'
        }
      );
      class SongbirdModifier extends Modifier {
        @service testService
        didInsertElement() {
          assert.equal(this.testService.value, 'test-service-value');
        }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });
  });

  module('Lifecycle and dependency without calling Modifier.modifier', function() {
    test('has correct lifecycle hooks ordering', async function(assert) {
      let callstack = [];
      this.value = 0;
      this.shouldRender = true;
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          didInsertElement() { callstack.push('didInsertElement'); }
          didReceiveArguments() { callstack.push('didReceiveArguments'); }
          didUpdateArguments() { callstack.push('didUpdateArguments'); }
          willDestroyElement() { callstack.push('willDestroyElement'); }
        }
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
        class TestService extends Service {
          value = 'test-service-value'
        }
      );
      this.registerModifierClass(
        'songbird',
        class SongbirdModifier extends Modifier {
          @service testService
          didInsertElement() {
            assert.equal(this.testService.value, 'test-service-value');
          }
        }
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
    });
  });

  module('Modifier.modifier deprecations', function() {
    test('rendering with Modifier.modifier causes deprecation warning', async function(assert) {
      class SongbirdModifier extends Modifier {
        didInsertElement() { assert.equal(this.element.tagName, 'H1'); }
      }
      this.registerModifierClass(
        'songbird',
        Modifier.modifier(SongbirdModifier)
      );
      await render(hbs`<h1 {{songbird}}>Hello</h1>`);
      assert.ok( deprecations.includes("Modifier.modifier is deprecated.  Export the class directly.  See https://github.com/sukima/ember-oo-modifiers/pull/8") );
    });
  });

  module('modifier function', function() {
    test('it calls passed function on `didReceiveArguments`', async function(assert) {
      this.positional = '1';
      this.named = 'a';

      this.registerModifierClass(
        'songbird',
        modifier(function songbird(element, [positional], { named }) {
          assert.step(element.tagName);
          assert.step(positional);
          assert.step(named);
        })
      );

      await render(hbs`<h1 {{songbird this.positional named=this.named}}>Hello</h1>`);

      this.set('positional', '2');
      this.set('named', 'b');
      await settled();

      assert.verifySteps([
        'H1', '1', 'a',
        'H1', '2', 'a',
        'H1', '2', 'b'
      ]);
    });

    test('it asserts when argument is not a function', function(assert) {
      assert.throws(() => {
        this.registerModifierClass(
          'songbird',
          modifier(true)
        );
      }, /You must pass a function as the first argument to the `modifier` function/);
    });
  })
});
