// import type { Game } from "$lib/models/Game";

import type { Player } from "$lib/models/Player";
import { phoneResponses } from "$lib/stores";


export type GameState = {
  id: string,
  state: any,
}

export type Game = {
  id: string,
  name: string,
  mainPoolName: string,
  phonePoolName: string,
  onMainResponse: (response: string) => void,
  onPhoneResponse: (player:Player, response: string) => void,
  actions: {label:string, action:()=>void}[],
  initialState:any,
}

const defaultGame = {
  onMainResponse:(response:string) =>{
    console.log("onMainResponse", response);
  },
  onPhoneResponse:(player:Player, response: string) =>{
    let responseObj = {
      id: player.name,
      player: player,
      response,
    }
    phoneResponses?.add?.(responseObj)
  },
  actions: [],
  initialState: {},
}


export const games = {
  vsAll: {
    ...defaultGame,
    id: "vsAll",
    name: "PONY PARTY",
    mainPoolName: "p_brise_glace",
    phonePoolName: "p_brise_glace",  
  },
  briseglace: {
    ...defaultGame,
    id: "briseglace",
    name: "Purity Test",
    mainPoolName: "brise_glace",
    phonePoolName: "p_brise_glace",
  },
  quisplash: {
    ...defaultGame,
    id: "quisplash",
    name: "Quisplash",
    mainPoolName: "quisplash",
    phonePoolName: "quisplash",
  },
  itmc: {
    ...defaultGame,
    id: "itmc",
    name: "ITMC",
    mainPoolName: "itmc",
    phonePoolName: "p_itmc",
  },
  end: {
    ...defaultGame,
    id: "end",
    name: "End",
    mainPoolName: "end",
    phonePoolName: "end",
  },
} satisfies Record<string, Game>



