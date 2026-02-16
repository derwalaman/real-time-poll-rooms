"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

let socket: any;

export default function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState<any>(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval: any;

        const fetchPoll = async () => {
            const res = await fetch(`/api/polls/${id}`);
            const data = await res.json();
            setPoll(data);
        };

        // initial fetch
        fetchPoll();

        // socket (best effort)
        fetch("/api/socket");
        socket = io({ path: "/api/socket" });

        socket.emit("join-poll", id);
        socket.on("poll-updated", setPoll);

        // 🔁 fallback polling (REAL FIX)
        interval = setInterval(fetchPoll, 2000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [id]);

    if (!poll) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading poll…</p>
            </main>
        );
    }

    const totalVotes = poll.options.reduce(
        (sum: number, o: any) => sum + o.votes,
        0
    );

    const vote = async (optionId: string) => {
        if (voted) return;

        setLoading(true);

        const res = await fetch("/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pollId: id, optionId }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.error || "You already voted");
            setVoted(true);
            return;
        }

        // ✅ OPTIMISTIC UPDATE (KEY FIX)
        setPoll((prev: any) => ({
            ...prev,
            options: prev.options.map((opt: any) =>
                opt._id === optionId
                    ? { ...opt, votes: opt.votes + 1 }
                    : opt
            ),
        }));

        toast.success("Vote recorded");
        setVoted(true);
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h1 className="text-xl font-semibold mb-6">
                    {poll.question}
                </h1>

                <div className="space-y-3">
                    {poll.options.map((opt: any) => {
                        const percent =
                            totalVotes === 0
                                ? 0
                                : Math.round((opt.votes / totalVotes) * 100);

                        return (
                            <button
                                key={opt._id}
                                disabled={voted || loading}
                                onClick={() => vote(opt._id)}
                                className={`relative w-full overflow-hidden rounded-lg border
                  px-4 py-3 text-left transition
                  ${voted
                                        ? "cursor-not-allowed opacity-70"
                                        : "hover:bg-slate-50"
                                    }`}
                            >
                                {/* progress bar */}
                                <div
                                    className="absolute inset-y-0 left-0 bg-indigo-100 transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                />

                                <div className="relative flex justify-between">
                                    <span className="font-medium">{opt.text}</span>
                                    <span className="text-slate-600">
                                        {percent}%
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-between text-sm text-slate-600">
                    <span>{totalVotes} votes</span>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied");
                        }}
                        className="text-indigo-600 hover:underline"
                    >
                        Share poll
                    </button>
                </div>
            </div>
        </main>
    );
}
