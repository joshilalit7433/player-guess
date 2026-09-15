"use client";

import { useEffect, useState } from "react";
import {
  checkPlayerAnswer,
  getRandomGamePlayer,
  type GamePlayer,
} from "./actions";

export default function Home() {
  const [player, setPlayer] = useState<GamePlayer | null>(null);
  const [answer, setAnswer] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  const [clueShown, setClueShown] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [usedPlayerIds, setUsedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    loadPlayer([]);
  }, []);

  async function loadPlayer(usedIds: string[]) {
    try {
      setIsLoading(true);

      const newPlayer = await getRandomGamePlayer(usedIds);

      setPlayer(newPlayer);
      setUsedPlayerIds([...usedIds, newPlayer.id]);

      setAnswer("");
      setAttempts(0);
      setClueShown(false);
      setRevealed(false);
      setIsCorrect(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuess() {
    if (!player || !answer.trim() || isCorrect || revealed) {
      return;
    }

    try {
      const correct = await checkPlayerAnswer(
        player.id,
        answer
      );

      if (correct) {
        const points = clueShown ? 4 : 5;

        setScore((currentScore) => currentScore + points);
        setIsCorrect(true);
      } else {
        setAttempts((currentAttempts) => currentAttempts + 1);
      }

      setAnswer("");
    } catch (error) {
      console.error(error);
    }
  }

  function handleClue() {
    if (!clueShown && !isCorrect && !revealed) {
      setClueShown(true);
    }
  }

  function handleReveal() {
    if (!isCorrect && !revealed) {
      setRevealed(true);
    }
  }

  async function handleNextQuestion() {
    if (usedPlayerIds.length >= 10) {
      return;
    }

    await loadPlayer(usedPlayerIds);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading player...</p>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p>Unable to load player.</p>
      </main>
    );
  }

  const questionNumber = usedPlayerIds.length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <h1 className="text-2xl font-bold tracking-tight">
            PLAYER-GUESS
          </h1>

          <div className="text-right">
            <p className="text-sm text-zinc-400">
              Score
            </p>

            <p className="text-xl font-bold">
              {score}
            </p>
          </div>
        </header>

        {/* Game */}
        <section className="flex flex-1 flex-col items-center py-10">

          {/* Question heading */}
          <div className="mb-6 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              Question {questionNumber} / 10
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Who is this player?
            </h2>

            <p className="mt-2 text-zinc-400">
              Identify the footballer from the clues below.
            </p>
          </div>

          {/* Player image */}
          <div className="relative mb-8 h-80 w-64 overflow-hidden rounded-2xl bg-zinc-800">
            <div className="flex h-full items-center justify-center text-center text-zinc-500">
              Player Image
            </div>
          </div>

          {/* Initial attributes */}
          <div className="grid w-full max-w-xl grid-cols-3 gap-3">

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Nationality
              </p>

              <p className="mt-1 font-semibold">
                {player.nationality}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Position
              </p>

              <p className="mt-1 font-semibold">
                {player.position}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                League
              </p>

              <p className="mt-1 font-semibold">
                {player.league}
              </p>
            </div>

          </div>

          {/* Additional clue */}
          {clueShown && (
            <div className="mt-4 w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Club
              </p>

              <p className="mt-1 font-semibold">
                {player.club}
              </p>
            </div>
          )}

          {/* Answer input */}
          {!isCorrect && !revealed && (
            <div className="mt-8 flex w-full max-w-xl gap-3">

              <input
                type="text"
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleGuess();
                  }
                }}
                placeholder="Enter player name..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-white"
              />

              <button
                onClick={handleGuess}
                className="rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                GUESS
              </button>

            </div>
          )}

          {/* Controls */}
          {!isCorrect && !revealed && (
            <div className="mt-4 flex gap-3">

              <button
                onClick={handleClue}
                disabled={clueShown}
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                SHOW CLUE
              </button>

              <button
                onClick={handleReveal}
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-900"
              >
                REVEAL PLAYER
              </button>

            </div>
          )}

          {/* Correct answer */}
          {isCorrect && (
            <div className="mt-6 w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 p-5 text-center">
              <p className="text-sm text-zinc-400">
                Correct answer!
              </p>

              <p className="mt-1 text-2xl font-bold">
                +{clueShown ? 4 : 5} points
              </p>
            </div>
          )}

          {/* Revealed answer */}
          {revealed && (
            <div className="mt-6 w-full max-w-xl rounded-xl bg-white px-6 py-5 text-center text-black">
              <p className="text-xs uppercase text-zinc-500">
                The player is
              </p>

              <p className="mt-1 text-2xl font-bold">
                Player Revealed
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Points earned: 0
              </p>
            </div>
          )}

          {/* Next question */}
          {(isCorrect || revealed) && (
            <button
              onClick={handleNextQuestion}
              disabled={usedPlayerIds.length >= 10}
              className="mt-5 rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {usedPlayerIds.length >= 10
                ? "GAME COMPLETE"
                : "NEXT QUESTION"}
            </button>
          )}

          {/* Attempts */}
          <p className="mt-6 text-sm text-zinc-500">
            Wrong guesses: {attempts}
          </p>

        </section>
      </div>
    </main>
  );
}