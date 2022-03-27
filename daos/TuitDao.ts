/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI {
    private static tuitDao: TuitDao | null = null;
    /**
   * Creates singleton DAO instance
   * @returns TuitDao
   */
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() { }
    /**
   * Retrieve all tuit instance from the database
   * @returns Promise To be notified when all tuit is retrieved from database
   */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .populate("postedBy")
            .exec();
    /**
    * Retrieve all tuit instance from the database from a user
    * @param {string} uid Primary key of user to be found
    * @returns Promise To be notified when user's tuit is retrieved from database
    */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({ postedBy: uid })
            .sort({ 'postedOn': -1 })
            .populate("postedBy")
            .exec();
    /**
         * Retrieve a tuit instance from the database
         * @param {string} uid Primary key of tuit to be found
         * @returns Promise To be notified when tuit is retrieved from database
         */
    findTuitById = async (uid: string): Promise<any> =>
        TuitModel.findById(uid)
            .populate("postedBy")
            .exec();
    /**
* Inserts tuit instance into the database
* @param {string} uid Primary key of user creating tuit
* @param {Tuit} tuit Instance to be inserted into the database
* @returns Promise To be notified when tuit is inserted into the database
*/
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({ ...tuit, postedBy: uid });
    /**
* Updates tuit with new values in database
* @param {string} uid Primary key of tuit to be modified
* @param {Tuit} tuit Tuit object containing properties and their new values
* @returns Promise To be notified when tuit is updated in the database
*/
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            { _id: tid },
            { $set: tuit });
    /**
* Updates tuit with like value
* @param {string} tid Primary key of tuit to be modified
* @param {any} newStats new like value
* @returns Promise To be notified when tuit is updated in the database
*/
    updateLikes = async (tid: string, newStats: any): Promise<any> =>
        TuitModel.updateOne(
            { _id: tid },
            { $set: { stats: newStats } }
        );
    /**
* Removes A tuit from database
* @param {string} uid Primary key of the tuit to be deleted
* @returns Promise To be notified when a tuit are removed from the
* database
*/
    deleteTuit = async (uid: string): Promise<any> =>
        TuitModel.deleteOne({ _id: uid });
}