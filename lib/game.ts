import { Player } from "./player";

export type GameState = {
  currentPlayerId: string;
  questionNumber: number;
  score: number;
  attempts: number;
  cluesRevealed: number;
  isFinished: boolean;
};

export function startGame(playerId: string): GameState {
  return {
    currentPlayerId: playerId,
    questionNumber: 1,
    score: 0,
    attempts: 0,
    cluesRevealed: 0,
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

export function getClues(player: Player) {
  return [
    `Nationality: ${player.nationality}`,
    `Position: ${player.position}`,
    `Club: ${player.club}`,
  ];
}


export function getRandomPlayer(players: Player[]): Player{
    const index = Math.floor(Math.random() * players.length);
    return players[index];
}


