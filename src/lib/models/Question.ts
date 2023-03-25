import type { Player } from "./Player";

export type Question {
  // id: string,
  poolId: string,
  statement: string,
  index: number,
  proposals: Proposal[],
  response?: string,
  goodAnswer?: string,
}

export type Proposal = {
  id: string,
  text: string,
  playerId?: string,
};

export type PhoneResponse = {
  response?: any,
  player: Player,
}

export type QuestionPool = {
  title: string,
  questions: Question[],
}