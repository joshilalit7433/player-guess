"use client";

import { useState } from "react";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [clueShown, setClueShown] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const correctAnswer = "Mohamed Salah";

  function handleGuess() {
    if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      alert("Correct! 🎉");
    } else {
      setAttempts(attempts + 1);
      alert("Wrong answer!");
    }

    setAnswer("");
  }

  function handleClue() {
    setClueShown(true);
  }

  function handleReveal() {
    setRevealed(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <h1 className="text-2xl font-bold tracking-tight">
            PLAYER-GUESS
          </h1>

          <div className="text-right">
            <p className="text-sm text-zinc-400">Score</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </header>

        {/* Question */}
        <section className="flex flex-1 flex-col items-center py-10">

          <div className="mb-6 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              Question 1 / 10
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Who is this player?
            </h2>

            <p className="mt-2 text-zinc-400">
              Identify the footballer from the clues below.
            </p>
          </div>

          {/* Player Image */}
          <div className="relative mb-8 h-80 w-64 overflow-hidden rounded-2xl bg-zinc-800">
            <div className="flex h-full items-center justify-center text-center text-zinc-500">
              Player Image
            </div>
          </div>

          {/* Initial Attributes */}
          <div className="grid w-full max-w-xl grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Nationality
              </p>
              <p className="mt-1 font-semibold">
                Egypt
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Position
              </p>
              <p className="mt-1 font-semibold">
                Forward
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                League
              </p>
              <p className="mt-1 font-semibold">
                Süper Lig
              </p>
            </div>
          </div>

          {/* Additional Clue */}
          {clueShown && (
            <div className="mt-4 w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">
                Club
              </p>
              <p className="mt-1 font-semibold">
                Trabzonspor
              </p>
            </div>
          )}

          {/* Revealed Player */}
          {revealed && (
            <div className="mt-6 rounded-xl bg-white px-6 py-4 text-center text-black">
              <p className="text-xs uppercase text-zinc-500">
                The player is
              </p>
              <p className="mt-1 text-2xl font-bold">
                {correctAnswer}
              </p>
            </div>
          )}

          {/* Answer */}
          {!revealed && (
            <div className="mt-8 flex w-full max-w-xl gap-3">
              <input
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
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
          {!revealed && (
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

          {/* Attempts */}
          <p className="mt-6 text-sm text-zinc-500">
            Wrong guesses: {attempts}
          </p>

        </section>
      </div>
    </main>
  );
}