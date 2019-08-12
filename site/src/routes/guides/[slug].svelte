<script context="module">
	export async function preload({ params }) {
		const res = await this.fetch(`guides/${params.slug}.json`);
		return res.ok ? { recipe: await res.json() } : this.error(404, 'Not found');
	}
</script>

<script>
	import Recipe from './_Recipe.svelte';
	export let recipe;
</script>

<svelte:head>
	<title>{recipe.metadata.title}</title>

	<meta name="twitter:title" content={recipe.metadata.title}>
	<meta name="twitter:description" content={recipe.metadata.description}>
	<meta name="Description" content={recipe.metadata.description}>
</svelte:head>

<Recipe {recipe} />
