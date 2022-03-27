/**
 * @file Implements mongoose schema for like
 */
import mongoose, { Schema } from "mongoose";
import Like from "../../models/likes/Like";
/**
 * @typedef Like Represents likes on a tuit
 * @property {ObjectId} tuit Tuit being liked
 * @property {ObjectId} likedBy User liking the tuit
 */
const LikeSchema = new mongoose.Schema<Like>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    likedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "likes" });
export default LikeSchema;