/**
 * @file Declares tuit data type representing a tuit, who posted it, and when it was posted.
 */
import User from "../users/User";
import Stats from "./Stats";

export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
    image?: String,
    youtube?: String,
    avatarLogo?: String,
    imageOverlay?: String,
    stats: Stats
};