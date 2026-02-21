import mongoose, { Schema, model, models } from "mongoose";

const OptionSchema = new Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
});

const PollSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    options: [OptionSchema],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
    voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Poll = models.Poll || model("Poll", PollSchema);

export default Poll;
