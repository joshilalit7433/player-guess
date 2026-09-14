import "dotenv/config";

import { getPlayers } from "../lib/players-db";
import {
  startGame,
  submitAnswer,
  showClue,
  nextQuestion,
} from "../lib/game";

async function test() {
  console.log("===== SUPABASE + GAME ENGINE TEST =====\n");

  // 1. Get players from Supabase
  const players = await getPlayers();

  console.log(`Players loaded from Supabase: ${players.length}\n`);

  if (players.length < 10) {
    throw new Error("Not enough players for a 10-question game.");
  }

  // 2. Start the game
  const firstPlayer = players[0];

  let gameState = startGame(firstPlayer.id);

  console.log(`Question ${gameState.questionNumber}`);
  console.log(`Player: ${firstPlayer.name}`);
  console.log(`Score: ${gameState.score}`);

  // 3. Wrong answer
  gameState = submitAnswer(
    gameState,
    firstPlayer,
    "Lionel Messi"
  );

  console.log(`\nWrong answer → Attempts: ${gameState.attempts}`);

  // 4. Show clue
  gameState = showClue(gameState);

  console.log(
    `Show clue → Clues revealed: ${gameState.cluesRevealed}`
  );

  // 5. Correct answer
  gameState = submitAnswer(
    gameState,
    firstPlayer,
    firstPlayer.name
  );

  console.log(
    `Correct answer → Score: ${gameState.score}`
  );

  // 6. Move to Question 2
  gameState = nextQuestion(gameState, players);

  console.log(
    `\nNext question → Question ${gameState.questionNumber}`
  );

  console.log(
    `Attempts reset: ${gameState.attempts}`
  );

  console.log(
    `Clues reset: ${gameState.cluesRevealed}`
  );

  console.log(
    `Player revealed: ${gameState.isPlayerRevealed}`
  );

  console.log(
    `Used players: ${gameState.usedPlayerIds.length}`
  );

  console.log("\n===== TEST COMPLETE =====");
}

test().catch((error) => {
  console.error("\nTEST FAILED:");
  console.error(error);
});