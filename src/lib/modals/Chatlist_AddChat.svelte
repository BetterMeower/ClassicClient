<script>	
	import Modal from "../Modal.svelte";
    import * as clm from "../clmanager.js";
	import {link} from "../clmanager.js";
    import Container from "../Container.svelte";
	import Loading from "../Loading.svelte";

    import {fly} from "svelte/transition";
	import {flip} from 'svelte/animate';

	import {modalShown, modalPage, profileClicked, mainPage as page, chatName, chatid, chatMembers, chatOwner} from "../stores.js";
    import { Hide } from "../Modal";
    import {tick} from "svelte";
    import sleep from "../sleep";

    export let chats = [];

	let toLeaveChat = false;

	let pagesLoaded = 0;
	let pageLoading = false;
	let numPages = null;

	// As we use a Load More button and the home is sorted newest-first,
	// we need an offset for chats to be continuous.
	let chatOffset = 0;

	/**
	 * Loads a page, with offset and overflow calculations.
	 * 
	 * @param {number} [page] The page to load. If not present, simply clears the chats.
	 */
	async function loadPage(page) {
		pageLoading = true;
		if (page === undefined) {
			chats = [];
		} else {
			// 25 chats per page...
			let realPage = page + Math.floor(chatOffset / 25);

            clm.meowerRequest({
                cmd: "direct",
                val: {
                    cmd: "get_chat_list",
                    val: {
                        page: realPage,
                    },
                }
            });
		}
	}

    /**
	 * Adds events to listen for when the chats get sent.
	 */
	function listenOnLink() {
		link.on("direct", cmd => {
			if (cmd.val.mode === "chats") {
                let realOffset = chatOffset % 25;
                let allChats = cmd.val.payload.all_chats;
				allChats.splice(0, realOffset);
                numPages = cmd.val.payload.pages;

                if (realOffset > 0 && pagesLoaded < numPages) {
                    let realPage = cmd.val.payload["page#"] + Math.floor(chatOffset / 25);
                    loadPage(realPage);
                } else {
                    pagesLoaded = cmd.val.payload["page#"];
                    chats = allChats;
                    pageLoading = false;
                }
			}
		});
	}
	if (link.ws.readyState === 1) {
		listenOnLink();
	} else {
		link.ws.addEventListener("open", listenOnLink);
	}

    loadPage(1);
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Add {$profileClicked} to group chat</h2>
    <div slot="default">
		Please choose a group chat to add <i>{$profileClicked}</i> to.
        <br />
        {#if pageLoading}
            <div class="fullcenter">
                <Loading />
            </div>
        {:else}
        <br>
            {#each chats as chat (chat._id)}
                <div
                    transition:fly|local="{{y: -50, duration: 250}}"
                    animate:flip="{{duration: 250}}"
                >
                    <Container>
                        <div class="settings-controls">
                            <button
                                class="circle join"
                                on:click = {async ()=>{
                                    clm.meowerRequest({
                                        cmd: "direct", 
                                        val: {
                                            cmd: "add_to_chat", 
                                            val: {chatid: chat._id, username: $profileClicked}
                                        }
                                    });
                                    Hide()
                                    chatMembers.set(chat.members);
                                    $chatMembers.push($profileClicked)
                                    chatMembers.set($chatMembers);
                                    chatName.set(chat.nickname);
                                    chatid.set(chat._id);
                                    chatOwner.set(chat.owner);
                                    window.scrollTo(0,0);
                                    page.set("blank");
                                    tick().then(() => page.set("groupchat"));
                                }}
                            ></button>
                        </div>

                        <h1>{chat.nickname}</h1>
                        Members: {
                            chat.members.length > 4 ? (
                                chat.members.slice(0, 4).join(", ") + "..."
                            ) : chat.members.join(", ")
                        }
                    </Container>
                </div>
            {/each}
            <div class="center">
                {#if pageLoading}
                    <Loading />
                {:else}
                    {#if numPages && numPages > pagesLoaded}
                        <button 
                            class="load-more"
                            on:click={() => loadPage(pagesLoaded + 1)}
                        >
                            Load More
                        </button>
                    {/if}
                {/if}
            </div>
        {/if}
        <button on:click={() => {
            $modalShown = false;
        }}>Cancel</button>
	</div>
</Modal>

<style></style>
