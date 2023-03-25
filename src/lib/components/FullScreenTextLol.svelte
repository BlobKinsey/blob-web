<script lang="ts">
import { fade, fly } from 'svelte/transition';

  export let text = "Pony";
  $: formattedText = `${text} - ${text} - ${text} - ${text} - ${text} - ${text} - ${text} - ${text} - ${text} - ${text}`

  let configs = [
    { left: 10, from_x: 10},
    { left: 15, from_x: 15},
    { left: 8, from_x: 8},
    { left: 13, from_x: 13},
    { left: 11, from_x: 11},
    { left: 14, from_x: 14},
  ]
</script>

<div class="select-none absolute inset-0 h-screen overflow-hidden m-0" >
  <div class="-z-40 uppercase text-white font-bold text-x width-full -rotate-12 origin-top-left scale-[14]">
    {#each configs as config,i  (text + i)}
      <div class="absolute flex width" 
        style="left: {-config.left*10}px; top: {i * 18}px;"
        transition:fly="{{
          x: config.from_x,
          duration: 100,
          delay: i * 100,
        }}"
      >
        {formattedText}
      </div>
    {/each}
  </div>
</div>