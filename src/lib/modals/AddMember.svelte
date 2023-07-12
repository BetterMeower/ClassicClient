<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage} from "../stores.js";
    import * as Modals from "../Modal.js";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Add Member</h2>
	<div slot="default">
        <button
            class="long"
            on:click={() => {Modals.Show("AddMember_User")}}
        >
            Enter Username
        </button>
		<button
            class="long"
            on:click={() => {Modals.Show("AddMember_Search")}}
        >
            Search for Users
        </button>
	</div>
</Modal>

<style>
    .long {
		width: 100%;
		margin-bottom: 0.2em;
	}
</style>