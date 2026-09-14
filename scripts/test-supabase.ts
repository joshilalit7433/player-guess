import "dotenv/config";

import { getPlayers } from "../lib/players-db";

async function test() {
  console.log("===== SUPABASE TEST =====");

  const players = await getPlayers();

  console.log(`Players found: ${players.length}`);

  players.forEach((player) => {
    console.log(
      `${player.id} | ${player.name} | ${player.club} | ${player.league}`
    );
  });

  console.log("\n===== TEST COMPLETE =====");
}

test().catch((error) => {
  console.error("Test failed:", error);
});