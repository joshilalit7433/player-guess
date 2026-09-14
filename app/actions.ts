"use server";

import { supabase } from "../lib/supabase";
import type { Player } from "../lib/player";

export async function getGamePlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*");

  if (error) {
    throw new Error(`Failed to load players: ${error.message}`);
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

export async function checkPlayerAnswer(
  playerId: string,
  answer: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("players")
    .select("name")
    .eq("id", playerId)
    .single();

  if (error) {
    throw new Error(`Failed to check answer: ${error.message}`);
  }

  return data.name.toLowerCase().trim() === answer.toLowerCase().trim();
}