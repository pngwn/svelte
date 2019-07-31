---
title: Stores
description: Getting the most out of Svelte stores.
---

Stores are one of the more powerful and flexible features in Svelte 3 but often theur super-powers go unnappreciated. In this episode of *The Tiniest Kitchen* we will explore take a deep-dive into Svelte Stores and unearth their most closely held secrets.

## They are just bananas

Svelte stores are just bananas: within lies a delicious morsel but for reasons of practicality, they stay wrapped while in transit. Svelte stores are also not like bananas because keeping the value wrapped is very simple. I don't know if you have ever tried to unpeel a banana.

In svelte you can easily access the value inside of a store by adding a `$` to the front of the store's variable name, this allows you to reference the store value rather than the store object itself (which contains a bunch of stuff that we will cover later).

```sv
<script>
  import { writable } from 'svelte/store';

  // A store which is actually an object with some methods
  const my_store = writable('a banana');
</script>

<!-- The actual value -->
<p>{$my_store}</p>
```

In the above example `my_store` refers to the store object, `$my_store` refers to the actual value contained with the store.

## I have too many bananas!

When you have a great deal of bananas—say, a thousand—things can get a bit tricky. The solution is, of course, to put all of the bananas into a single skin. You may have noticed that the banana metaphor has completely broken down. I have made a terrible mistake.

## The Contract <sup>TM</sup>

## A banana split

## A really special banana
