import mongoose, { Schema, models } from "mongoose";

const VoteSchema = new Schema(
    {
        pollId: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
        voterHash: { type: String, required: true }
    },
    { timestamps: true }
);

export const Vote = models.Vote || mongoose.model("Vote", VoteSchema);