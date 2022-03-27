import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";
import LikeModel from "../mongoose/likes/LikeModel";
export default class DislikeDao implements DislikeDaoI {

    private static dislikeDao: DislikeDao | null = null;
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }
    private constructor() { }
    /**
     * Retrieve all users who dislike a tuit from database
     * @param {string} tid Primary key of the tuit
     * @returns Promise To be notified when all users instance who dislike the tuit are retrieved from the
     * database
     */
    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({ tuit: tid })
            .populate("dislikedBy")
            .exec();
    /**
   * Retrieve all disliked tuits by a user from database
   * @param {string} uid Primary key of the user 
   * @returns Promise To be notified when all dislike instance  of user is retrieved from the
   * database
   */
    findAllTuitsDislikedByUser = async (uid: string): Promise<Dislike[]> =>
        DislikeModel
            .find({ dislikedBy: uid })
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            }).exec();
    /**
       * Insert a dislike instance into the database
       * @param {string} uid Primary key of the user who is disliking
       * @param {string} tid Primary key of the tuit that is being disliked
       * @returns Promise To be notified when dislike instance is inserted into the
       * database
       */
    userDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.create({ tuit: tid, dislikedBy: uid });
    /**
    * Removes a dislike instance from database
    * @param {string} uid Primary key of the user who is undisliking
    * @param {string} tid Primary key of the tuit that is being undisliked
    * @returns Promise To be notified when dislike instance is removed from the
    * database
    */
    userUnDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({ tuit: tid, dislikedBy: uid });
    /**
   * Count how many dislikes there are
   * @param {string} tid Primary key of the tuit being disliked
   * @returns Promise To be notified how many dislikes there are
   */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({ tuit: tid });
    /**
      * Checks if a user already disliked a tuit
      * @param {string} uid Primary key of the user who is disliking
      * @param {string} tid Primary key of the tuit that is being disliked
      * @returns notified if a user disliked a tuit or not
      */
    checkIfUserDislikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({ tuit: tid, dislikedBy: uid });

    //Checking for likes

    /**
     * Checks if a user already liked a tuit
     * @param {string} uid Primary key of the user who is liking
     * @param {string} tid Primary key of the tuit that is being liked
     * @returns notified if a user liked a tuit or not
     */
    checkIfUserLikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({ tuit: tid, likedBy: uid });
    /**
      * Removes a like instance from database
      * @param {string} uid Primary key of the user who is unliking
      * @param {string} tid Primary key of the tuit that is being unliked
      * @returns Promise To be notified when like instance is removed from the
      * database
      */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({ tuit: tid, likedBy: uid });
    /**
    * Count how many likes there are
    * @param {string} tid Primary key of the tuit being liked
    * @returns Promise To be notified how many likes there are
    */
    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({ tuit: tid });
}