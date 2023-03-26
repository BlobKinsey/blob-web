import type { Player } from "./Player";

export type Question = {
  question: string,
  interviewer: string,
  situation: string,
  index: number,
  rounds: Round[],
  positions: any[],
  currentResposes?: string,
}

export type Round = string[];


export type PhoneResponse = {
  response?: Point,
  player: Player,
}

export type QuestionPool = {
  title: string,
  questions: Question[],
}


export type Point = {
  x: number;
  y: number;
  isEnd?: boolean;
  responseIndex?: number;
}
