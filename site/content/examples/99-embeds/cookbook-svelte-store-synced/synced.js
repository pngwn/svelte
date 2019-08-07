import { writable } from 'svelte/store';

export default function(a_to_b, b_to_a) {
	const a = writable();
	const b = writable();

	function a_set($a) {
		a.set($a);
		b.set(a_to_b($a));
	}

	function b_set($b) {
		b.set(b_to_a($b));
		a.set($b);
	}

	return [
		{ subscribe: a.subscribe, set: a_set },
		{ subscribe: b.subscribe, set: b_set },
	];
}
