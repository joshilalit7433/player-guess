import { Player } from "./player";

const TOTAL_QUESTIONS = 10;
const MAX_ADDITIONAL_CLUES = 1;

export type GameState = {
  currentPlayerId: string;
  questionNumber: number;
  score: number;
  attempts: number;
  cluesRevealed: number;
  usedPlayerIds: string[];
  isPlayerRevealed: boolean;
  isFinished: boolean;
};

export function startGame(playerId: string): GameState {
  return {
    currentPlayerId: playerId,
    questionNumber: 1,
    score: 0,
    attempts: 0,
    cluesRevealed: 0,
    usedPlayerIds: [playerId],
    isPlayerRevealed: false,
    isFinished: false,
  };
}

export function checkAnswer(player: Player, answer: string): boolean {
  return player.name.toLowerCase().trim() === answer.toLowerCase().trim();
}

export function calculateScore(cluesRevealed: number): number {
  const points = 5 - cluesRevealed;

  return Math.max(points, 1); // Ensure the score doesn't go below 1
}

export function getInitialAttributes(player: Player) {
  return [
    `Nationality: ${player.nationality}`,
    `Position: ${player.position}`,
    `League: ${player.league}`,
  ];
}

export function getAdditionalClues(player: Player) {
  return [`Club: ${player.club}`];
}

export function getRandomPlayer(players: Player[]): Player {
  if (players.length === 0) {
    throw new Error("No players available.");
  }

  const index = Math.floor(Math.random() * players.length);
  return players[index];
}

export function getNextPlayer(
  players: Player[],
  usedPlayerIds: string[],
): Player {
  const availablePlayers = players.filter(
    (player) => !usedPlayerIds.includes(player.id),
  );

  if (availablePlayers.length === 0) {
    throw new Error("No more players available.");
  }

  return getRandomPlayer(availablePlayers);
}

export function nextQuestion(state: GameState, players: Player[]): GameState {
  if (state.questionNumber >= TOTAL_QUESTIONS) {
    return {
      ...state,
      isFinished: true,
    };
  }

  const nextPlayer = getNextPlayer(players, state.usedPlayerIds);

  return {
    ...state,
    currentPlayerId: nextPlayer.id,
    questionNumber: state.questionNumber + 1,
    attempts: 0,
    cluesRevealed: 0,
    isPlayerRevealed: false,

    usedPlayerIds: [...state.usedPlayerIds, nextPlayer.id],
  };
}

export function submitAnswer(
  state: GameState,
  player: Player,
  answer: string,
): GameState {
  const isCorrect = checkAnswer(player, answer);

  if (isCorrect) {
    const points = calculateScore(state.cluesRevealed);

    return {
      ...state,
      score: state.score + points,
    };
  }

  return {
    ...state,
    attempts: state.attempts + 1,
  };
}

export function showClue(state: GameState): GameState {
  return {
    ...state,
    cluesRevealed: Math.min(state.cluesRevealed + 1, MAX_ADDITIONAL_CLUES),
  };
}

export function revealPlayer(state: GameState): GameState {
  return {
    ...state,
    isPlayerRevealed: true,
  };
}
