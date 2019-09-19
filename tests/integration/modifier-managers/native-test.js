import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service, { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import Modifier from 'ember-class-based-modifier';
import { testHooks } from './shared';

module('Integration | Modifier Manager | class-based modifier (native class)', function(hooks) {
  setupRenderingTest(hooks);

  testHooks(callback => class NativeModifier extends Modifier {
    constructor() {
      super(...arguments);
      callback('constructor', this);
    }

    didReceiveArguments() {
      callback('didReceiveArguments', this);
    }

    didUpdateArguments() {
      callback('didUpdateArguments', this);
    }

    didInsertElement() {
      callback('didInsertElement', this);
    }

    willDestroyElement() {
      callback('willDestroyElement', this);
    }

    willDestroy() {
      callback('willDestroy', this);
    }
  });

  module('service injection', function() {
    test('can participate in ember dependency injection', async function(assert) {
      let called = false;

      this.owner.register(
        'service:foo',
        Service.extend({ isFooService: true })
      );

      this.owner.register(
        'service:bar',
        Service.extend({ isBarService: true })
      );

      this.owner.register(
        'modifier:songbird',
        class NativeModifier extends Modifier {
          @service foo;
          @service('bar') baz;

          constructor() {
            super(...arguments);

            called = true;

            assert.strictEqual(this.foo.isFooService, true, 'this.foo.isFooService');
            assert.strictEqual(this.baz.isBarService, true, 'this.baz.isBarService');
          }
        }
      );

      await render(hbs`<h1 {{songbird}}>Hello</h1>`);

      assert.strictEqual(called, true, 'constructor called');
    });
  });
});
