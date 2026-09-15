"use server";

import { supabase } from "../lib/supabase";

export type GamePlayer = {
  id: string;
  nationality: string;
  position: string;
  club: string;
  league: string;
  imageUrl: string;
};

export async function getRandomGamePlayer(
  usedPlayerIds: string[] = []
): Promise<GamePlayer> {
  const { data, error } = await supabase
    .from("players")
    .select(
      "id, nationality, position, club, league, image_url"
    );

  if (error) {
    throw new Error(`Failed to load players: ${error.message}`);
  }

  const availablePlayers = data.filter(
    (player) => !usedPlayerIds.includes(player.id)
  );

  if (availablePlayers.length === 0) {
    throw new Error("No more players available.");
  }

  const randomIndex = Math.floor(
    Math.random() * availablePlayers.length
  );

  const player = availablePlayers[randomIndex];

  return {
    id: player.id,
    nationality: player.nationality,
    position: player.position,
    club: player.club,
    league: player.league,
    imageUrl: player.image_url,
  };
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

  return (
    data.name.toLowerCase().trim() ===
    answer.toLowerCase().trim()
  );
}