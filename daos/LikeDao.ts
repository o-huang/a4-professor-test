import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
/**
 * @file Implements DAO managing data storage of likes. Uses mongoose LikeModel
 * to integrate with MongoDB
 */



/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    /**
    * Creates singleton DAO instance
    * @returns LikeDao
    */
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() { }
    /**
       * Retrieve all users who like a tuit from database
       * @param {string} tid Primary key of the tuit
       * @returns Promise To be notified when all users instance who like the tuit are retrieved from the
       * database
       */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({ tuit: tid })
            .populate("likedBy")
            .exec();
    /**
       * Retrieve all liked tuits by a user from database
       * @param {string} uid Primary key of the user 
       * @returns Promise To be notified when all like instance  of user is retrieved from the
       * database
       */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({ likedBy: uid })
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            }).exec();
    /**
       * Insert a like instance into the database
       * @param {string} uid Primary key of the user who is liking
       * @param {string} tid Primary key of the tuit that is being liked
       * @returns Promise To be notified when like instance is inserted into the
       * database
       */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({ tuit: tid, likedBy: uid });
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
    /**
      * Checks if a user already liked a tuit
      * @param {string} uid Primary key of the user who is liking
      * @param {string} tid Primary key of the tuit that is being liked
      * @returns notified if a user liked a tuit or not
      */
    checkIfUserLikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({ tuit: tid, likedBy: uid });

    //Checking for dislikes
    /**
      * Checks if a user already disliked a tuit
      * @param {string} uid Primary key of the user who is disliking
      * @param {string} tid Primary key of the tuit that is being disliked
      * @returns notified if a user disliked a tuit or not
      */
    checkIfUserDislikedTuitNode = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({ tuit: tid, likedBy: uid });

    /**
    * Removes a dislike instance from database
    * @param {string} uid Primary key of the user who is undisliking
    * @param {string} tid Primary key of the tuit that is being undisliked
    * @returns Promise To be notified when dislike instance is removed from the
    * database
    */
    userUnDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({ tuit: tid, likedBy: uid });
    /**
   * Count how many dislikes there are
   * @param {string} tid Primary key of the tuit being disliked
   * @returns Promise To be notified how many dislikes there are
   */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({ tuit: tid });

}