"use client";

import Image from "next/image";
import { Toaster, toast } from "sonner";
import { useEffect,useRef, useState } from "react";
import {
  checkPlayerAnswer,
  getRandomGamePlayer,
  revealPlayerName,
  type GamePlayer,
} from "./actions";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState<GamePlayer | null>(null);
  const [answer, setAnswer] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  const [clueShown, setClueShown] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealedName, setRevealedName] = useState("");

  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const isSubmittingRef = useRef(false);


  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const [usedPlayerIds, setUsedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    if (gameStarted) {
      loadPlayer([]);
    }
  }, [gameStarted]);

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
      setRevealedName("");
      setGameComplete(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuess() {
    if (!player || !answer.trim() || isCorrect || revealed || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const correct = await checkPlayerAnswer(player.id, answer);

      if (correct) {
        const points = clueShown ? 4 : 5;

        setScore((currentScore) => currentScore + points);
        setIsCorrect(true);
        setCorrectAnswers((currentCorrect) => currentCorrect + 1);
        toast.success("Correct Guess", {
          description: `You earned ${points} points!`,
        });
      } else {
        setAttempts((currentAttempts) => currentAttempts + 1);

        toast.error("Wrong Guess", {
          description: "Try again or use a clue",
        });
      }

      setAnswer("");
    } catch (error) {
      console.error(error);
    }
    finally{
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleClue() {
    if (!clueShown && !isCorrect && !revealed) {
      setClueShown(true);
    }
  }

  async function handleReveal() {
    if (!player || isCorrect || revealed) {
      return;
    }

    try {
      const name = await revealPlayerName(player.id);

      setRevealedName(name);
      setRevealed(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNextQuestion() {
    if (usedPlayerIds.length >= 10) {
      setGameComplete(true);
      return;
    }

    await loadPlayer(usedPlayerIds);
  }

  async function playAgain() {
    setGameComplete(false);
    setScore(0);
    setUsedPlayerIds([]);
    setCorrectAnswers(0);

    await loadPlayer([]);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading player...</p>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="w-full max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Football Player Guessing Game
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight">
            PLAYER-GUESS
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg text-zinc-400">
            Can you identify the footballer from their blurred image and clues?
          </p>

          <button
            onClick={() => setGameStarted(true)}
            className="mt-10 rounded-xl bg-white px-10 py-4 text-sm font-bold tracking-wide text-black transition hover:bg-zinc-200 active:scale-95"
          >
            START GAME
          </button>

          <div className="mt-8 flex justify-center gap-8 text-sm text-zinc-500">
            <span>10 Questions</span>
            <span>•</span>
            <span>5 Points Each</span>
          </div>
        </div>
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

  if (gameComplete) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Toaster position="top-center" theme="dark" />

        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
            <h1 className="text-2xl font-bold tracking-tight">PLAYER-GUESS</h1>

            <div className="text-right">
              <p className="text-sm text-zinc-400">Final Score</p>

              <p className="text-xl font-bold">{score}</p>
            </div>
          </header>

          {/* Game Complete */}
          <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 text-6xl">🎉</div>

            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              Game Complete
            </p>

            <h2 className="mt-3 text-4xl font-bold">Well Played!</h2>

            <p className="mt-3 max-w-md text-zinc-400">
              You completed all 10 questions.
            </p>

            {/* Final Score */}
            <div className="mt-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                Final Score
              </p>

              <p className="mt-3 text-6xl font-bold">
                {score}
                <span className="text-2xl text-zinc-500"> / 50</span>
              </p>

              <p className="mt-2 text-sm text-zinc-500">points</p>
            </div>

            {/* Game Stats */}
            <div className="mt-4 grid w-full max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Correct
                </p>

                <p className="mt-2 text-3xl font-bold">{correctAnswers}/10</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Questions
                </p>

                <p className="mt-2 text-3xl font-bold">10/10</p>
              </div>
            </div>

            {/* Play Again */}
            <button
              onClick={playAgain}
              className="mt-8 rounded-xl bg-white px-10 py-4 text-sm font-bold tracking-wide text-black transition hover:bg-zinc-200 active:scale-95"
            >
              PLAY AGAIN
            </button>
          </section>
        </div>
      </main>
    );
  }

  const questionNumber = usedPlayerIds.length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Toaster position="top-center" theme="light" />

      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <h1 className="text-2xl font-bold tracking-tight">PLAYER-GUESS</h1>

          <div className="text-right">
            <p className="text-sm text-zinc-400">Score</p>

            <p className="text-xl font-bold">{score}</p>
          </div>
        </header>

        {/* Game */}
        <section className="flex flex-1 flex-col items-center py-10">
          {/* Question heading */}
          <div className="mb-6 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              Question {questionNumber} / 10
            </p>

            <h2 className="mt-2 text-3xl font-bold">Who is this player?</h2>

            <p className="mt-2 text-zinc-400">
              Identify the footballer from the clues below.
            </p>
          </div>

          {/* Player image */}
          <div className="relative mb-8 h-80 w-64 overflow-hidden rounded-2xl bg-zinc-800">
            <Image
              src={player.imageUrl}
              alt="Mystery football player"
              className={`h-full w-full object-cover transition-all duration-500 ${
                revealed || isCorrect ? "blur-0" : "scale-110 blur-xl"
              }`}
              fill
              sizes="256px"
            />
          </div>

          {/* Initial attributes */}
          <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">Nationality</p>

              <p className="mt-1 font-semibold">{player.nationality}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">Position</p>

              <p className="mt-1 font-semibold">{player.position}</p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">League</p>

              <p className="mt-1 font-semibold">{player.league}</p>
            </div>
          </div>

          {/* Additional clue */}
          {clueShown && (
            <div className="mt-4 w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-center">
              <p className="text-xs uppercase text-zinc-500">Club</p>

              <p className="mt-1 font-semibold">{player.club}</p>
            </div>
          )}

          {/* Answer input */}
          {!isCorrect && !revealed && (
            <div className="mt-8 flex w-full max-w-xl gap-3">
              <input
                type="text"
                value={answer}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
              >
                {isSubmitting ? "Checking..." : "GUESS"}
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
              <p className="text-sm text-zinc-400">Correct answer!</p>

              <p className="mt-1 text-2xl font-bold">
                +{clueShown ? 4 : 5} points
              </p>
            </div>
          )}

          {/* Revealed answer */}
          {revealed && (
            <div className="mt-6 w-full max-w-xl rounded-xl bg-white px-6 py-5 text-center text-black">
              <p className="text-xs uppercase text-zinc-500">The player is</p>

              <p className="mt-1 text-2xl font-bold">{revealedName}</p>

              <p className="mt-2 text-sm text-zinc-500">Points earned: 0</p>
            </div>
          )}

          {/* Next question */}
          {(isCorrect || revealed) && (
            <button
              onClick={handleNextQuestion}
              disabled={false}
              className="mt-5 rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              NEXT QUESTION
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
