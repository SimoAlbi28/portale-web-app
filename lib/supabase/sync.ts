"use client";

import { createSupabaseClient } from "./client";

const supabase = createSupabaseClient();

export type UserData = {
  game_state: { level: number; completed: number[] };
  settings: {
    theme: string;
    intensity: string;
    view: string;
    sort: string;
    favorites: string[];
    showFavoritesOnly: boolean;
  };
};

/** Load user data from Supabase. Returns null if not logged in or no data. */
export async function loadUserData(): Promise<UserData | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_data")
    .select("game_state, settings")
    .eq("user_id", user.id)
    .single();

  return data ?? null;
}

/** Save game state to Supabase (upsert). */
export async function saveGameState(gameState: {
  level: number;
  completed: number[];
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_data").upsert(
    {
      user_id: user.id,
      game_state: gameState,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}

/** Save settings to Supabase (upsert). */
export async function saveSettings(settings: UserData["settings"]) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_data").upsert(
    {
      user_id: user.id,
      settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}
