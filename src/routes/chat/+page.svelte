<script>
	import Chat from '$lib/components/chat/Chat.svelte';
	import { createOptions } from '$lib/components/chat/api/api';
	import { startNewSession, loadPreviousSession } from '$lib/components/chat/plugins/session';
	import { onMount } from 'svelte';

	let opts = null;
	let chatLoading = true;
    let assistantName = 'TokenomicsAI';
    const greeting = `Greetings! I am here to assist you with all aspects of tokenomics. From analyzing token distribution to optimizing market strategies, I’m ready to help you achieve your crypto project’s goals.<br/>How can I assist you today?`;

	onMount(async () => {
		let sess = (await loadPreviousSession()) || (await startNewSession());
		opts = {
			WEBHOOK_URL: 'https://cobacoba.tech/webhook/61719009-d0a2-4713-b34c-7b9a9f286a30/chat',
            HISTORY_URL: 'https://cobacoba.tech/webhook/d943b2ce-736c-4770-b908-ea6956ef679d',
			SESSION_ID: sess
		};
		chatLoading = false;
	});
</script>

<Chat options={opts} loadingChat={chatLoading} {assistantName} {greeting}/>
