---
title: Stores
description: Getting the most out of Svelte stores.
---

*This guide assumes you understand the basics of Svelte Stores. If you aren't familiar with them then working through the [relevant tutorial](tutorial/writable-stores) and reading the [store documentation](http://localhost:3000/docs#svelte_store) are highly recomended.*

Svelte stores offer a simple mechanism to handle shared state in your Svelte application but looking beyond the built-in store implementations will unlock a whole world of power that you could never have dreamed of. In this episode of *The Tinest Kitchen* we'll take a close look at [The Store Contract](#The_Store_Contract), learn how to implement [Custom Stores](#Custom_Stores), by making use of the built in store API, and explore how we can implement [a completely custom store]() without using the built-in stores at all.

## The store contract

The built-in Svelte stores (`readable`, `writable`, and `derived`) are just store *implementations* and while the are perfectly capable of handling many tasks, sometimes you need something more specific. Although often overlooked, the store *contract* is what gives these stores their power and flexibility. Without this contract, svelte stores would be awkward to use and require significant amounts of boilerplate.

Svelte does not compile your javascript files and, as such, the contract is only obsered inside Svelte components.

### `store.subscribe`

At its simplest, the store contract is this: any time Svelte sees a variable prepended with `$` in a Svelte component (such as `$store`) it will call the `subscribe` method of that variable. The `subscribe` method must take a single argument which is a function and it must *return* a function that allows any subscribers to unsubscribe when necessary. The callback function must be passed the current store value as an argument whenever it is called. The callback passed to subscribe should be called immediately when subscribing and anytime the store value changes.

The following examples aren't the *exact* code Svelte will produce, rather simplified examples to illustrate the behaviour.

This:

```js
import { my_store } from './store.js';

console.log($my_store);
```

Becomes something like this:

```js
import { my_store } from './store.js';

let $my_store;
const unsubscribe = my_store.subscribe((value) => $my_store = value);
onDestroy(unsubscribe);

console.log($my_store);
```

The callback function that was passed to `my_store.subscribe` will be called immediately and whenever the store value changes. Here, Svelte has automatically produced some code to assign the `my_store` value to `$my_store` whenever it is called. If this `$my_store` is referenced in the component it will also cause those parts of the component to update when the store value changes. When the component is destroyed, Svelte calls the unsubscribe function that is returned from `my_store.subscribe`.

### `store.set`

Optionally, a store can have a `set` method. Whenever there is an assignment to a variable prepended with `$` in a Svelte component it will call the `set` method of that variable with newly mutated or reassigned `$variable` as an argument. Normally, this `set` argument should update the store value and call all subscribers but this is not required. For example, Svelte's `tweened` and `spring` stores do not immediately update their values but rather schedule updates on every frame for as long as the animation lasts. If you decide to take this approach with `set` we advise not [binding](tutorial/store-bindings) to these stores as the behaviour could be unpredictable.

This:

```js
	$my_store = 'Hello';
```

Will become something like:

```js
$my_store = 'Hello';
my_store.set($my_store);
```

The same is true when assigning to nested properties of a store.

This:

```js
	$my_store.greeting = 'Hello';
```

Becomes:

```js
$my_store.greeting = 'Hello';
my_store.set($my_store);
```

Although Svelte's built in stores also have an `update` method, this is not part of the contract and is not required to benefit from the automatic subscriptions, unsubscriptions, and updates that the store contract provides. Stores can have as many additional methods as you like, allowing you to build powerful abstractions that take advantage of the automatic reactivity and cleanup that the store contract provides.

To summarise, the store contract states that svelte stores must be an object containg the following methods:

- `subscribe` - Automatically called whenever svelte sees a `$` prepended variable (like `$store`) ensuring that the `$` prepended value always has the current store value. Subscribe must accept a function which is called both immediately and whenever the store value changes, it must return and unsubscribe function. The callback function must be passed the current store value as an argument whenever it is called.
- `set` - Automatically called whenever Svelte sees an assignment to a `$` prepended variable (like `$store = 'value'`). This shoudl normally update teh store value and call all subscribers.

## Custom stores

## A really special banana
