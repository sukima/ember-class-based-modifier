ember-class-based-modifier
==============================================================================

This is a fork of [ember-oo-modifiers](https://github.com/sukima/ember-oo-modifiers) with some modifications to the API.

This addon provides a class-based API for authoring [element modifiers](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html) in Ember, similar to the [class-based helper](https://octane-guides-preview.emberjs.com/release/templates/writing-helpers/#toc_class-based-helpers) API.

Compatibility
------------------------------------------------------------------------------

This is currently compatible with:

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

Installation
------------------------------------------------------------------------------

```
ember install ember-class-based-modifier
```

Usage
------------------------------------------------------------------------------

This addon does not provide any modifiers out of the box; instead, this library allows you to write your own.

Much of this addon was based on [ember-oo-modifiers](https://github.com/sukima/ember-oo-modifiers), and, in turn, [ember-functional-modifiers](https://github.com/spencer516/ember-functional-modifiers).

## Example without Cleanup

For example, let's say you want to implement your own `{{scroll-position}}` modifier (similar to [this](https://github.com/emberjs/ember-render-modifiers#example-scrolling-an-element-to-a-position)).

This modifier can be attached to any element and accepts a single positional argument. When the element is inserted, and whenever the argument is updated, it will set the element's `scrollTop` property to the value of its argument.

```js
// app/modifiers/scroll-position.js

import Modifier from 'ember-class-based-modifier';

export default class ScrollPositionModifier extends Modifier {
  get scrollPosition() {
    // get the first positional argument passed to the modifier
    //
    // {{scoll-position @someNumber}}
    //                  ~~~~~~~~~~~
    //
    return this.args.positional[0];
  }

  didReceiveArguments() {
    this.element.scrollTop = this.scrollPosition;
  }
}
```

Usage:

```handlebars
{{!-- app/components/scroll-container.hbs --}}

<div
  class="scroll-container"
  style="width: 300px; heigh: 300px; overflow-y: scroll"
  {{scroll-position this.scrollPosition}}
>
  {{yield this.scrollToTop}}
</div>
```

```js
// app/components/scroll-container.js

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScrollContainerComponent extends Component {
  @tracked scrollPosition = 0;

  @action scrollToTop() {
    this.scrollPosition = 0;
  }
}
```

```handlebars
{{!-- app/templates/application.hbs --}}

<ScrollContainer as |scroll|>
  A lot of content...

  <button {{on "click" scroll}}>Back To Top</button>
</ScrollContainer>
```

## Example with Cleanup

If the functionality you add in the modifier needs to be torn down when the modifier is removed, you can use the `willRemove` hook.

For example, if you want to have your elements dance randomly on the page using `setInterval`, but you wanted to make sure that was canceled when the modifier was removed, you could do this:

```js
// app/modifiers/move-randomly.js

import { action } from '@ember/object';
import Modifier from 'ember-class-based-modifier';

const { random, round } = Math;
const DEFAULT_DELAY = 1000;

export default class MoveRandomlyModifier extends Modifier {
  setIntervalId = null;

  get delay() {
    // get the named argument "delay" passed to the modifier
    //
    // {{move-randomly delay=@someNumber}}
    //                       ~~~~~~~~~~~
    //
    return this.args.named.delay || DEFAULT_DELAY;
  }

  @action moveElement() {
    let top = round(random() * 500);
    let left = round(random() * 500);
    this.element.style.transform = `translate(${left}px, ${top}px)`;
  }

  didReceiveArguments() {
    if (this.setIntervalId !== null) {
      clearInterval(this.setIntervalId);
    }

    this.setIntervalId = setInterval(this.moveElement, this.delay);
  }

  willRemove() {
    clearInterval(this.setIntervalId);
    this.setIntervalId = null;
  }
}
```

Usage:

```hbs
<div {{move-randomly}}>
  Catch me if you can!
</div>
```

## Example with Service Injection

You can also use services into your modifier, just like any other class in Ember.

For example, suppose you wanted to track click events with `ember-metrics`:

```js
// app/modifiers/track-click.js

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Modifier from 'ember-class-based-modifier';

export default class TrackClickModifier extends Modifier {
  @service metrics;

  get eventName() {
    // get the first positional argument passed to the modifier
    //
    // {{track-click "like-button-click" page="some page" title="some title"}}
    //               ~~~~~~~~~~~~~~~~~~~
    //
    return this.args.positional[0];
  }

  get options() {
    // get the named arguments passed to the modifier
    //
    // {{track-click "like-button-click" page="some page" title="some title"}}
    //                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    return this.args.named;
  }

  @action onClick() {
    this.metrics.trackEvent(this.eventName, this.options);
  }

  didInstall() {
    this.element.addEventListener('click', this.onClick, true);
  }

  willRemove() {
    this.element.removeEventListener('click', this.onClick, true);
  }
}
```

Usage:

```hbs
<button {{track-click "like-button-click" page="some page" title="some title"}}>
  Click Me!
</button>
```

## Classic API

If you would like to use `Ember.Object` based APIs, such as `this.get`, `this.set`, `this.setProperties`, etc, you can import the "classic" base class instead, located at the import path `ember-class-based-modifier/classic`.

The examples above can be rewritten using the classic API:

```js
// app/modifiers/scroll-position.js

import { computed } from '@ember/object';
import Modifier from 'ember-class-based-modifier/classic';

export default Modifier.extend({
  scrollPosition: computed('args.positional.[]', function() {
    // get the first positional argument passed to the modifier
    //
    // {{scoll-position @someNumber}}
    //                  ~~~~~~~~~~~
    //
    return this.args.positional[0];
  }),

  didReceiveArguments() {
    this.element.scrollTop = this.get('scrollPosition');
  }
});
```

```js
// app/modifiers/move-randomly.js

import { action, computed } from '@ember/object';
import Modifier from 'ember-class-based-modifier/classic';

const { random, round } = Math;
const DEFAULT_DELAY = 1000;

export default Modifier.extend({
  init() {
    this._super(...arguments);
    this.set('setIntervalId', null);
  },

  delay: computed('args.named.delay', function() {
    // get the named argument "delay" passed to the modifier
    //
    // {{move-randomly delay=@someNumber}}
    //                       ~~~~~~~~~~~
    //
    return this.args.named.delay || DEFAULT_DELAY;
  }),

  moveElement: action(function() {
    let top = round(random() * 500);
    let left = round(random() * 500);
    this.element.style.transform = `translate(${left}px, ${top}px)`;
  }),

  didReceiveArguments() {
    let setIntervalId = this.get('setIntervalId');

    if (setIntervalId !== null) {
      clearInterval(setIntervalId);
    }

    setIntervalId = setInterval(this.moveElement, this.get('delay'));

    this.set('setIntervalId', setIntervalId);
  },

  willRemove() {
    clearInterval(this.setIntervalId);
    this.setIntervalId = null;
  }
});
```

```js
// app/modifiers/track-click.js

import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Modifier from 'ember-class-based-modifier/classic';

export default Modifier.extend({
  metrics: service(),

  eventName: computed('args.positional.[]', function() {
    // get the first positional argument passed to the modifier
    //
    // {{track-click "like-button-click" page="some page" title="some title"}}
    //               ~~~~~~~~~~~~~~~~~~~
    //
    return this.args.positional[0];
  }),

  options: computed('args.named', function() {
    // get the named arguments passed to the modifier
    //
    // {{track-click "like-button-click" page="some page" title="some title"}}
    //                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    return this.args.named;
  }),

  onClick: action(function() {
    this.metrics.trackEvent(this.get('eventName'), this.get('options'));
  }),

  didInstall() {
    this.element.addEventListener('click', this.onClick, true);
  }

  willRemove() {
    this.element.removeEventListener('click', this.onClick, true);
  }
});
```

Whenever possible, it is recommended that you use the default "modern" API instead of the classic API.

## API

<dl>
<dt><code>element</code></dt>
<dd>The DOM element the modifier is attached to.</dd>
<dt><code>args</code>: <code>{ positional: Array, named: Object }</code></dt>
<dd>The arguments passed to the modifier. <code>args.positional</code> is an array of positional arguments, and <code>args.named</code> is an object containing the named arguments.</dd>
<dt><code>isDestroying</code></dt>
<dd><code>true</code> if the modifier is in the process of being destroyed, or has already been destroyed.</dd>
<dt><code>isDestroyed</code></dt>
<dd><code>true</code> if the modifier has already been destroyed.</dd>
<dt><code>constructor(owner, args)</code> (or <code>init()</code> in classic API)</dt>
<dd>Constructor for the modifier. You must call <code>super(...arguments)</code> (or <code>this._super(...arguments)</code> in classic API) before performing other initialization. The <code>element</code> is not yet available at this point (i.e. its value is <code>null</code> during construction).</dd>
<dt><code>didReceiveArguments()</code></dt>
<dd>Called when the modifier is installed <strong>and</strong> anytime the arguments are updated.</dd>
<dt><code>didUpdateArguments()</code></dt>
<dd>Called anytime the arguments are updated but <strong>not</strong> on the initial install. Called before <code>didReceiveArguments</code>.</dd>
<dt><code>didInstall()</code></dt>
<dd>Called when the modifier is installed on the DOM element. Called after <code>didReceiveArguments</code>.</dd>
<dt><code>willRemove()</code></dt>
<dd>Called when the DOM element is about to be destroyed; use for removing event listeners on the element and other similar clean-up tasks.</dd>
<dt><code>willDestroy()</code></dt>
<dd>Called when the modifier itself is about to be destroyed; use for teardown code. Called after <code>willRemove</code>. The <code>element</code> is no longer available at this point (i.e. its value is <code>null</code> during teardown).</dd>
</dl>

## Differences from [ember-oo-modifiers](https://github.com/sukima/ember-oo-modifiers)

* Renamed package to `ember-class-based-modifier`. `class-based` was chosen over `oo` for its familiarity with Ember users, as the same name is used for the "class-based helpers" API. It also avoids an unnecessary jargon. `modifiers` (plural) was renamed to `modifier` (singular) since this package provides a single base class, instead of a collection of utility modifiers. Choosing a different package name also facilitated the remaining breaking changes.
* No `Modifier.modifier()` function.
* Classic API is located at `ember-class-based-modifier/classic`. The old import path (`import Modifier from ...` vs `import { Modifier } from ...`) was too subtle and very easy to miss.
* Named arguments do not become properties on the modifier instance. This was a classic-component-ism that does not fit with modern Ember (Glimmer components) idioms. The old behavior was also buggy and unreliable, as their values do not get updated after construction.
* Arguments are not passed to life-cycle hooks. Instead, they are available at `this.args`. This mirrors the life-cycle hooks in both classic and Glimmer components.
* Renamed `didInsertElement` to `didInstall` and `willDestroyElement` to `willRemove`, as the old names were misleading. See [this tweet](https://twitter.com/chancancode/status/1109502949972074496).
* Corrected life-cycle hook order: `didReceiveArguments` before `didInstall`, and `didUpdateArguments` before `didReceiveArguments`, mirroring the classic component life-cycle hooks' ordering.
* Added `willDestroy`, `isDestroying` and `isDestroyed` with the same semantics as Ember objects and Glimmer components.
* Improved test coverage.
* Updated README.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
