"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // enforce minimum
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const createPoll = async () => {
    if (!question || options.some((o) => !o)) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to create poll");
      return;
    }

    toast.success("Poll created");
    router.push(`/poll/${data.pollId}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a Poll
          </h1>
          <p className="text-slate-600 mt-2">
            Share a link and watch votes update in real time
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {/* Question */}
          <label className="block text-sm font-medium mb-2">
            Question
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="What should we build next?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Options */}
          <div className="mt-6 space-y-3">
            {options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2"
              >
                <input
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) =>
                    updateOption(i, e.target.value)
                  }
                />

                {/* Remove button */}
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    type="button"
                    className="h-10 w-10 flex items-center justify-center
                    rounded-lg border border-slate-300 text-slate-500
                    hover:bg-slate-100 hover:text-slate-700 transition"
                    aria-label="Remove option"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add option */}
          <button
            onClick={addOption}
            className="mt-3 text-sm text-indigo-600 hover:underline"
          >
            + Add another option
          </button>

          {/* Submit */}
          <button
            onClick={createPoll}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3
            text-white font-medium hover:bg-indigo-700 transition
            disabled:opacity-60"
          >
            {loading ? "Creating poll…" : "Create poll"}
          </button>
        </div>
      </div>
    </main>
  );
}
