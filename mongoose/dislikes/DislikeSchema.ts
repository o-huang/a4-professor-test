/**
 * @file Implements mongoose schema for dislike
 */
import mongoose, { Schema } from "mongoose";
import Dislike from "../../models/dislikes/Dislike";
/**
 * @typedef Dislike Represents dislikes on a tuit
 * @property {ObjectId} tuit Tuit being disliked
 * @property {ObjectId} dislikedBy User disliking the tuit
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    dislikedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "dislikes" });
export default DislikeSchema;