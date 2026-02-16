import { Server } from "socket.io";
import { NextResponse } from "next/server";

let io: Server | null = null;

export async function GET() {
    if (!io) {
        io = new Server({
            path: "/api/socket",
            cors: {
                origin: "*",
            },
        });

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("join-poll", (pollId) => {
                socket.join(pollId);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });
    }

    return NextResponse.json({ success: true });
}

export { io };
