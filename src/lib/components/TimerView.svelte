<script lang="ts">
	import type { mainTimer } from "$lib/stores";

  export let timer: typeof mainTimer;


  let now = Date.now();
  setInterval(() => {
    now = Date.now();
  }, 30);

  $: end = $timer ? $timer.startAt + $timer.duration : 0;
  $: timeLeft = end ? end - now : 0;
  
</script>

{#if $timer }
<div class="flex flex-col w-full pr-10 pl-5 transition-opacity"
  class:opacity-100={$timer.show}
  class:opacity-0={!$timer.show}
  >
  <div class="flex flex-row "></div>
    <div class="items-center relative">
      <div class="flex flex-col items-center">
        <div class="flex items-center">
          <span class="text-4xl text-center mx-12">
            {#if $timer && timeLeft > 0}
              {Math.floor(timeLeft / 1000)}
            {:else}
              0
            {/if}
          </span>
        </div>
      </div>
    </div>

  <!-- TimeBar -->

  <div class="card w-full h-10 " style="padding: 0;">
    <div class="bg-white h-full rounded-md" style="width: {(timeLeft / $timer.duration * 100) || 0}%"></div>

  </div>
</div>
{/if}


