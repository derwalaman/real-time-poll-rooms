import mongoose, { Schema, models } from "mongoose";

const OptionSchema = new Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const PollSchema = new Schema(
    {
        question: { type: String, required: true },
        options: { type: [OptionSchema], required: true }
    },
    { timestamps: true }
);

export const Poll = models.Poll || mongoose.model("Poll", PollSchema);
