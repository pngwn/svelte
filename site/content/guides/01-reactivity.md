---
title: Reactivity
description: Understanding reactivity in Svelte components.
---

## Reactive assignments

The new reactivity system introduced in Svelte 3 has made it easier than ever to trigger updates to the DOM but there are a few simple rules when it comes to working with reactivity in Svelte. In this guide, we will take a look how Svelte's recativity system works, what you can and can't do, as well a few pitfalls to avoid.

### Top-level variables

The simplest way to make your Svelte components reactive is by using an assignment operator. Any time Svelte sees an assignent to a *top level variable* it will trigger an update. The import part here is "top-level variable". A 'top level variable' is any variable that is defined inside the script element but is not a child of *anything*. That is to say it is not inside a function or a block. Incidentally, these are also the only variables that can be referenced in the DOM. Lets look at some examples.

The following will work as expected and update the dom:

```sv
<script>
	let num = 0;

	function updateNum() {
		num = 25;
	}
</script>

<button on:click={updateNum}>Update</button>
<p>{num}</p>
```

Svelte can see that there is an assignent to a top level variable and knows to rerender after the `num` variable has been changed.

### each context

The only exception to the top-level variable rule is when you are inside an `each` block.

### Variables not values

Svelte only cares about which *variables* are being reassigned, not which values those variables refer to. If you reassign a variable that is not defined at the top level, Svelte will not trigger an update, even if the value you *are* updating updates the original variable's value as well.

This is the sort of problem you may run into when dealing with objects. Since objects are always passed by reference and not value, you can refer to the same value in many different variables. Lets look at an example:

```sv
<script>
	let obj = {
		num: 0
	};

	function updateNum() {
		const o = obj;
		o.num = 25;
	}
</script>

<button on:click={updateNum}>Update</button>
<p>{obj.num}</p>
```

In this example when we reassign `o.num` we are actually updating the value assigned to `obj` but since we are not updating the actual `obj` variable SVelte does not trigger an update. Svelte does not trace these kinds of values back to variable defined at the top level and has no way of knowing if it has updated or not. Whenever you want to update local component state, it is important that any reassignments are performed on the *actual* variable, not just the value itself.

### Be aware of shadowed variables

Another situation that can sometimes cause unexpected results is when you reassign a function's parameter (as above) and that parameter has the same *name* as a top level variable.

```sv
<script>
	let obj = {
		num: 0
	};

	function(obj) {
		obj.num = 25;
	}
</script>

<button on:click={() => updateNum(obj)}>Update</button>
<p>{num}</p>
```

This example will behave exactly the same as the previous example, except it is perhaps even more confusing. In this case the `obj` variable is being *shadowed* while inside the function, so any assignments to `obj` inside this are actually assignments to the function parameter rather than the top level `obj` variable. It refers to the same value and it has the same name but it is actually a *different* variable inside the function scope.

Reassigning function parameters in this way is excactly the same as reassigning a variable that points back to the top-level variable's value and will never cause an update. To avoid these problems, and potential confusion, it is a good idea not to reuse variable names in different scopes () such as inside functions, and always make sure that you are reassigning a top level variable.


## Reactive Declarations

### Defining dependencies

### Hiding values from reactive declarations

### No infinite loops?
