<script lang="ts">
  import { firestore } from "$lib/firebase";
  import type { Player } from "$lib/models/Player";
  import { currentGame, mainState, phoneResponses } from "$lib/stores";
  import { docStore } from "@ponymakers/sveltefire";
  import { onMount } from "svelte";
	import { fly } from "svelte/transition"
	import { page } from '$app/stores';
  import type { Point } from "$lib/models/Question";
  import BlobBg from "./BlobBG.svelte";
  import Mouillette from "./Mouillette.svelte";
  import BlobCentral from "./BlobCentral.svelte";
  import BlobGrow from "./BlobGrow.svelte";

  $: question = $mainState?.currentQuestion;
  $: words = question?.rounds[$mainState?.currentRound || 0] || [];
  $: playerResponse = $phoneResponses.find(response => response.id === $player?.name);

  let id = $page.url.searchParams.get('id');
  const player = docStore<Player>(firestore, `players/${id}`);


  $: roundMode = $mainState?.roundMode;
  $: anim = ($mainState?.blobPath || [] ) as Circle[]
   

  currentGame
  function respond(point:Point) {
    if($player && phoneResponses){
      let responseObj = {
        id: $player.name,
        player: $player,
        response:point
      }
      phoneResponses?.add?.(responseObj)
    }
  }



  $: mouillettes = [
    ...($mainState?.mouillettes || []),
    ...($phoneResponses?.filter(response => response.id === $player?.name)
          .map(response => response.response) || []),
  ]

  


  let svg:SVGSVGElement;

  function onSvgClick(e){
    console.log(e);

    // to svg coordinates
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    let svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    console.log(svgPt);

    // check if distance from center is less than radius
    if( Math.sqrt(Math.pow(svgPt.x - 50, 2) + Math.pow(svgPt.y - 50, 2)) < 75){
      respond({x: svgPt.x, y: svgPt.y, isEnd: false})
      console.log("inside");
      //mouillettes=[...mouillettes, {x: svgPt.x, y: svgPt.y}]
    }else{
      console.log("outside");
    }



  }


  // function getMouillettePath(mouillettes){
  //   let path = "M 0 0";
  //   mouillettes.forEach(mouillette => {
  //     path += ` L ${mouillette.x} ${mouillette.y}`;
  //   });
  //   return path;
  // }


  function toSvgPath(path:Point[]){
    if(!path || path.length <= 1) return "";
    let svgPath = "M " + path[0].x + " " + path[0].y;
    for(let i = 1; i < path.length; i++){
      let point = path[i];
      svgPath += ` L ${point.x} ${point.y}`;
    }
    return svgPath;
  }


  function fadeScale (
    node, { delay = 0, duration = 200, easing = x => x, baseScale = 0, origin = '50% 50%' }
  ) {
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = m ? m[1] : 1;
    const is = 1 - baseScale;

    return {
      delay,
      duration,
      css: t => {
        const eased = easing(t);
        return `transform: scale(${(eased * s * is) + baseScale});  `;
      }
    };
  }


  
</script>


<div> Q: {question?.question} </div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg 
  bind:this={svg}
  viewBox="-30 -30 160 160" 
  width="100%"
  height="70vh"
  xmlns="http://www.w3.org/2000/svg" 
  class="blob-maze" 
  on:click={onSvgClick}  
  >

  <BlobBg/>
  

  <!-- <circle class="fill-blue-600 opacity-25"
      cx="50"
      cy="50"
      r={150/2} /> -->
  <!-- text on 4 corners -->

  <g>


  <circle class="fill-yellow-600 opacity-30"
    cx="50"
    cy="50"
    r="4" />

    {#each mouillettes as mouillette}
      <Mouillette class="fill-yellow-600"
        {mouillette}/>
    {/each}

    <BlobCentral/>
    <!-- <BlobGrow/> -->

    <g class="opacity-70">
      {#each anim as c, i (i)}

        <g class="fill-yellow-600 " 
          in:fadeScale={{delay: i*1000, duration: 1000, baseScale: 0, origin: `${c.x} ${c.y}`, easing: x => Math.sqrt(x)}}
          out:fadeScale={{delay: i*100, duration: 100, baseScale: 0, origin: `${c.x} ${c.y}`}}
          style="transform-box: fill-box; transform-origin: center;"
          cx="{c.x}"
          cy="{c.y}"
          delay={i*1000}
          r="{c.r}" >
          <BlobGrow {...c}/>
        </g>
      {/each}
    </g>
  </g>

  <g class="fill-black">
    <foreignObject x="-22" y="-25" width="40" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="text-[4px] text-black font-bold flex items-center justify-center h-full text-center " >
        <div>{words[0] || ""}</div>
      </div>
    </foreignObject>

    <foreignObject x="85" y="-25" width="40" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="text-[4px] text-black font-bold flex items-center justify-center h-full text-center " >
        <div>{words[1] || ""}</div>
      </div>
    </foreignObject>

    <foreignObject x="85" y="85" width="40" height="40">
      <div xmlns="http://www.w3.org/1999/xhtml" class="text-[4px] text-black font-bold flex items-center justify-center h-full text-center " >
        <div>{words[2] || ""}</div>
      </div>
    </foreignObject>

    <foreignObject x="-22" y="85" width="40" height="40" >
      <div xmlns="http://www.w3.org/1999/xhtml" class="text-[4px] text-black font-bold flex items-center justify-center h-full text-center  " >
        <div>{words[3] || ""}</div>
      </div>
    </foreignObject>
  </g>
</svg>

<div> R: {$mainState?.currentResponse} </div>