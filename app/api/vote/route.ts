import { connectDB } from "@/lib/mongodb";
import { Poll } from "@/models/Poll";
import { Vote } from "@/models/Vote";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { io } from "../socket/route";

export async function POST(req: Request) {
    const { pollId, optionId } = await req.json();

    const ip =
        req.headers.get("x-forwarded-for") || "unknown-ip";
    const userAgent =
        req.headers.get("user-agent") || "unknown-agent";

    const voterHash = crypto
        .createHash("sha256")
        .update(ip + userAgent + pollId)
        .digest("hex");

    await connectDB();

    // Prevent double voting
    const alreadyVoted = await Vote.findOne({ pollId, voterHash });
    if (alreadyVoted) {
        return NextResponse.json(
            { error: "You already voted" },
            { status: 403 }
        );
    }

    // Register vote
    await Vote.create({ pollId, voterHash });

    // Increment vote
    await Poll.updateOne(
        { _id: pollId, "options._id": optionId },
        { $inc: { "options.$.votes": 1 } }
    );

    const updatedPoll = await Poll.findById(pollId);

    // Emit real-time update
    io?.to(pollId).emit("poll-updated", updatedPoll);

    return NextResponse.json({ success: true });
}
