import type { Question } from "./Question"

export type Player = {
  id: string,
  name: string,
  score: number,
  phoneQuestion?: Question;
}
