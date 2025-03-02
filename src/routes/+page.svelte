<script>
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Welcome to the Svelte demo app!</h1>
	<p>This is a simple chat application built with Svelte.</p>
	<p>Click on the chat icon in the bottom right corner to start chatting!</p>
	<a href="/chat">Go to chat</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
