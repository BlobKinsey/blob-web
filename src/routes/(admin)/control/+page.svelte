<script lang="ts">
  import type { Player } from '$lib/models/Player';
	import { controlState, currentGame, currentGameState, mainPlayer, mainQuestion, mainState, mainTimer, phoneQuestion, phoneResponses, phoneState, phoneTimer, players, questionPools, speResponses, type SpeResponse } from '$lib/stores';
	import type { Round } from '$lib/models/Game';
	import { games, type Game } from '$lib/games/games';

  let name = '';
  function createPlayer() {
    if(!name) return;

    let id = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if($players.find(p => p.id === id)) return;
    
    players!.add?.({id, name, score: 0 });
  }


  function selectPlayer(player: Player){
    if($mainPlayer?.id == player.id){
      $mainPlayer = undefined;
      return;
    }
    $mainPlayer = player;
  }

  function deletePlayer(player: Player){
    players.delete!(player);
  }

  function isPhonePlayerCorrect(player:Player){
    const response = $phoneResponses.find((response) => response.player.id == player.id);
    if(response){
      return response.response == $phoneQuestion?.goodAnswer;
    }
    return false;
  }

  function addCorrectPhonePoints(score: number){
    for(const player of $players){
      if(isPhonePlayerCorrect(player)){
        player.score += score;
        players.add?.(player);
      }
    }
  }

  function addMainPoints(score: number){
    if($mainPlayer){
      for(const player of $players){
        if(player.id == $mainPlayer.id){
          player.score += score;
          players.add?.(player);
        }
      }
    }
  }

  function setGame(game: Game){
    $currentGameState = {
      id: game.id,
      state: game.initialState
    }
    $controlState.phonePoolName = game.phonePoolName;
    $controlState.mainPoolName = game.mainPoolName; 
    
  }

  function setMode(mode: string){
    $mainState.mode = mode;
  }

  const refreshPools = () => {
    fetch('/api/questions')
      .then(r => r.json())
      .then(doc => {
        
        for(const pool of $questionPools){
          questionPools.delete?.(pool);
        }
        
        questionPools.add?.(doc.poolsArray[0], "pool");
      })
  }

  const resetScores = () => {
    for(const player of $players){
      player.score = 0;
      players.add?.(player);
    }
  }


  let showAdmin = true;
  
</script>




{#if showAdmin}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="absolute inset-0 bg-black bg-opacity-25 z-50 flex flex-col items-center justify-center"
  on:click={() => showAdmin = false}>


  <div class="card container mx-auto min-h-[500px] max-h-[90vh] overflow-y-auto p-4"
    on:click|stopPropagation
  >
    <button class="btn variant-filled-primary" on:click={() => refreshPools()}>Refresh pools</button>

  <button class="btn variant-filled-primary" on:click={() => resetScores()}>
    Reset Scores
  </button>

  <button class="btn variant-filled-primary" on:click={() => initQuisplash()}>
    initQuisplash
  </button>
  <section class="card flex flex-row">
    <div class="flex flex-row  flex-wrap">
      {#each $players as player}
        <div 
          class="border rounded-3xl border-slate-600 flex flex-col p-4 items-center transition">
            <div class="text-2xl uppercase w-24">{player.name}</div>
            <button class="btn bg-red-800" on:click|stopPropagation={() => {
              deletePlayer(player);
            }}>
              DELETE
            </button>
        </div>
      {/each}
    </div>

  </section>
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
{/if}

<button class="btn btn-lg  variant-filled-primary absolute bottom-2 left-2 z-30" on:click={() => showAdmin = true}>Admin</button>
