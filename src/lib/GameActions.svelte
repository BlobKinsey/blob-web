<script lang="ts">
	import type { games } from "./games/games";
	import type { Player } from "./models/Player";
	import { currentGame, mainQuestion, mainState, mainTimer, controlState, questionPools, phoneState, phoneQuestion, phoneResponses, mainPlayer, players, speResponses } from "./stores";

  type action = {
    label: string,
    action: ()=>void
  }

  function countPhoneResponses(forResponse: string){
    return $phoneResponses.filter((response) => response.response == forResponse).length;
  }
  
  function clearPhoneResponses(){
    for(const response of $phoneResponses){
      phoneResponses.delete?.(response);
    }
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

  function nextMainQuestion(){
    if($mainQuestion){
      const index = $mainQuestion?.index

      if(mainPool && index < mainPool.questions.length - 1){

        $mainQuestion = mainPool.questions[index + 1];
      }
    }
  }
  function reset(){
    $mainState!.showQuestion = false;
    $mainState!.showProposals = false;
    $mainState!.showAnswer = false;
    $phoneState!.showQuestion = false;
    $phoneState!.showProposals = false;
    $phoneState!.canAnswer = false;
    $phoneState!.showAnswer = false;
    clearPhoneResponses();
    if(mainTimer && $mainTimer){
      $mainTimer!.show = false;
    }
  }


  function addPoints(playerId:string, score: number){
    for(const player of $players){
      if(player.id == playerId){
        player.score += score;
        players.add?.(player);
      }
    }
  }

  function isPhonePlayerCorrect(player:Player){
    const response = $phoneResponses.find((response) => response.player.id == player.id);
    if(response){
      return response.response == $phoneQuestion?.goodAnswer;
    }
    return false;
  }
  
  function isMainPlayerCorrect(){
    return $mainQuestion?.response == $mainQuestion?.goodAnswer;
  }
  
  $: mainPool = $questionPools.find(p => p.id == $controlState.mainPoolName)
  $: phonePool = $questionPools.find(p => p.id == $controlState.phonePoolName)


  type gameId = keyof typeof games
  const gamesActions: Record<gameId, action[]> = {
    briseglace: [
      {
        label: "RESET", action: ()=>{reset()}
      },
    {label: "Enoncé", action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = false;
      $mainState!.showAnswer = false;
      $phoneState!.showQuestion = false;

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},
    {label: "Pool", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = true;
      $phoneState!.canAnswer = true;
      $phoneQuestion = phonePool?.questions[0]!;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: true}
        }, 1000)
      }
    }},
    {label: "Stop pool", action: ()=>{

      $phoneState!.showQuestion = false;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: false}
        }, 1000)
      }
    }},
    
    {label: "Estimate", action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = false;
      $mainQuestion!.response = "";
      $phoneState!.showQuestion = false;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;
      $mainQuestion!.goodAnswer = "proposal." + (countPhoneResponses("proposal.1") +1 ).toString(); 

      clearPhoneResponses();
      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},


    {label: "+ ou -", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = true;
      $phoneState!.canAnswer = true;
      $phoneQuestion = phonePool?.questions[1]!;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: true}
        }, 1000)
      }
    }},
    {label: "Stop + ou -", action: ()=>{

      $phoneState!.showQuestion = false;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: false}
        }, 1000)
      }
    }},
    
    {label: "Réponse",  action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = true;
      $phoneState!.showAnswer = true;
      let estimation =parseInt($mainQuestion?.response?.split(".")[1] || "0");
      let goodAnswer =parseInt($mainQuestion?.goodAnswer?.split(".")[1] || "0");
      let diff = estimation - goodAnswer;

      if(diff < 0){
        $phoneQuestion!.goodAnswer = "proposal.1";
      }else if(diff > 0){
        $phoneQuestion!.goodAnswer = "proposal.2";
      }
      else{
        $phoneQuestion!.goodAnswer = "";
      }
      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},


    {label: "Scores",  action: ()=>{
      let estimation =parseInt($mainQuestion?.response?.split(".")[1] || "0");
      let goodAnswer =parseInt($mainQuestion?.goodAnswer?.split(".")[1] || "0");
      let diff = estimation - goodAnswer;
      let diffAbs = Math.abs(diff);
      let pts = 0;
      if(diffAbs == 0) pts = 10;
      else if(diffAbs == 1) pts = 5;
      else if(diffAbs == 2) pts = 2;
      else if(diffAbs == 3) pts = 1;
      else pts = 0;

      addCorrectPhonePoints(1);
      addMainPoints(pts);

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},
    {label: "Next", action: ()=>{
      reset();
      nextMainQuestion();
      $mainPlayer = null;
    }},
    ],









    
    vsAll: [
      {label: "RESET", action: ()=>{reset()}},
        
      {label: "Enoncé", action: ()=>{
        $mainState!.showQuestion = true;
        $mainState!.showProposals = false;
        $mainState!.showAnswer = false;
        $phoneQuestion! = $mainQuestion!;
        $phoneState!.showQuestion = true;
        $phoneState!.showProposals = false;
        $phoneState!.showAnswer = false;

      }},
      {label: "Start", action: ()=>{
        clearPhoneResponses();
        $mainState!.showQuestion = true;
        $mainState!.showProposals = true;
        $mainState!.showAnswer = false;
        $mainQuestion!.response = "";
        $phoneState!.showQuestion = true;
        $phoneState!.showProposals = true;
        $phoneState!.showAnswer = false;
        $phoneState!.canAnswer = true;

      }},
      {label: "Stop", action: ()=>{
        $mainState!.showQuestion = true;
        $mainState!.showProposals = true;
        $mainState!.showAnswer = false;
        $phoneState!.showQuestion = true;
        $phoneState!.showProposals = false;
        $phoneState!.showAnswer = false;
        $phoneState!.canAnswer = false;

      }},
    {label: "Réponse",  action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = true;
      $phoneState!.showAnswer = true;
    }},


    {label: "Scores",  action: ()=>{
      let pts = 0;
      if(isMainPlayerCorrect()){
        pts = 10;
      }
      let correctPhonesResponses = countPhoneResponses($mainQuestion!.goodAnswer!);
      addCorrectPhonePoints(1);
      addMainPoints(pts - correctPhonesResponses);

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},

      {label: "Next", action: ()=>{
        reset();
        nextMainQuestion();
      }},
    ],
    itmc: [
      {
        label: "RESET", action: ()=>{reset()}
      },
    {label: "Theme", action: ()=>{
      $mainQuestion!.statement = "Iels te mettent combien en : " + $mainQuestion!.statement;
      $mainState!.showQuestion = true;
      $mainState!.showProposals = false;
      $mainState!.showAnswer = false;
      $phoneState!.showQuestion = false;

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},
    {label: "Pool", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = true;
      $phoneState!.canAnswer = true;
      $phoneQuestion = phonePool?.questions[0]!;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: true}
        }, 1000)
      }
    }},
    
    {label: "Estimate", action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = false;
      $mainQuestion!.statement = "Iels te mettent :"
      $phoneState!.showQuestion = false;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;
      let count = countPhoneResponses("proposal.1"); 
      $mainQuestion!.proposals = [ {
        text: count.toString(),  
        id:"answer",
      } ];

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},
    
    {label: "✅",  action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = true;
      $phoneState!.showAnswer = true;
      $mainQuestion!.goodAnswer = "answer";
      $phoneQuestion!.goodAnswer = "proposal.1";
      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},

    {label: "❌",  action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = true;
      $mainState!.showAnswer = true;
      $phoneState!.showAnswer = true;
      $mainQuestion!.goodAnswer = "xxxx";
      $phoneQuestion!.goodAnswer = "proposal.2";
      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},

    {label: "Scores",  action: ()=>{

      if($mainQuestion!.goodAnswer == "answer"){
        addMainPoints(10);
      }
      addCorrectPhonePoints(1);
    }},
    {label: "Next", action: ()=>{
      reset();
      nextMainQuestion();
      $mainPlayer = null;
    }},
    ],



    quisplash: [
      {
        label: "RESET", action: ()=>{reset()}
      },
    {label: "Question", action: ()=>{
      $mainState!.showQuestion = true;
      $mainState!.showProposals = false;
      $mainState!.showAnswer = false;
      $phoneState!.showQuestion = false;
      
      $mainQuestion!.proposals = $speResponses
        .filter((r) => r.question?.index == $mainQuestion?.index)
        .map((r) => {
          return {text: r.response, id: r.playerId, playerId: r.playerId};
        });


      $phoneQuestion = $mainQuestion;

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},

    {label: "Vote", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = true;
      $phoneState!.canAnswer = true;
      $phoneQuestion = $mainQuestion;

      if(mainTimer){
        setTimeout(()=>{
          $mainTimer = {startAt: Date.now(), duration: 10000, show: true}
        }, 1000)
      }
    }},
    

    {label: "Stop Vote", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;
      $phoneQuestion = $mainQuestion;

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
    }},


    {label: "Response", action: ()=>{

      $phoneState!.showQuestion = true;
      $phoneState!.showProposals = false;
      $phoneState!.canAnswer = false;
      $mainQuestion!.proposals = $mainQuestion!.proposals!.map((p) => {
        p.text = p.text + " (par " + p.playerId + ") : " + countPhoneResponses(p.id);
        return p;
      });

      if(mainTimer && $mainTimer){
        $mainTimer!.show = false;
      }
      }},


    
    {label: "Scores",  action: ()=>{
      for( const player of $players){
        let count = countPhoneResponses(player.id);
        if(count > 0){
          addPoints(player.id, count);
        }
      }

    }},
    {label: "Next", action: ()=>{
      reset();
      nextMainQuestion();
      $mainPlayer = null;
    }},
    ],

    end: [
      {label: "⏱⏸", action: ()=>{
        $mainPlayer = null;
      }},
      {label: "✅",  action: ()=>{
        // playsound
        nextMainQuestion();
        // $mainPlayer = null;

      }},
      {label: "❌", action: ()=>{
        // playsound
        nextMainQuestion();
      }},
    ],
  }
 
  $: actions = $currentGame ? gamesActions[$currentGame.id] : []
</script>

<div class=" flex flex-col items-stretch text-center space-y-2">
  
<h2>{$currentGame?.name}</h2>

{#each actions as step}
  <button class="btn btn-xl variant-filled-secondary" on:click={() => {step.action()}}>
    {step.label}
  </button>
{/each}
</div>

