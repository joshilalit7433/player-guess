import { supabase } from "./supabase";
import type { Player } from "./player";

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase.from("players").select("*");

  if (error) {
    throw new Error(`Failed to fetch players: ${error.message}`);
  }

  return data.map((player) => ({
    id: player.id,
    name: player.name,
    nationality: player.nationality,
    position: player.position,
    club: player.club,
    league: player.league,
    imageUrl: player.image_url,
  }));
}
