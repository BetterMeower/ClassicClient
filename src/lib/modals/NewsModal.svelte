<script>	
	import Modal from "../Modal.svelte";

	import {modalShown,modalPage} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">It's time to switch to another client</h2>
    <div slot="default">
        <p>Effective 10 November 2023, BetterMeower Classic is now deprecated and we recommend switching to the Vanilla Meower client. This won't affect your account, settings, posts or chats at all, plus you'll get new features like DMs, improved chats and post editing etc.</p>
        <p></p>
        <p>Don't worry, we've got a replacement client coming soon, which we will release updates on via our blog at <a href="https://blog.bettermeower.app">https://blog.bettermeower.app</a>.</p>
        <hr>
        <div class="modal-buttons">
            <button on:click={() => {
                $modalShown = false;
                localStorage.setItem("deprecated-warning", "seen");
                console.log("News modal closed")
            }}>Close</button>
             <button on:click={() => {
                window.open("https://app.meower.org", "_blank");
                console.log("Vanilla Meower opened via News modal")
            }}>Switch to Vanilla Meower</button>
        </div>
	</div>
</Modal>

<style>
	.small {
		font-size: 12px;
	}
</style>