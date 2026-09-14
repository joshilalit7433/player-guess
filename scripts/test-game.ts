import { players } from "../lib/players";
import {
  startGame,
  submitAnswer,
  nextQuestion,
} from "../lib/game";

console.log("===== PLAYER-GUESS 10 QUESTION TEST =====\n");

let gameState = startGame(players[0].id);

console.log(`Question ${gameState.questionNumber} started.`);

for (let i = 0; i < 9; i++) {
  const currentPlayer = players.find(
    (player) => player.id === gameState.currentPlayerId
  );

  if (!currentPlayer) {
    throw new Error("Current player not found.");
  }

  console.log(
    `Question ${gameState.questionNumber}: ${currentPlayer.name}`
  );

  // Simulate a wrong guess
  gameState = submitAnswer(
    gameState,
    currentPlayer,
    "Wrong Answer"
  );

  // Simulate the correct answer
  gameState = submitAnswer(
    gameState,
    currentPlayer,
    currentPlayer.name
  );

  console.log(`  Attempts: ${gameState.attempts}`);
  console.log(`  Score: ${gameState.score}`);

  gameState = nextQuestion(gameState, players);
}

console.log("\n===== FINAL QUESTION =====");

const finalPlayer = players.find(
  (player) => player.id === gameState.currentPlayerId
);

if (!finalPlayer) {
  throw new Error("Final player not found.");
}

console.log(
  `Question ${gameState.questionNumber}: ${finalPlayer.name}`
);

// Finish the 10th question
gameState = submitAnswer(
  gameState,
  finalPlayer,
  finalPlayer.name
);

console.log(`Final score before finishing: ${gameState.score}`);

gameState = nextQuestion(gameState, players);

console.log("\n===== FINAL GAME STATE =====");
console.log(gameState);

console.log("\n===== TEST COMPLETE =====");