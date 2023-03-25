import type { Player } from "./Player";
import type { Proposal, Question } from "./Question";

export const displaysStates = [
  "idle",
  "title",
  "quizz",
  "scores",
  "pre-game"
] as const
type mode = typeof displaysStates[number]

export type MainDisplayState ={
  mode: mode,
  showQuestion: boolean,
  showAnswer: boolean,
  showProposals: boolean,
  showTimer: boolean,
  canAnswer: boolean,
  currentPlayer?: Player,
  currentQuestion?: Question,
  selectedProposal?: Proposal,


} 


export type PhoneDisplayState ={
  mode: mode,
  showQuestion: boolean,
  showAnswer: boolean,
  showProposals: boolean,
  showTimer: boolean,
  canAnswer: boolean,
  currentQuestion?: Question,
} 

