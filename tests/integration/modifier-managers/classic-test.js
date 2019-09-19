import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service, { inject as service } from '@ember/service';
import hbs from 'htmlbars-inline-precompile';
import Modifier from 'ember-class-based-modifier/classic';
import { testHooks } from './shared';

module('Integration | Modifier Manager | class-based modifier (classic class)', function(hooks) {
  setupRenderingTest(hooks);

  testHooks(callback => Modifier.extend({
    init() {
      this._super(...arguments);
      callback('constructor', this);
    },

    didReceiveArguments() {
      callback('didReceiveArguments', this);
    },

    didUpdateArguments() {
      callback('didUpdateArguments', this);
    },

    didInstall() {
      callback('didInstall', this);
    },

    willRemove() {
      callback('willRemove', this);
    },

    willDestroy() {
      callback('willDestroy', this);
    }
  }));

  module('service injection', function() {
    test('can participate in ember dependency injection', async function(assert) {
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
        Modifier.extend({
          foo: service(),
          baz: service('bar'),

          init() {
            this._super(...arguments);

            assert.step('constructor called');
            assert.strictEqual(this.foo.isFooService, true, 'this.foo.isFooService');
            assert.strictEqual(this.baz.isBarService, true, 'this.baz.isBarService');
          }
        })
      );

      await render(hbs`<h1 {{songbird}}>Hello</h1>`);

      assert.verifySteps(['constructor called']);
    });
  });
});
