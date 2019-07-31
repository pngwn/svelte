<script>
  import { Icon } from '@sveltejs/site-kit';
  export let recipe;
  export let project = 'svelte';
  export let dir = 'cookbook';
</script>

<style>
	section {
		padding: var(--top-offset) var(--side-nav) 6rem var(--side-nav);
		max-width: var(--main-width);
		margin: 0 auto;
	}

	h1 {
		font-size: 4rem;
		font-weight: 400;
	}

	.standfirst {
		font-size: var(--h4);
		color: var(--second);
		margin: 0 0 1em 0;
		padding: 0 0 1em 0;
		border-bottom: var(--border-w) solid #6767785b;
	}

	.byline {
		margin: 0 0 6rem 0;
		padding: 1.6rem 0 0 0;
		border-top: var(--border-w) solid #6767785b;
		font-size: var(--h6);
		text-transform: uppercase;
	}

	.byline a {
		/* border-bottom: none; */
		/* font-weight: 600; */
	}

	.byline a:hover {
		/* border-bottom: 2px solid var(--prime); */
	}

	section h1 {
		color: var(--second);
		max-width: 20em;
		margin: 0 0 .8rem 0;
	}

	section :global(h2) {
		margin: 2em 0 0.5em 0;
		/* color: var(--second); */
		color: var(--text);
		font-size: var(--h3);
		font-weight: 300;
	}

	section :global(figure) {
		margin: 1.6rem 0 3.2rem 0;
	}

	section :global(figure) :global(img) {
		max-width: 100%;
	}

	section :global(figcaption) {
		color: var(--second);
		text-align: left;
	}

	section :global(video) {
		width: 100%;
	}

	section :global(blockquote) {
		max-width: none;
		border-left: 4px solid #eee;
		background: #f9f9f9;
		border-radius: 0 var(--border-r) var(--border-r) 0;
	}

	section :global(code) {
		padding: .3rem .8rem .3rem;
		margin: 0 0.2rem;
		top: -.1rem;
		background: var(--back-api);
	}

	section :global(pre) :global(code) {
		padding: 0;
		margin: 0;
		top: 0;
		background: transparent;
	}

	section :global(aside) {
		float: right;
		margin: 0 0 1em 1em;
		width: 16rem;
		color: var(--second);
		z-index: 2;
	}

	section :global(.max) {
		width: 100%;
	}

	section :global(iframe) {
		width: 100%;
		height: 420px;
		margin: 2em 0;
		border-radius: var(--border-r);
		border: 0.8rem solid var(--second);
	}

	/* headers anchors */

	section :global(.offset-anchor) {
		position: relative;
		display: block;
		top: calc(-1 * (var(--nav-h) + var(--top-offset) - 1rem));
		width: 0;
		height: 0;
	}

	section :global(.anchor) {
		position: absolute;
		display: block;
		background: url(/icons/link.svg) 0 50% no-repeat;
		background-size: 1em 1em;
		width: 1.4em;
		height: 1em;
		top: calc((var(--h3) - 24px) / 2);
		left: -1.4em;
		opacity: 0;
		transition: opacity 0.2s;
		border: none !important; /* TODO get rid of linkify */
	}

	section :global(h2):hover :global(.anchor),
	section :global(h3):hover :global(.anchor),
	section :global(h4):hover :global(.anchor),
	section :global(h5):hover :global(.anchor),
	section :global(h6):hover :global(.anchor) {
		opacity: 1;
	}


	@media (max-width: 768px) {
		section :global(.anchor) {
			transform: scale(0.6);
			opacity: 1;
			top: calc((1em - 0.6 * 24px) / 2);
			left: -1.0em;
		}
	}

	@media (min-width: 910px) {
		section :global(.max) {
			width: calc(100vw - 2 * var(--side-nav));
			margin: 0 calc(var(--main-width) / 2 - 50vw);
			text-align: center;
		}

		section :global(.max) > :global(*) {
			width: 100%;
			max-width: 1200px;
		}

		section :global(iframe) {
			width: 100%;
			max-width: 1100px;
			margin: 2em auto;
		}
	}

	section > :global(.code-block) > :global(pre) {
		display: inline-block;
		/* background: var(--back-api); */
		color: white;
		padding: .3rem .8rem;
		margin: 0;
		max-width: 100%;
	}
	section > :global(.code-block)> :global(pre.language-markup) {
		padding: .3rem .8rem .2rem;
		background: var(--back-api);
	}
	section > :global(p) {
		max-width: var(--linemax)
	}
	section :global(p) {
		margin: 1em 0;
	}
	small {
		font-size: var(--h5);
		float: right;
		pointer-events: all;
		color: var(--prime);
		cursor: pointer;
	}
	/* no linkify on these */
	small a        { all: unset }
	small a:before { all: unset }
	section :global(blockquote) {
		color: hsl(204, 100%, 50%);
		border: 2px solid var(--flash);
	}
	section :global(blockquote) :global(code) {
		background: hsl(204, 100%, 95%) !important;
		color: hsl(204, 100%, 50%);
	}

	h1 {
		margin-bottom: 0px;
	}
</style>

<section data-id={recipe.slug}>
	<h1>
		<span class="offset-anchor" id={recipe.slug}></span>
		<a href="cookbook/{recipe.slug}" class="anchor" aria-hidden></a>

		{@html recipe.metadata.title}
		<small>
			<a href="https://github.com/sveltejs/{project}/edit/master/site/content/{dir}/{recipe.file}" title="edit this section">
				<Icon name='edit' />
			</a>
		</small>
	</h1>
	<p class="standfirst">{recipe.metadata.description}</p>

	{@html recipe.html}
</section>
