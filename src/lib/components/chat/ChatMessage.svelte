<script>
  import { Avatar } from "$lib/components/ui/avatar";
  import { cn } from "$lib/utils";
  import {parseMarkdown} from "$lib/utils/markdown";

  export let assistantName = "Assistant";
  export let message;
  
  // Format timestamp
  function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

</script>

<div class={cn(
  "flex gap-3 p-4 rounded-lg",
  message.role === 'assistant' ? "bg-muted/50" : ""
)}>
  <!-- <Avatar class="h-8 w-8 shrink-0">
    {#if message.role === 'assistant'}
      <span class="text-xs font-medium">AI</span>
    {:else}
      <span class="text-xs font-medium">You</span>
    {/if}
  </Avatar> -->
  
  <div class="flex-1 space-y-2">
    <div class="flex items-center">
      <p class="font-semibold">
        {message.role === 'assistant' ? assistantName : 'You'}
      </p>
      <span class="ml-auto text-xs text-muted-foreground">
        {formatTime(message.timestamp)}
      </span>
    </div>
    <div class="prose dark:prose-invert !max-w-[100vw]">
      {@html parseMarkdown(message.content)}
    </div>
  </div>
</div>
