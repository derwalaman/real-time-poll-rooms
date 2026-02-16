import crypto from "crypto";
import { NextRequest } from "next/server";

export function getVoterHash(req: NextRequest) {
    const userAgent = req.headers.get("user-agent") || "";
    const acceptLang = req.headers.get("accept-language") || "";
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const raw = `${userAgent}|${acceptLang}|${ip}`;

    return crypto.createHash("sha256").update(raw).digest("hex");
}
