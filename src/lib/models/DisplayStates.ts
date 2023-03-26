import type { Player } from "./Player";
import type { Point, Proposal, Question } from "./Question";
import type { Timer } from "./Timer";

export const displaysStates = [
  "lobby",
  "game-context",
  "game-rounds",
  "game-response",
  "scores"
] as const

export const roundStates = [
  "idle",
  "tutorial",
  "shoot",
  "responses",
  "grow",
  "validate",
] as const

export type Circle = {
  x: number;
  y: number;
  r: number;
}

type Mode = typeof displaysStates[number]
type RoundMode = typeof roundStates[number]

export type MainDisplayState ={
  mode: Mode,
  roundMode: RoundMode,
  currentQuestion?: Question,
  currentRound: number,
  currentResponse?: string,
  mouillettes: Point[],
  blobPath: Circle[],
  currentRoundResponse?: string,
  timer?:Timer
} 