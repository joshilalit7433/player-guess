import "dotenv/config";

import { getRandomGamePlayer } from "../app/actions";

async function test() {
  console.log("===== GAME ACTION TEST =====");

  const player = await getRandomGamePlayer();

  console.log("Player ID:", player.id);
  console.log("Nationality:", player.nationality);
  console.log("Position:", player.position);
  console.log("League:", player.league);
  console.log("Club:", player.club);

  console.log("\nPlayer name exposed:", "name" in player);

  console.log("\n===== TEST COMPLETE =====");
}

test().catch((error) => {
  console.error("\nTEST FAILED:");
  console.error(error);
});