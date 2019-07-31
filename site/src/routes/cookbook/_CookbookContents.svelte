<script>
	import { afterUpdate } from 'svelte';
	import { stores } from '@sapper/app';
	import { Icon } from '@sveltejs/site-kit';

	export let recipes = [];
	export let active_recipe = null;
	export let show_contents;
	export let prevent_sidebar_scroll = false;
	let ul;

	const { page } = stores();

	$: segment = $page.path.split('/')[2];

	//$: console.log('recipe:', active_recipe, recipes)

	afterUpdate(() => {
		// bit of a hack — prevent sidebar scrolling if
		// TOC is open on mobile, or scroll came from within sidebar
		if (prevent_sidebar_scroll || show_contents && window.innerWidth < 832) return;
		const active = ul.querySelector('.active');
		if (active) {
			const { top, bottom } = active.getBoundingClientRect();
			const min = 200;
			const max = window.innerHeight - 200;
			if (top > max) {
				ul.parentNode.scrollBy({
					top: top - max,
					left: 0,
					behavior: 'smooth'
				});
			} else if (bottom < min) {
				ul.parentNode.scrollBy({
					top: bottom - min,
					left: 0,
					behavior: 'smooth'
				});
			}
		}
  });

  $: console.log(recipes)
</script>

<style>
	.reference-toc li {
		display: block;
		line-height: 1.2;
		margin: 1rem 0 1rem 0;
	}
	a {
		position: relative;
		transition: color 0.2s;
		border-bottom: none;
		padding: 0;
		color: var(--second);
	}

	.section {
		display: block;
		padding: 0 0 .8rem 0;
		font-size: var(--h6);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}
	.subsection {
		display: block;
		font-size: 1.6rem;
		font-family: var(--font);
		padding: 0 0 0.6em 0;
	}

	.subsection:last-child {
		padding-bottom: 2em;
	}

	.section:hover,
	.subsection:hover,
	.active {
		color: var(--flash);
	}
	.subsection[data-level="4"] {
		padding-left: 1.2rem;
	}
	.icon-container {
		position: absolute;
		top: -.2rem;
		right: 2.4rem;
	}
	@media (min-width: 832px) {
		a {
			color: var(--sidebar-text);
		}
		a:hover,
		.section:hover,
		.subsection:hover,
		.active {
			color: white
		}
	}
</style>

<ul
	bind:this={ul}
	class="reference-toc"
	on:mouseenter="{() => prevent_sidebar_scroll = true}"
	on:mouseleave="{() => prevent_sidebar_scroll = false}"
>
	{#each recipes as recipe}
		<li>
			<a class="section" class:active="{recipe.slug === active_recipe}" href="cookbook/{recipe.slug}">
				{@html recipe.metadata.title}

				{#if recipe.slug === active_recipe}
					<div class="icon-container">
						<Icon name="arrow-right" />
					</div>
				{/if}
			</a>
			{#if segment === recipe.slug}
				{#each recipe.subsections as subsection}
					<!-- see <script> below: on:click='scrollTo(event, subsection.slug)' -->
					<a
						class="subsection"
						class:active="{subsection.slug === active_recipe}"
						href="cookbook/{recipe.slug}#{subsection.slug}"
						data-level="{subsection.level}"
					>
						{@html subsection.title}

						{#if subsection.slug === active_recipe}
							<div class="icon-container">
								<Icon name="arrow-right" />
							</div>
						{/if}
					</a>
				{/each}
			{/if}
		</li>
	{/each}
</ul>
