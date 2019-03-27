ember-oo-modifiers
==============================================================================

This addon provides a [`useLayoutEffect`-like](https://reactjs.org/docs/hooks-reference.html#useeffect) API for adding modifiers to elements in Ember.

For more information on modifiers, please check out @pzuraq's wonderful [blog post](https://www.pzuraq.com/coming-soon-in-ember-octane-part-4-modifiers/).

Compatibility
------------------------------------------------------------------------------

This is currently compatible with:

* Ember.js v3.8 or above
* Ember CLI v2.13 or above

In the future, it will be supported with:

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

(Support for v2.18 is blocked by: https://github.com/rwjblue/ember-modifier-manager-polyfill/issues/6)


Installation
------------------------------------------------------------------------------

```
ember install ember-oo-modifiers
```


Usage
------------------------------------------------------------------------------

This addon does not provide any modifiers out of the box; instead (like Helpers), this library allows you to write your own.

Much of this addon was inspired (and some copied) from [ember-functional-modifiers](https://github.com/spencer516/ember-functional-modifiers) by @spencer516

The difference between the two is that ember-functional-modifiers exposes a **functional** style API while this addon exposes an **Object Oriented** API.

## Example without Cleanup

For example, if you wanted to implement your own `scrollTop` modifier (similar to [this](https://github.com/emberjs/ember-render-modifiers#example-scrolling-an-element-to-a-position)), you may do something like this:

### Ember Object

```js
// app/modifiers/scroll-top.js
import { Modifier } from 'ember-oo-modifiers';

const ScrollTopModifier = Modifier.extend({
  didReceiveArguments([scrollPosition]) {
    this.element.scrollTop = scrollPosition;
  }
});

export default Modifier.modifier(ScrollTopModifier);
```

Then, use it in your template:

```hbs
<div class="scroll-container" {{scroll-top @scrollPosition}}>
  {{yield}}
</div>
```

## Native Class

```js
// app/modifiers/scroll-top.js
import Modifier from 'ember-oo-modifiers';

class ScrollTopModifier extends Modifier {
  didReceiveArguments([scrollPosition]) {
    this.element.scrollTop = scrollPosition;
  }
}

export default Modifier.modifier(ScrollTopModifier);
```

Then, use it in your template:

```hbs
<div class="scroll-container" {{scroll-top @scrollPosition}}>
  {{yield}}
</div>
```

## Example with Cleanup

If the functionality you add in the modifier needs to be torn down when the element is removed, you can return a function for the teardown method.

For example, if you wanted to have your elements dance randomly on the page using `setInterval`, but you wanted to make sure that was canceled when the element was removed, you could do:

### Ember Object

```js
// app/modifiers/move-randomly.js
import { Modifier } from 'ember-oo-modifiers';

const { random, round } = Math;
const INTERVAL_DELAY = 1000;

const MoveRandomlyModifier = Modifier.extend({
  updateTransform() {
    let top = round(random() * 500);
    let left = round(random() * 500);
    this.element.style.transform = `translate(${left}px, ${top}px)`;
  },

  didInsertElement() {
    this.timer = setInterval(() => this.updateTransform(), INTERVAL_DELAY);
  },

  willDestroyElement() {
    clearInterval(this.timer);
    this.timer = null;
  }
});

export default Modifier.modifier(MoveRandomlyModifier);
```

```hbs
<div style="position: fixed;" {{move-randomly}}>
  Try to catch me!
</div>
```

### Native Class

```js
// app/modifiers/move-randomly.js
import Modifier from 'ember-oo-modifiers';

const { random, round } = Math;
const INTERVAL_DELAY = 1000;

class MoveRandomlyModifier extends Modifier {
  updateTransform() {
    let top = round(random() * 500);
    let left = round(random() * 500);
    this.element.style.transform = `translate(${left}px, ${top}px)`;
  }

  didInsertElement() {
    this.timer = setInterval(() => this.updateTransform(), INTERVAL_DELAY);
  }

  willDestroyElement() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

export default Modifier.modifier(MoveRandomlyModifier);
```

```hbs
<div style="position: fixed;" {{move-randomly}}>
  Try to catch me!
</div>
```

## Example with Service Injection

You may also want to inject a service into your modifier.

You can do that by supplying an injection object before the the modifier function. For example, suppose you wanted to track click events with `ember-metrics`:

### Ember Object

```js
// app/modifiers/track-click.js
import { inject as service } from '@ember/service';
import { Modifier } from 'ember-oo-modifiers';

const TrackClickModifier = Modifier.extend({
  metrics: service(),

  didInsertElement([eventName], options) {
    this.trackingCallback = () => this.metrics.trackEvent(eventName, options);
    this.element.addEventListener('click', this.trackingCallback, true);
  },

  willDestroyElement() {
    this.element.removeEventListener('click', this.trackingCallback, true);
    this.trackingCallback = null;
  }
});

export default Modifier.modifier(TrackClickModifier);
```

Then, you could use this in your template:

```hbs
<button {{track "Clicked the THING!"}}>
  Click Me!
</button>
```

### Native Class

```js
// app/modifiers/track-click.js
import { inject as service } from '@ember-decorators/service';
import Modifier from 'ember-oo-modifiers';

class TrackClickModifier extends Modifier {
  @service metrics

  didInsertElement([eventName], options) {
    this.trackingCallback = () => this.metrics.trackEvent(eventName, options);
    this.element.addEventListener('click', this.trackingCallback, true);
  }

  willDestroyElement() {
    this.element.removeEventListener('click', this.trackingCallback, true);
    this.trackingCallback = null;
  }
}

export default Modifier.modifier(TrackClickModifier);
```

Then, you could use this in your template:

```hbs
<button {{track "Clicked the THING!"}}>
  Click Me!
</button>
```

*NOTE*: Because we are not observing the properties in the service in any way, if we are _reading_ a property on a service, the modifier will not recompute if that value changes. If that's the behavior you need, you probably want to pass that value into the modifier as an argument, rather than injecting it.

## API

<dl>
<dt><code>element</code></dt>
<dd>the DOM element the modifier is attached to.</dd>
<dt><code>didInsertElement(positional: Array<Any>, named: Object<Any>)</code></dt>
<dd>Called when the modifier is installed on the DOM element.</dd>
<dt><code>didReceiveArguments(positional: Array<Any>, named: Object<Any>)</code></dt>
<dd>Called when the modifier is installed <strong>and</strong> anytime the arguments are updated.</dd>
<dt><code>didUpdateArguments(positional: Array<Any>, named: Object<Any>)</code></dt>
<dd>Called anytime the arguments are updated but <strong>not</strong> on the initial install.</dd>
<dt><code>willDestroyElement(positional: Array<Any>, named: Object<Any>)</code></dt>
<dd>Called when the modifier is about to be destroyed; use for teardown code.</dd>
</dl>

#### Ember Object Import

```js
import { Modifier } from 'ember-oo-modifiers';

const MyModifier = Modifier.extend({
});

export default Modifier.modifier(MyModifier);
```

#### Native Class Import

```js
import Modifier from 'ember-oo-modifiers';

class MyModifier extends Modifier {
}

export default Modifier.modifier(MyModifier);
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
