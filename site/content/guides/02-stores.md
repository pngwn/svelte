---
title: Stores
description: Getting the most out of Svelte stores.
---

> _This guide assumes you understand the basics of Svelte Stores. If you aren't familiar with them then working through the [relevant tutorial](tutorial/writable-stores) and reading the [store documentation](docs#svelte_store) are highly recommended._

Svelte stores offer a simple mechanism to handle shared state in your Svelte application but looking beyond the built-in store implementations will unlock a whole world of power that you could never have dreamed of. In this episode of _The Tinest Kitchen_ we'll take a close look at [The Store Contract](#The_Store_Contract), learn how to implement [Custom Stores](#Custom_Stores), by making use of the built-in store API, and explore how we can implement [a completely custom store]() without using the built-in stores at all.

## The store contract

The built-in Svelte stores (`readable`, `writable`, and `derived`) are just store _implementations_ and while they are perfectly capable of handling many tasks, sometimes you need something more specific. Although often overlooked, the store _contract_ is what gives these stores their power and flexibility. Without this contract, svelte stores would be awkward to use and require significant amounts of boilerplate.

Svelte does not compile your javascript files and, as such, only observes the store contract inside Svelte components.

### `store.subscribe`

At its simplest, the store contract is this: any time Svelte sees a variable prepended with `$` in a Svelte component (such as `$store`) it calls the `subscribe` method of that variable. The `subscribe` method must take a single argument, which is a function, and it must _return_ a function that allows any subscribers to unsubscribe when necessary. Whenever the callback function is called, it must be passed the current store value as an argument. The callback passed to subscribe should be called when subscribing and anytime the store value changes.

The following examples aren't the _exact_ code that Svelte produces, rather, simplified examples to illustrate the behaviour.

This:

```js
import { my_store } from './store.js';

console.log($my_store);
```

Becomes something like this:

```js
import { my_store } from './store.js';

let $my_store;
const unsubscribe = my_store.subscribe(value => ($my_store = value));
onDestroy(unsubscribe);

console.log($my_store);
```

The callback function passed to `my_store.subscribe` is called immediately and whenever the store value changes. Here, Svelte has automatically produced some code to assign the `my_store` value to `$my_store` whenever it is called. If  `$my_store` is referenced in the component, it also causes those parts of the component to update when the store value changes. When the component is destroyed, Svelte calls the unsubscribe function returned from `my_store.subscribe`.

### `store.set`

Optionally, a store can have a `set` method. Whenever there is an assignment to a variable prepended with `$` in a Svelte component it calls the `set` method of that variable with newly mutated or reassigned `$variable` as an argument. Typically, this `set` argument should update the store value and call all subscribers, but this is not required. For example, Svelte's `tweened` and `spring` stores do not immediately update their values but rather schedule updates on every frame for as long as the animation lasts. If you decide to take this approach with `set`, we advise not [binding](tutorial/store-bindings) to these stores as the behaviour could be unpredictable.

This:

```js
$my_store = 'Hello';
```

Will become something like:

```js
$my_store = 'Hello';
my_store.set($my_store);
```

The same is true when assigning to a nested property of a store.

This:

```js
$my_store.greeting = 'Hello';
```

Becomes:

```js
$my_store.greeting = 'Hello';
my_store.set($my_store);
```

Although Svelte's built-in stores also have an `update` method, this is not part of the contract and is not required to benefit from the automatic subscriptions, unsubscriptions, and updates that the store contract provides. Stores can have as many additional methods as you like, allowing you to build powerful abstractions that take advantage of the automatic reactivity and cleanup that the store contract provides.

To summarise, the store contract states that svelte stores must be an object containing the following methods:

- `subscribe` - Automatically called whenever svelte sees a `$` prepended variable (like `$store`) ensuring that the `$` prepended value always has the current store value. Subscribe must accept a function which is called both immediately, and whenever the store value changes, it must return an unsubscribe function. The callback function must be passed the current store value as an argument whenever it is called.
- `set` - Automatically called whenever Svelte sees an assignment to a `$` prepended variable (like `$store = 'value'`). This should generally update the store value and call all subscribers.

## Custom stores

Now we know what Svelte needs to make use of the shorthand store syntax, we can get to work implementing a custom store by augmenting a svelte store and re-exporting it. Since Svelte doesn't care about additional methods being present on store objects, we are free to add whatever we like as long as `subscribe`, and optionally `set`, are present.

### Linked stores

In this first example, we are creating a function that returns two linked stores that update when their partner changes, this example uses this linked store to convert temperatures from Celsius to Fahrenheit and vice-versa. The interface looks like this:

```js
store : { subscribe, set }
function(a_to_b_function, b_to_a_function): [store, store]
```

To implement this store, we need to create two writable stores, write custom `set` methods for each, and return an array of store objects containing this `set` method.

We define a function first as this implementation is a store _creator_ allowing us plenty of flexibility. The function needs to take two parameters, each being a callback function which is called when the stores are updated. The first function takes the first store value and returns a value that sets the value of the second store. The second argument does the opposite. One of these functions is called when the relevant `set` method is called.

```js
import { writable } from 'svelte/store';

function synced(a_to_b, b_to_a) {
	const a = writable();
	const b = writable();
}
```

The `set` methods call their own `set` with the provided value and call the partner store's `set` when the provided value is passed through the callback function.

```js
// called when store_a.set is called or its binding reruns
function a_set($a) {
	a.set($a);
	b.set(a_to_b($a));
}

// called when store_b.set is called or its binding reruns
function b_set($b) {
	b.set(b_to_a($b));
	a.set($b);
}
```

All we need to do now is return an array of objects each containing the correct `subscribe` and `set` method:

```js
return [
	{ subscribe: a.subscribe, set: a_set },
	{ subscribe: b.subscribe, set: b_set },
];
```

Inside a component, we can use this synced store creator by deconstructing the returned array. This ensures Svelte can subscribe to each store individually, as stores definitions need to be at the top level for this to happen. This store can be imported and reused in any component.

```js
import { synced } from './synced.js';

const [a, a_plus_five] = synced(
	a => a + 5,
	b => a - 5
);

$c = 0; // set an initial value
```

Since we have written custom `set` methods, we are also free to bind to each individual store. When one store updates, the other also updates after the provided function is applied to the value.

See it in action below. The following example uses the `synced` store to convert between Celsius and Fahrenheit in both directions.

<div class="max">
  <iframe
    title="A Custom Synced Store"
    src="/repl/embed?example=cookbook-svelte-store-synced"
    scrolling="no"
  ></iframe>
</div>

## A really special banana
