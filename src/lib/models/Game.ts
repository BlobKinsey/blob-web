import type { Player } from "./Player"
import type { Question } from "./Question"


export type RoundState = {
  currentStep: number,
  currentQuestion: number,
  currentPlayers: Player[], 
}