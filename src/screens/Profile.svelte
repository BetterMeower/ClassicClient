<!-- The profile page, now with viewing others' profiles. -->
<script>
	import {
		modalPage, modalShown,
		ulist,
		profileClicked, user,
		mainPage as page
	} from "../lib/stores.js";

	import {profileCache} from "../lib/loadProfile.js";

    import PFP from "../lib/PFP.svelte";
    import Loading from "../lib/Loading.svelte";
    import Container from "../lib/Container.svelte";
    import * as clm from "../lib/clmanager.js";
	import Recent from "./Recent.svelte";

	import {tick} from "svelte";
	import {apiUrl, encodeApiURLParams} from "../lib/urls";
    import ProfileView from "../lib/Profile_View.svelte";
    import { Show } from "../lib/Modal.js";
    import Pfp from "../lib/PFP.svelte";
	
	const pfps = new Array(39).fill().map((_,i) => i+1);
	let pfpSwitcher = false;

	async function loadProfile() {
		let path = `users/${$profileClicked}`;
		if (encodeApiURLParams) path = encodeURIComponent(path);
		const resp = await fetch(
			`${apiUrl}${path}`
		);
		if (!resp.ok) {
			throw new Error("Response code is not OK; code is " + resp.status);
		}
		const json = await resp.json();
		return json;
	}

	/**
	 * Saves the user profile, and also clears its cache entry.
	 */
	function save() {
		if ($profileCache[$user.name]) {
			const _profileCache = $profileCache;
			delete _profileCache[$user.name];
			profileCache.set(_profileCache);
		}

		clm.updateProfile();
	}

	function togglePfpSwitcher() {
		pfpSwitcher = !pfpSwitcher;
	}
</script>

<div class="OtherProfile">
{#await loadProfile()}
	<div class="fullcenter">
		<Loading />
	</div>
{:then data}
		<ProfileView username={$profileClicked} on:pfpClicked={togglePfpSwitcher}></ProfileView>

		{#if $user.name === $profileClicked}
			{#if pfpSwitcher}
				<Container>
					<h2>Profile Picture</h2>
					<div id="pfp-list">
						{#each pfps as pfp}
							<span
								on:click={() => {
									pfpSwitcher = false;
									$user.pfp_data = pfp;
									save();
								}}
								class="pfp"
								class:selected={$user.pfp_data === pfp}
							><PFP
								online={false}
								icon={pfp}
								alt="Profile picture {pfp}"
							></PFP></span>
						{/each}
					</div>
					<!--<button
						class="long"
						title="Close Profile Picture Changer"
						on:click={() => pfpSwitcher = false}
					>Close</button>-->
				</Container>
			<!--{:else if $profileClicked === $user.name}
				<button
					class="long"
					title="Change Profile Picture"
					on:click={() => pfpSwitcher = true}
				>Change Profile Picture</button>-->
			{/if}
		{/if}

		{#if data.quote}
			<Container>
				{#if $profileClicked === $user.name}
					<div class="settings-controls">
						<button
							class="circle join"
							on:click = {()=>{
								modalPage.set("setQuote");
								modalShown.set(true);
							}}
						></button>
					</div>
				{/if}
				<h2>{$profileClicked}'s Quote</h2>
				<p>"<i>{data.quote}</i>"</p>
			</Container>
		{:else}
		<Container>
				{#if $profileClicked === $user.name}
					<div class="settings-controls">
						<button
							class="circle join"
							on:click = {()=>{
								modalPage.set("setQuote");
								modalShown.set(true);
							}}
						></button>
					</div>
				{/if}
			
				{#if $profileClicked === $user.name}
					<h2>{$profileClicked}'s Quote</h2>
					Hmm, looks like you don't have a quote. You can set one by clicking the quote icon at the top right corner of the quote box.
				{:else}
					<h2>{$profileClicked}'s Quote</h2>
					Hmm, looks like <b>{$profileClicked}</b> doesn't have a quote.
				{/if}
			</Container>
		{/if}

		<!--<button
			class="long"
			title="View Recent Posts"
			on:click={()=>{
				window.scrollTo(0,0);
				page.set("blank");
				tick().then(() => page.set("recent"));
			}}
		>View recent posts</button>-->

		<!--{#if $user.name && $profileClicked !== $user.name}
			<button 
				class="long" 
				on:click={()=>{
					Show("CL_AddChat")
				}}
			>Add To Chat</button>
			<button
				class="long"
				title="Report User"
				on:click={()=>{
					modalPage.set("reportUser");
					modalShown.set(true);
				}}
			>Report User</button>
		{/if}
		{#if $profileClicked === $user.name}
			<button
				class="long"
				title={data.quote ? "Update Quote" : "Set Quote"}
				on:click={() => {
					modalPage.set("setQuote");
					modalShown.set(true);
				}}
			>{data.quote ? "Update Quote" : "Set Quote"}</button>
			<button
				class="long"
				title="Settings"
				on:click={()=>{
					window.scrollTo(0,0);
					page.set("blank");
					tick().then(() => page.set("settings"));
				}}
			>Settings</button>
			<button
				class="long"
				title="Log Out"
				on:click={() => {
					$modalPage = "logout";
					$modalShown = true;
				}}
			>Log Out</button>
		{/if}-->
	{:catch e}
		<ProfileView username={$profileClicked}></ProfileView>
	{/await}
</div>
<hr>
<div>
	<Recent />
</div>
<style>
    .fullcenter {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100vw;
		height: 100vh;

		position: fixed;
		top: 0;
		left: 0;
	}

    .long {
        width: 100%;
        margin: 0;
		margin-bottom: -2px;
    }

	.pfp {
		padding: 0.2em;
		margin: 0.2em;
		border-radius: 1.45em;
		display: inline-block;
	}
	.pfp:hover {
		background-color: var(--orange-light);
	}
	.pfp.selected {
		background-color: var(--orange);
	}
	#pfp-list {
		display: flex;
		flex-wrap: wrap;
	}
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}
	button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
