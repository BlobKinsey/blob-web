import { writable } from "svelte/store"
import type { Player } from "../models/Player"


function buildPlayersStore(){
  const { subscribe, set, update } = writable<Player[]>([])

  return {
    subscribe,
    add: (player: Player) => update(players => [...players, player]),
    remove: (player: Player) => update(players => players.filter(p => p.id !== player.id)),
    set
  }
}