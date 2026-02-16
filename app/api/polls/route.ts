import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Poll } from "@/models/Poll";

export async function POST(req: Request) {
    try {
        const { question, options } = await req.json();

        if (!question || options.length < 2) {
            return NextResponse.json(
                { error: "Poll must have at least 2 options" },
                { status: 400 }
            );
        }

        await connectDB();

        const poll = await Poll.create({
            question,
            options: options.map((text: string) => ({ text }))
        });

        return NextResponse.json({ pollId: poll._id });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create poll" },
            { status: 500 }
        );
    }
}
