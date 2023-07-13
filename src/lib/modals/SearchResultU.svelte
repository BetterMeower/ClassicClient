<script>
    import Container from "../Container.svelte";
    import Loading from "../Loading.svelte";
    import ProfileView from "../Profile_View.svelte";
    import {apiUrl, encodeApiURLParams} from "../urls.js";
    import Modal from "../Modal.svelte";

	import {modalShown} from "../stores.js";

    import {search_q} from "../stores.js";

    let pageLoading = false

    let results = []

    let numPages = 0
    let pagesLoaded = 0
    let resOffset = 0

    async function loadUserResults(page, query) {
        pageLoading = true;
        if (page === undefined) {
            results = [];
        } else {
            // 25 posts per page...
            let realPage = page + Math.floor(resOffset / 25);
            let realOffset = resOffset % 25;

            try {
                let path = `search/users?autoget&page=`;
                let q = `&q=`
                if (encodeApiURLParams) path = encodeURIComponent(path);
                if (encodeApiURLParams) query = encodeURIComponent(query);
                const resp = await fetch(
                    `${apiUrl}${path}${realPage}${q}${query}`
                );
                if (!resp.ok) {
                    throw new Error("Response code is not OK; code is " + resp.status);
                }
                const json = await resp.json();

                let realPosts = json.autoget;
                realPosts.splice(0, realOffset);

                numPages = json.pages;

                let overflowResp, overflowJson;
                if (realOffset > 0 && pagesLoaded < numPages) {
                    overflowResp = await fetch(
                        `${apiUrl}${path}${realPage+1}`
                    );
                    if (!resp.ok) {
                        throw new Error("Overflow response code is not OK; code is " + resp.status);
                    }
                    overflowJson = await overflowResp.json();

                    realPosts = realPosts.concat(
                        overflowJson.autoget.slice(
                            0, realOffset
                        )
                    );
                }

                for (const res of realPosts) {
                    results.push(res);
                }
                pagesLoaded = page;
            } catch(e) {
                pageLoading = false;
                throw e;
            }
        }
        results = results;
        pageLoading = false;
        return results;
    }
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Search Results for {$search_q}</h2>
    <div slot="default">
        {#await loadUserResults(1,$search_q)}
            <div class="fullcenter">
                <Loading />
            </div>
        {:then}
            {#if results.length < 1}
                No results!
            {:else}
                {#each results as res}
                    <ProfileView username={res._id} JoinGC={true}/>
                {/each}
            {/if}
            <div class="center">
                {#if pageLoading}
                    <Loading />
                {:else}
                    {#if numPages && numPages > pagesLoaded}
                        <button 
                            class="load-more"
                            on:click={() => loadUserResults(pagesLoaded + 1,$search_q)}
                        >
                            Load More
                        </button>
                    {/if}
                {/if}
            </div>
        {:catch error}
            <Container>
                <h1>Search Users</h1>
                Error loading users. Please try again.
                <pre><code>{error}</code></pre>
            </Container>
        {/await}
    </div>
</Modal>

<style></style>