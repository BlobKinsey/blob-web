<script lang="ts">
  import { page } from "$app/stores";
  import Blob from "$lib/components/Blob.svelte";
  import type { Circle } from "$lib/models/DisplayStates";
  import type { Point } from "$lib/models/Question";
  import { mainQuestion, mainState, phoneResponses, players, questionPools } from "$lib/stores";

  let id = $page.url.searchParams.get('id');
  let isAdmin = $page.url.searchParams.get('admin');

	
  function clearPhoneResponses(){
    for(const response of $phoneResponses){
      phoneResponses.delete?.(response);
    }
  }
	function initMainState(){
		$mainState = {
				mode: 'lobby',
				roundMode: 'idle',
				currentResponse: "",
				currentRound: -1,
				blobPath: [],
				mouillettes: BASE_MOUILLETTES,
			}
			clearPhoneResponses();
	}

  const BASE_MOUILLETTES:Point[] = [
    {x: 0, y: 0, isEnd: true, responseIndex: 0},
    {x: 100, y: 0, isEnd: true, responseIndex: 1},
    {x: 0, y: 100, isEnd: true, responseIndex: 2},
    {x: 100, y: 100, isEnd: true, responseIndex: 3},
  ];

	function startGame(){
		$mainState.mode = 'game-context';
		$mainState.currentQuestion = $questionPools[0].questions[0];
	}

	function nextQuestion(){
		$mainState.mode = 'game-context';
		$mainState.roundMode = 'shoot';
		let currentIndex = $mainState?.currentQuestion ? $mainState.currentQuestion?.index : -1;
		let nextIndex = currentIndex + 1;
		$mainState.currentRound = 0;
		$mainState.currentResponse = "";
		$mainState.mouillettes = BASE_MOUILLETTES;
		clearPhoneResponses()
		$mainState.currentQuestion = $questionPools[0].questions[nextIndex];
	}

	function modeContext(){
		$mainState.mode = 'game-context';

	}
	function startRound(){
		$mainState.mode = 'game-rounds';
		$mainState.roundMode = 'shoot';
		$mainState.blobPath = [];
	}

	function showResponse(){
		$mainState.mode = 'game-rounds';
		$mainState.roundMode = 'responses';
		$mainState.blobPath = [];
		$mainState.mouillettes = [...$mainState.mouillettes, 
			...$phoneResponses?.map(response => response.response) || []];
		
	}

	function growBlob(){
		$mainState.mode = 'game-rounds';
		$mainState.roundMode = 'grow';
		$mainState.blobPath = [];
		let path = getNearestMouillettesPath($mainState.mouillettes);
		let responseIndex = path[path.length-1].responseIndex || 0;
		let round = $mainState?.currentQuestion?.rounds[$mainState.currentRound]
		$mainState.currentRoundResponse = round?.[responseIndex]
		$mainState.blobPath = getCircles(path);
		console.log("blobPath", $mainState.blobPath);
	}

	function getCircles(basepath:Point[]){
		let circles:Circle[] = [];
    let path = [{x:50,y:50}, ...basepath];
    for(let i = 0; i < path.length-1; i++){
      let point = path[i];
      if(point.isEnd) break;
      let nextPoint = path[i+1];
      let dist = Math.sqrt((point.x - nextPoint.x)**2 + (point.y - nextPoint.y)**2);
      circles = [...circles, {x: point.x, y: point.y, r: dist}];
    }
		return circles;
  }


	function validateRound(){
		$mainState.mode = 'game-rounds';
		$mainState.roundMode = 'validate';
		$mainState.currentResponse += " " + $mainState?.currentRoundResponse;
	}

	function nextRound(){
		let currentIndex = $mainState ? $mainState.currentRound : -1;
		let nextIndex = currentIndex + 1;
		$mainState.currentRound = nextIndex;
		$mainState.roundMode = 'idle';
		$mainState.blobPath = [];
	}


	function playResponse(){
		$mainState.mode = 'game-response';
	}


	// $:{
	// 	if($mainState?.mode == 'game-rounds' && $mainState?.roundMode == 'idle'){
	// 		setTimeout(() => {
	// 			startRound();
	// 		}, 1000);
	// 	}
	// }

  function getNearestMouillette(x:number, y:number, mouillettes:Point[]){
    if(!mouillettes || mouillettes.length == 0) return null;
    let nearestMouillette = mouillettes[0];
    let nearestDistance = 1000000;
    mouillettes.forEach(mouillette => {
      let distance = Math.sqrt((mouillette.x - x)**2 + (mouillette.y - y)**2);
      if(distance < nearestDistance){
        nearestDistance = distance;
        nearestMouillette = mouillette;
      }
    });
    return nearestMouillette;
  }

  function getNearestMouillettesPath(mouillettes:Point[]){
    // jump to nearest mouillette
    let path:Point[] = []
    let x = 50;
    let y = 50;
    let leftMouillettes = mouillettes;
    let i = 0

    while(leftMouillettes.length > 0 ){
      let nearestMouillette = getNearestMouillette(x, y, leftMouillettes);
      if(!nearestMouillette) break;

      path = [...path, nearestMouillette];
      x = nearestMouillette.x;
      y = nearestMouillette.y;
      leftMouillettes = leftMouillettes.filter(mouillette => mouillette.x != nearestMouillette.x && mouillette.y != nearestMouillette.y);
      console.log(leftMouillettes, nearestMouillette)
      if(nearestMouillette.isEnd) break;
      
    }

    return path;


  }


</script>

{#if $mainState}
	<div class="container h-full mx-auto flex flex-col justify-center items-center">
		<h1>BlobKinsey™</h1>
		<p>
			Paul the Blob 
		</p>

		{#if isAdmin }
				
			<div class="absolute top-0 left-0 opacity-50">
				<div>q: {$mainState?.currentQuestion?.index}</div>
				<div>r: {$mainState?.currentRoundResponse}</div>
				<div>r: {$mainState?.currentResponse}</div>
				<div>$mainState: {$mainState?.mode}</div>
				<div>isAdmin {isAdmin}</div>
			</div>
		{/if}

		<div>
			{#if $mainState?.mode == 'game-context'}
				Regarde l'écran
			{:else if $mainState?.mode == 'game-rounds'}
				<Blob/>
			{:else if $mainState?.mode == 'game-response'}
				Regarde l'écran
			{:else} 
			<!-- lobby -->
						
				<div class="flex flex-col  text-center">
					{#each $players as player}
						<h2 class="">{player.name}</h2>
					{/each}

					<button on:click={() => $mainState.mode = 'game-context'}>Start</button>

				</div>
			{/if}

		</div>

	</div>

	
{/if}

{#if isAdmin}
	<div class="flex flex-col absolute top-0 right-0">
		<button class="btn" on:click={() => nextQuestion()}>Start</button>
		------
		<button class="btn" on:click={() => nextQuestion()}>Next</button>
		<button class="btn" on:click={() => modeContext()}>ModeContext</button>

		-------
		<button class="btn" on:click={() => startRound()}>Start Round</button>
		<button class="btn" on:click={() => showResponse()}>Show Response</button>
		<button class="btn" on:click={() => growBlob()}>Grow blob</button>
		<button class="btn" on:click={() => validateRound()}>Validate Round</button>
		<button class="btn" on:click={() => nextRound()}>Next Round</button>
		-------
		<button class="btn" on:click={() => playResponse()}>RESPONSE</button>
		------
		<button class="btn" on:click={() => initMainState()}>Reset</button>
	</div>
{/if}