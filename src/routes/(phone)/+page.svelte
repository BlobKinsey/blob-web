<script lang="ts">
  import { firestore } from '$lib/firebase';
  import { setDoc, doc } from "firebase/firestore";
	import type { Player } from '$lib/models/Player';
  import { collectionStore } from '@ponymakers/sveltefire';
	import { players } from '$lib/stores';
	import { goto } from '$app/navigation';

  function createPlayer() {
    if(!name) return;

    let id = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if($players.find(p => p.id === id)) return;
    
    players.add({id, name, score: 0 });
    goto('/play?id='+id)
  }

  function deletePlayer(player: Player) {
    $players = players.delete(player);
  }

  let name = '';

</script>


<div class="card bg-red-500 flex items-center">
  <header>
    BlobKinsey™
  </header>


  Slt té ki? ^^


  <div class="flex flex-col ">
    {#each $players as player}
    <a class="flex items-center" href={`/play?id=${player.id}`}>
      <span class="">{player.name}</span>
    </a>
    {:else}
    {/each}
  <div class="card bg-lime-400 sflex items-center flex-col">
    <span class="ml-2">"slt moi cé"</span>
    <input 
      class=" bg-white text-black card" 
      type="text" 
      placeholder="John" 
      bind:value={name}
      />
    <button on:click={()=>createPlayer()}>CREER</button>
  </div>
   
  </div>

  
  
</div>

