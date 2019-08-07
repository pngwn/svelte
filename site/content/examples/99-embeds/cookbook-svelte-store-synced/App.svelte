<script>
	import synced from './synced.js';

	const [c, f] = synced(
		c => +(32 + (9 / 5 * c)).toFixed(1),
		f => +(5 / 9 * (f - 32)).toFixed(1)
	);

	$c = 0;
</script>

<input type='number' bind:value={$c}> °c =
<input type='number' bind:value={$f}> °f

<style>
	input {
		width: 5em;
	}
</style>
