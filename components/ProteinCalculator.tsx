"use client";

import { useState } from "react";

export default function ProteinCalculator() {
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("muscle");
  const [protein, setProtein] = useState<number | null>(null);

  function calculateProtein() {
    const kg = Number(weight);

    let multiplier = 2.2;

    if (goal === "lose") {
      multiplier = 2;
    }

    if (goal === "maintain") {
      multiplier = 1.6;
    }

    if (goal === "muscle") {
      multiplier = 2.2;
    }

    setProtein(Math.round(kg * multiplier));
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

      <h2 className="text-3xl font-bold">
        Protein Hesaplayıcı
      </h2>

      <p className="mt-2 text-zinc-400">
        Kilonu ve hedefini seç.
      </p>

      <input
        type="number"
        placeholder="Kilon (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="mt-8 w-full rounded-lg border border-zinc-700 bg-black p-4 text-white"
      />

      <select
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="mt-4 w-full rounded-lg border border-zinc-700 bg-black p-4 text-white"
      >
        <option value="muscle">Kas Kazanma</option>
        <option value="maintain">Kilo Koruma</option>
        <option value="lose">Yağ Kaybı</option>
      </select>

      <button
        onClick={calculateProtein}
        className="mt-6 w-full rounded-lg bg-white py-3 font-semibold text-black"
      >
        Hesapla
      </button>

      {protein !== null && (
        <div className="mt-8 rounded-lg bg-black p-6 text-center">

          <p className="text-zinc-400">
            Günlük Protein İhtiyacı
          </p>

          <h3 className="mt-3 text-5xl font-bold">
            {protein} g
          </h3>

        </div>
      )}

    </div>
  );
}