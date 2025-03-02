<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Avatar } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Send } from 'lucide-svelte';
	import ChatMessage from './ChatMessage.svelte';
	import { browser } from '$app/environment';
	import { configStore } from './api/config-store';
	import { loadPreviousChat, sendMessage } from './api/api';

	export let loadingChat = true;
	export let componentLoading = true;
	export let loading = false;
	export let greeting = 'Hello! How can I help you today?';
	
	export let options = {
		WEBHOOK_URL: 'https://cobacoba.tech/webhook/61719009-d0a2-4713-b34c-7b9a9f286a30/chat',
		SESSION_ID: ''
	};
	export let assistantName = 'Assistant';

	// Store for messages
	export let messages = [
		{
			id: 1,
			role: 'assistant',
			content: greeting,
			timestamp: new Date()
		}
	];

	let newMessage = '';
	let previousMessageCount = 0;

	const initChat = async () => {
		try {
			let previousChat = await loadPreviousChat(options.SESSION_ID);
			if (previousChat) {
				let temp_msg = [];
				let index = messages.length+1;
				previousChat.messages.forEach((data, i) => {
					if (data?.human) {
						temp_msg.push({
							id: index,
							role: 'user',
							content: data.human,
							timestamp: new Date()
						});
						index++;
					}
					if (data?.ai) {
						temp_msg.push({
							id: index,
							role: 'assistant',
							content: data.ai,
							timestamp: new Date()
						});
						index++;
					}
				});
				messages = [...messages, ...temp_msg];
			}
			console.log(previousChat);
		} catch (e) {
			console.error(e);
		}
	};

	// Function to send a message
	async function sendMsg() {
		if (!newMessage.trim()) return;

		// Add user message
		const userMessage = {
			id: messages.length + 1,
			role: 'user',
			content: newMessage,
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		const userInput = newMessage;
		newMessage = '';

		// Set loading state
		loading = true;

		// Simulate API call delay
		try {
			let res = await sendMessage(options.SESSION_ID, userInput);
			res.output;
			const assistantMessage = {
				id: messages.length + 1,
				role: 'assistant',
				content: res.output,
				timestamp: new Date()
			};
			messages = [...messages, assistantMessage];
			loading = false;
		} catch (e) {
			console.error(e);
		}
	}

	// Auto-scroll to bottom only when message count changes
	$: if (browser && messages && messages.length !== previousMessageCount) {
		previousMessageCount = messages.length;
		setTimeout(() => {
			let chatContainer = window?.document.getElementById('chatContainer');
			let cc = chatContainer.querySelector('[data-melt-scroll-area-viewport]');
			cc.scrollTop = cc.scrollHeight;
		}, 100);
	}

	// init chat and load previous chat
	$: if (!loadingChat) {
		configStore.updateConfig(options);
		initChat();
		componentLoading = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMsg();
		}
	}
</script>

<div class="flex h-[calc(100vh-1rem)] w-full flex-col">
	<div class="border-b p-4">
		<h1 class="text-xl font-bold">Chat</h1>
	</div>

	<ScrollArea class="flex-1 p-4" id="chatContainer">
		<div class="space-y-4">
			{#if loadingChat ||componentLoading}
				<!-- Skeleton loading state for chat messages -->
				<div class="space-y-4">
					<!-- AI message skeleton -->
					<div class="flex items-start gap-3">
						<Skeleton class="h-8 w-8 rounded-full" />
						<div class="space-y-2">
							<Skeleton class="h-4 w-20" />
							<Skeleton class="h-16 w-[250px]" />
						</div>
					</div>

					<!-- User message skeleton -->
					<div class="flex flex-row-reverse items-start gap-3">
						<Skeleton class="h-8 w-8 rounded-full" />
						<div class="flex flex-col items-end space-y-2">
							<Skeleton class="h-4 w-20" />
							<Skeleton class="h-12 w-[200px]" />
						</div>
					</div>

					<!-- AI message skeleton -->
					<div class="flex items-start gap-3">
						<Skeleton class="h-8 w-8 rounded-full" />
						<div class="space-y-2">
							<Skeleton class="h-4 w-20" />
							<Skeleton class="h-20 w-[300px]" />
						</div>
					</div>
				</div>
			{:else}
				{#each messages as message, i (message.id)}
					<div in:fly={{ y: 20, duration: 300, delay: 0 }}>
						<ChatMessage {message} {assistantName} />
					</div>
				{/each}

				{#if loading}
					<div in:fly={{ y: 20, duration: 300 }}>
						<div class="flex items-start gap-3 pl-4">
							<!-- <Avatar class="h-8 w-8 bg-primary/10">
								<span class="text-xs font-medium">AI</span>
							</Avatar> -->
							<div class="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</ScrollArea>

	<div class="border-t p-4">
		<form on:submit|preventDefault={sendMsg} class="flex space-x-2">
			<Input
				class="flex-1"
				placeholder="Type your message..."
				bind:value={newMessage}
				on:keydown={handleKeydown}
				disabled={loadingChat}
			/>
			<Button type="submit" disabled={!newMessage.trim() || loading || loadingChat}>
				<Send class="mr-2 h-4 w-4" />
				Send
			</Button>
		</form>
	</div>
</div>

<style>
	.typing-indicator {
		display: flex;
		align-items: center;
	}

	.typing-indicator span {
		height: 8px;
		width: 8px;
		margin: 0 2px;
		background-color: #888;
		border-radius: 50%;
		display: inline-block;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}
</style>
