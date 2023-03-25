import { firestore } from '$lib/firebase';
import { collectionStore, docStore } from '@ponymakers/sveltefire';
import { collection } from 'firebase/firestore';
import { derived, type Readable } from 'svelte/store';
import { games, type Game, type GameState } from './games/games';
import type { MainDisplayState, PhoneDisplayState } from './models/DisplayStates';

import type { Player } from './models/Player';
import type { PhoneResponse, Question, QuestionPool } from './models/Question';
import type { Timer } from './models/Timer';

export const mainState = docStore<MainDisplayState>(firestore, `displays/_main`);
export const mainQuestion = docStore<Question>(firestore, `displays/_main_question`);

export const phoneState = docStore<PhoneDisplayState>(firestore, `displays/_phone`);
export const phoneQuestion = docStore<Question>(firestore, `displays/_phone_question`);
export const phoneResponses = collectionStore<PhoneResponse>(firestore, `phone_responses`);

export const players = collectionStore<Player>(firestore, `players`);
export const mainPlayer = docStore<Player>(firestore, `displays/_main_player`);

export const mainTimer = docStore<Timer>(firestore, `displays/_main_timer`);
export const phoneTimer = docStore<Timer>(firestore, `displays/_phone_timer`);

export const controlState = docStore<any>(firestore, `displays/_control`);

export const currentGameState = docStore<GameState>(firestore, `games/_current`);
export const currentGame = derived<Readable<GameState>, Game>( currentGameState, 
  ($currentGameState) => {
    let id = $currentGameState?.id
    if (id) {
      return games[id];
    }
    return null;
  })

export const questionPools = collectionStore<QuestionPool>(firestore, `questions`);

export type SpeResponse = {
  id: string,
  response: string,
  playerId: string,
  question:Question,
}
export const speResponses = collectionStore<SpeResponse>(firestore, `xxx`);