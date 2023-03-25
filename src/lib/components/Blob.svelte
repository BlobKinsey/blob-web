<script lang="ts">
  import { firestore } from "$lib/firebase";
  import type { Player } from "$lib/models/Player";
  import { currentGame, phoneResponses } from "$lib/stores";
  import { docStore } from "@ponymakers/sveltefire";
  import { onMount } from "svelte";
	import { fly } from "svelte/transition"
	import { page } from '$app/stores';

  let words = [
    "BlobKinsey™",
    "arzearezarzaerzerzer",
    "Paul the Blob",
    "Boris",
  ]

  let id = $page.url.searchParams.get('id');
  const player = docStore<Player>(firestore, `players/${id}`);


  type Point = {
    x: number;
    y: number;
    isEnd?: boolean;
  }

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

  type Circle = {
    x: number;
    y: number;
    r: number;
  }

  let BASE_MOUILLETTES:Point[] = [
    {x: 0, y: 0, isEnd: true},
    {x: 100, y: 0, isEnd: true},
    {x: 0, y: 100, isEnd: true},
    {x: 100, y: 100, isEnd: true},
  ];

  $: mouillettes = [
    ...BASE_MOUILLETTES,
    ...$phoneResponses.map(r => (r.response)),
  ]
  
  

  let anim:Circle[] = []

  let svg:SVGSVGElement;

  function onSvgClick(e){
    console.log(e);

    // to svg coordinates
    let pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    let svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    console.log(svgPt);

    // check if inside 0,0 100,100
    if(svgPt.x > 0 && svgPt.x < 100 && svgPt.y > 0 && svgPt.y < 100){
      console.log("inside");
      respond({x: svgPt.x, y: svgPt.y, isEnd: false})
      //mouillettes=[...mouillettes, {x: svgPt.x, y: svgPt.y}]
    }else{
      console.log("outside");
      playAnim();
    }



  }


  function getMouillettePath(mouillettes){
    let path = "M 0 0";
    mouillettes.forEach(mouillette => {
      path += ` L ${mouillette.x} ${mouillette.y}`;
    });
    return path;
  }

  function getNearestMouillette(x, y, mouillettes:Point[]){
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


  function toSvgPath(path:Point[]){
    if(!path || path.length <= 1) return "";
    let svgPath = "M " + path[0].x + " " + path[0].y;
    for(let i = 1; i < path.length; i++){
      let point = path[i];
      svgPath += ` L ${point.x} ${point.y}`;
    }
    return svgPath;
  }
  
  function playAnim(){
    anim = [];
    let path = [{x:50,y:50}, ...getNearestMouillettesPath(mouillettes)];
    for(let i = 0; i < path.length-1; i++){

      let point = path[i];
      if(point.isEnd) break;
      let nextPoint = path[i+1];
      let dist = Math.sqrt((point.x - nextPoint.x)**2 + (point.y - nextPoint.y)**2);
      anim = [...anim, {x: point.x, y: point.y, r: dist}];
    }

  }

  $:{
    mouillettes
    // playAnim();
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

  function onSvgKeydown(e){
    if(e.key == "Enter"){
      playAnim();
    }
  }


  
</script>



<svg 
  bind:this={svg}
  viewBox="-10 -10 120 120" 
  width="100%"
  height="70vh"
  xmlns="http://www.w3.org/2000/svg" 
  class="blob-maze" 
  on:click={onSvgClick}
  on:keydown={onSvgKeydown}
  
  >
  

  <!-- text on 4 corners -->
  <g class="fill-white">
    <text x="-8" y="-2" class="text" font-size="3" text-anchor="start">
      {words[0]}
    </text>
    <text x="108" y="-2" class="text" font-size="3" text-anchor="end">
      {words[1]}
    </text>
    <text x="-8" y="105" class="text" font-size="3" text-anchor="start">
      {words[2]}
    </text>
    <text x="108" y="105" class="text" font-size="3" text-anchor="end">
      {words[3]}
    </text>
  </g>

  <g>

    <rect class="fill-blue-600"
        x="0" y="0" width="100" height="100" />

  <circle class="fill-yellow-600"
    cx="50"
    cy="50"
    r="1" />

    {#each mouillettes as mouillette}
      <circle class="fill-yellow-600"
        cx="{mouillette.x}"
        cy="{mouillette.y}"
        r="1" />
    {/each}

    <path class="fill-none stroke-yellow-200 stroke-1 hidden"
      d="{toSvgPath([{x:50,y:50}, ...getNearestMouillettesPath(mouillettes)])}" />

    <g class="opacity-70">
      {#each anim as c, i (c)}
        <circle class="fill-yellow-600 " 
          in:fadeScale={{delay: i*1000, duration: 1000, baseScale: 0, origin: `${c.x} ${c.y}`}}
          style="transform-box: fill-box; transform-origin: center;"
          cx="{c.x}"
          cy="{c.y}"
          r="{c.r}" />
      {/each}
    </g>
  </g>
</svg>