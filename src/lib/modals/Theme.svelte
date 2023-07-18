<script>	
    import Modal from "../Modal.svelte";
    import * as clm from "../clmanager.js";
    import {modalShown, modalPage, user} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Set Theme</h2>
    <div slot="default" class="grid">
        <button id="fix" style="margin-right: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "orange";
			user.set(_user);
			clm.updateProfile();
        }}>Orange</button>

        <button style="margin-right: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "blue";
			user.set(_user);
			clm.updateProfile();
        }}>Blue</button>

        <button style="margin-right: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "green";
			user.set(_user);
			clm.updateProfile();
        }}>Green</button>

        <button style="margin-right: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "magenta";
			user.set(_user);
			clm.updateProfile();
        }}>Magenta</button>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "red";
			user.set(_user);
			clm.updateProfile();
        }}>Red</button>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "pink";
			user.set(_user);
			clm.updateProfile();
        }}>Pink</button>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "gray";
			user.set(_user);
			clm.updateProfile();
        }}>Gray</button>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
			_user.theme = "purple";
			user.set(_user);
			clm.updateProfile();
        }}>Purple</button>

        <br>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
            _user.mode = true;
            user.set(_user);
            clm.updateProfile();
        }}>Light</button>

        <button style="margin-right: 4px; margin-top: 4px;" on:click={() => {
            const _user = $user;
            _user.mode = false;
            user.set(_user);
            clm.updateProfile();
        }}>Dark</button>

        <!-- <button on:click={() => {
            modalPage.set("ctheme");
        }}>Custom Theme</button> -->
        
        <br>
        <div class="modal-buttons" style="grid-column-start: 1;">
            <button on:click={() => {
                $modalShown = false;
            }}>Close</button>
        </div>
	</div>
</Modal>

<style>
    .grid {
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 4px;
        margin-left: 0px;
    }
    #fix {
        margin-left: -2px;
    }
</style>