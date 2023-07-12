<!--
    The profile container seen all over svelte

    TO DEVLOPERS: USE THIS NOT THE CONTENTS
    TO WHOEVER ADDED THIS: THANK YOU FOR MAKING MY JOB HARDER -ARROW
    It was me - bloctans

    import: import ProfileView from "../lib/Profile_View.svelte";
    example usage: <ProfileView username={$profileClicked}></ProfileView>

    best of all, the rest (pfp, status, role, name) is handled for you!
    
    all you need to enter is a name!
-->

<script>

    import loadProfile from "./loadProfile";
    import {ulist,user, modalPage, modalShown, mainPage as page} from "./stores.js";
    import Loading from "./Loading.svelte";
    import Container from "./Container.svelte";
    import PFP from "./PFP.svelte";
    import { levels } from "./formatting";

    export const ShowJoin = true
    export const FromGC = false

    import { createEventDispatcher, tick } from 'svelte';
	const dispatch = createEventDispatcher();
    
    function dispatchPFP() {
        dispatch("pfpClicked");
    }
    export let username = "";

</script>

<div class="Profile">
    {#await loadProfile(username)}
        <div class="center">
            <Loading />
        </div>
    {:then data}
        <Container>
            <div class="profile-header">
                <span class="pfp" on:click={dispatchPFP}>
                    <PFP
                        online={$ulist.includes(data._id)}
                        icon={
                            username === $user.name ?
                                $user.pfp_data : data.pfp_data
                        }
                        alt="{username}'s profile picture"
                        size={1.4}
                    ></PFP>
                    </span>
                <div class="profile-header-info">
                    <h1 class="profile-username">{username}</h1>
                    <div class="profile-active">
                        {#if data.banned == false}
                            {$ulist.includes(username) ? "Online" : "Offline"}
                        {:else}
                            Banned
                        {/if}
                    </div>
                    <div class="profile-role">
                        {levels[data.lvl] || "Unknown"}
                    </div>
                </div>
                <div class="settings-controls">
                    {#if username === $user.name}
                        <button
                            class="circle settings"
                            on:click = {()=>{
                                window.scrollTo(0,0);
					            page.set("blank");
					            tick().then(() => page.set("settings"));
                            }}
                        ></button>
                        <button
                            class="circle leave"
                            on:click = {()=>{
                                $modalPage = "logout";
					            $modalShown = true;
                            }}
                        ></button>
                    {:else}
                        {#if ShowJoin}
                            <button
                                class="circle join"
                                on:click = {()=>{
                                    $modalPage = "CL_AddChat";
                                    $modalShown = true;
                                }}
                            ></button>
                        {/if}
                        <button
                            class="circle report"
                            on:click = {()=>{
                                $modalPage = "reportUser";
					            $modalShown = true;
                            }}
                        ></button>
                    {/if}
                </div>
            </div>
        </Container>
    {:catch e}
        <Container>
            <h2>Error</h2>
            We couldn't get this user's profile info.
        </Container>
        <Container>
            <pre><code>{e}</code></pre>
            Try again. If this issue persists,
            <a
                href="https://github.com/BetterMeower/BetterMeower-Svelte/issues/new"
            >create an issue on BetterMeower's issue tracker</a> with the error code shown above.
        </Container>
    {/await}
</div>

<style>
    .profile-header-info {
		margin-left: 1em;
		height: 6em;
	}

    .profile-active {
        font-style: italic;
    }

	.profile-role {
        position: absolute;
        font-size: 90%;
    }

	.profile-username {
		margin: 0;
		display: inline-block;
		max-width: 100%;
		font-size: 3em;
	}

	.profile-header {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
    .pfp:hover:not(:active), .pfp:focus-visible {
		transform: scale(1.1);
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