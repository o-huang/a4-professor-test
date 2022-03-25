import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Like from "../models/likes/Like";
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() { }

    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({ tuit: tid })
            .populate("likedBy")
            .exec();

    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({ likedBy: uid })
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            }).exec();

    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({ tuit: tid, likedBy: uid });

    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({ tuit: tid, likedBy: uid });

    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({ tuit: tid });

    checkIfUserLikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({ tuit: tid, likedBy: uid });

    //Checking for dislikes
    checkIfUserDislikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({ tuit: tid, likedBy: uid });

    userUnDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({ tuit: tid, likedBy: uid });

}