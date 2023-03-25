<script lang="ts">
	import { speResponses, type SpeResponse } from "$lib/stores";
	import { text } from "svelte/internal";
  export let id: string;

  $: playerResponse = $speResponses.filter(r => r.playerId === id);

  function saveResponse(response:SpeResponses){
    speResponses.add?.(response);
  }

</script>


<div class="card flex w-full p-2">

  {#each playerResponse as response}

    <div class="flex flex-col w-full">
      <div>{response.question.statement}</div>
      

      <input type="text" value="{response.response}" on:change={(e) => saveResponse({...response, response: e.target.value})}
      />
    </div>

  {/each}



</div>