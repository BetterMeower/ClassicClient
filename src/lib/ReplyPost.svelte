<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "./Container.svelte";
    import {apiUrl} from "./urls.js";
	import {auth_header,uncensoredposts,DevMode} from "./stores.js"
	import { IMAGE_HOST_WHITELIST } from "./hostWhitelist.js";

	import {default as loadProfile, profileCache} from "../lib/loadProfile.js";

	import ReplyPost from "./ReplyPost.svelte"

	import {onMount, tick} from "svelte";

	export let _post;
	export let ShowMoreButton = true

	let images = [];

	let _ShowMore = false

	async function help() {
		const res = await fetch(
			`${apiUrl}posts?id=${_post}`,
			{
				headers: $auth_header
			}
		)
		const json = await res.json()

		let post = {
			post_id: json.post_id,
			content: json.p,
			unfiltered_content: json.unfiltered_p,
			user: json.u,
			origin: json.post_origin,
			date: json.t.e,
		}

		if ($uncensoredposts == true) {
			if (post.content.includes("****")) {
				if (post.unfiltered_content != undefined) {
					post.content = post.unfiltered_content
				} else {
					if (DevMode) {
						post.content = post.content + " (Not actually censored)"
					}
				}
			}
		}

		initPostUser(post)

		return json
	}

	let bridged = false
	let webhook = false

    function initPostUser(post) {
        if (!post.user) return;

		if (post.content.includes(":")) {
			bridged =
				post.user === "Discord" ||
				post.user === "revolt" ||
				post.user === "Revower";
			webhook = post.user == "Webhooks";
		}

		if (bridged || webhook) {
			post.user = post.content.split(": ")[0];
			post.content = post.content.slice(post.content.indexOf(": ") + 1);
		}

		// Match image syntax
		// ([title: https://url])
		const iterator = post.content.matchAll(
			/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs
		);
		images = [];
		while (true) {
			const result = iterator.next();
			if (result.done) break;

			try {
				new URL(result.value[2]);
			} catch (e) {
				continue;
			}

			if (
				!IMAGE_HOST_WHITELIST.some(o =>
					result.value[2].toLowerCase().startsWith(o.toLowerCase())
				)
			)
				return;

			images.push({
				title: result.value[1],
				url: result.value[2],
			});
			// Prevent flooding
			if (images.length >= 3) break;
		}
		images = images;

		if (!webhook) loadProfile(post.user);
    }
</script>

<Container>
    {#await 
		help()
	}
        <span class="loading">
            <span class="circle circle1"></span>
            <span class="circle circle2"></span>
            <span class="circle circle3"></span>
            <b class="text">Loading...</b>
        </span>
    {:then info}
		{#if info.isDeleted}
			<span><b>Deleted Message</b></span>
		{:else}
			{#if info.p.includes(":") ||
				info.u === "Discord" ||
				info.u === "revolt" ||
				info.u === "Revower"
			}
				<span><b>{info.p.split(": ")[0]}</b> {info.p.slice(info.p.indexOf(": ") + 1)}</span>
			{:else}
				{#if info.p.search(/^@\w+\s\[\w+-\w+-\w+-\w+-\w+\]\s*/i) != -1}
					{#if ShowMoreButton}
						{#if !_ShowMore}
							<button class="full" on:click={() => {_ShowMore = true}}>Show Full reply chain</button>
							<br>
							<br>
						{/if}
						{#if _ShowMore}
							<ReplyPost _post={info.p.split(" ").splice(1, 1)[0].replace("[", "").replace("]", "")} ShowMoreButton = {false}  />
						{/if}
					{:else}
						<ReplyPost _post={info.p.split(" ").splice(1, 1)[0].replace("[", "").replace("]", "")} ShowMoreButton = {false}  />
					{/if}
					<span><b>{info.u}</b> {info.p.split(/^@\w+\s\[\w+-\w+-\w+-\w+-\w+\]\s*/i).join(" ")}</span>
				{:else}
					<span><b>{info.u}</b> {info.p}</span>
				{/if}
			{/if}
			{#if images.length > 0}
				<br>
				<br>
				<div class="post-images">
					{#each images as { title, url }}
						<a href={url} target="_blank" rel="noreferrer">
							<img src={url} alt={title} {title} class="post-image" />
						</a>
					{/each}
				</div>
			{/if}
		{/if}
    {:catch error}
        <span><b>Error fetching post:</b> <code>{error}</code></span>
    {/await}
</Container>

<style>
	.loading {
		align-items: center;
		display: flex;
		height: 20px;
	}
	.circle {
		width: 10px;
		height: 10px;
		border-radius: 100%;

		display: inline-block;
		background: var(--orange-button);
		margin-right: 4px;

		animation: jump 0.5s infinite cubic-bezier(.45,.05,.55,.95) alternate;
	}

	.circle1 {
		animation-delay: 0s;
	}
	.circle2 {
		animation-delay: -0.166s;
	}
	.circle3 {
		animation-delay: -0.333s;
	}

    .text {
        margin-left: 6px;
    }

	.full {
		width:100%;
	}

	.post-image {
		max-height: 12em;
		max-width: 100%;
	}

	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
	}

	@keyframes jump {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-5px);
		}
	}
</style>
