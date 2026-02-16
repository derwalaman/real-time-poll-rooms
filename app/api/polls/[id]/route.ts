import { connectDB } from "@/lib/mongodb";
import { Poll } from "@/models/Poll";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params; // ✅ FIX

    await connectDB();

    const poll = await Poll.findById(id);

    if (!poll) {
        return NextResponse.json(
            { error: "Poll not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(poll);
}
