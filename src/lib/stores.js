/**
 * @file Stores, not to be confused with shops or those other stores.
 * Also basically the global variable storage for the garbage codebase
 */

import {writable} from "svelte/store";

export const screen = writable("setup");
export const mainPage = writable("home");
export const setupPage = writable("logo");

// Used for modal overlay
export const modalShown = writable(false);
export const modalPage = writable("");

// Used for the dialog modal
export const DialogTitle = writable("Dialog");
export const DialogText = writable("Text");
export const NewsDialogLink = writable("Text");
export const NewsDialoglsvarname = writable("Text");

// Used for the disconnected screen
export const disconnected = writable(false);
export const disconnectReason = writable("");

// Last typed
export const lastTyped = writable(0);

// Current chat ID
export const chatName = writable("");
export const chatid = writable("");
export const chatMembers = writable([]);
export const chatOwner = writable("");

// User list
export const ulist = writable([]);

// Mod panel Stores
export const User_ToMod = writable("");

// Last post clicked
export const postClicked = writable({});

export const announcementToSend = writable("");
export const modPanelOpen = writable(false);
export const userToMod = writable("");

// Last profile clicked
export const profileClicked = writable("");

//Unused for now.
export const Webhooks_pfp = writable("");

// Image adding stuff
export const postInput = writable();

// Searching
export const search_q = writable("");
export const search_mode = writable("");

if (localStorage.getItem("SkipDisconnect") == null) {
	localStorage.setItem("SkipDisconnect", "false")
}

// Last group chat profile clicked
export const profileClicked_GC = writable("");

// Current auth header
export const auth_header = writable({});

// The current user profile
export const user = writable({
	name: null,
	lvl: 0,
	unread_inbox: false,
	theme: "orange",
	mode: true,
	sfx: true,
	bgm: true,
	bgm_song: 2,
	layout: "new",
	pfp_data: 1,
	quote: "",
});

export const spinner = writable(false);

export const windowStyle = writable({});

export const groupcats = writable(200)

// Session settings

if (localStorage.getItem("UncensorPosts") == null) {
	localStorage.setItem("UncensorPosts", "false")
}

export const uncensoredposts = writable(true)

uncensoredposts.set(localStorage.getItem("UncensorPosts") == "true")

// Dev settings

export const sidebarbypasses = writable(false)

// Check if running in dev mode
export const DevMode = import.meta.env.DEV