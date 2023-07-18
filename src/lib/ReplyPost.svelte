<!-- A post. Profile pictures not appearing while not logged in is intentional. -->
<script>
	import Container from "./Container.svelte";
    import {apiUrl} from "./urls.js";
	import {auth_header} from "./stores.js"

	import ReplyPost from "./ReplyPost.svelte"

	import {onMount, tick} from "svelte";

	export let post;
	export let ShowMoreButton = true

	let _ShowMore = false

	let bridged = false
	let webhook = false

    function initPostUser() {
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
    }

    onMount(initPostUser);
</script>

<Container>
    {#await fetch(`${apiUrl}posts?id=${post}`,{headers: {"Authorization":$auth_header}}).then(res => res.json())}
        <span class="loading">
            <span class="circle circle1"></span>
            <span class="circle circle2"></span>
            <span class="circle circle3"></span>
            <b class="text">Loading...</b>
        </span>
    {:then info}
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
						<ReplyPost post={info.p.split(" ").splice(1, 1)[0].replace("[", "").replace("]", "")} ShowMoreButton = {false}  />
					{/if}
				{:else}
					<ReplyPost post={info.p.split(" ").splice(1, 1)[0].replace("[", "").replace("]", "")} ShowMoreButton = {false}  />
				{/if}
				<span><b>{info.u}</b> {info.p.split(/^@\w+\s\[\w+-\w+-\w+-\w+-\w+\]\s*/i).join(" ")}</span>
			{:else}
				<span><b>{info.u}</b> {info.p}</span>
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

	@keyframes jump {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-5px);
		}
	}
</style>
