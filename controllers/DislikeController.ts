/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import { Express, Request, Response } from "express";
import DislikeDao from "../daos/DislikeDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";
import TuitDao from "../daos/TuitDao";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import LikeDao from "../daos/LikeDao";


/**
 * @class TuitController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/dislikes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/dislikes/:tid to record that a user likes a tuit
 *     </li>
 * </ul>
 * @property {DisikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {


    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.get("/api/tuits/:tid/dislikes", DislikeController.dislikeController.findAllUsersThatDislikedTuit);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.checkIfUserDislikedTuit);
            app.delete("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userUnDislikesTuit);
        }
        return DislikeController.dislikeController;
    }

    private constructor() { }
    /**
    * User dislikes a tuit
    * @param {Request} req Represents request from client, including the path
    * parameter tid representing the disliked tuit
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the user objects
    */
    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then((status) => res.send(status));


    /**
   * Checks if user disliked a tuit
   * @param {Request} req Represents request from client, including the path
   * parameter tid representing the disliked tuit
   * @param {Response} res Represents response to client, including the
   * body formatted as JSON arrays containing the user objects
   */
    checkIfUserDislikedTuit = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyDislikedTuit = await dislikeDao.checkIfUserDislikedTuitNode(userId, tid);
            if (userAlreadyDislikedTuit) {
                res.send({ status: "disliked" })
            } else {
                res.send({ status: "nothing" })
            }
        } catch (e) {
            res.sendStatus(404);
        }
    }


    /**
    * Retrieves all users that disliked a tuit from the database
    * @param {Request} req Represents request from client, including the path
    * parameter tid representing the disliked tuit
    * @param {Response} res Represents response to client, including the
    * body formatted as JSON arrays containing the user objects
    */
    findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
            .then(dislikes => res.json(dislikes));

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const tuitDao = DislikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;

        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await dislikeDao.checkIfUserLikedTuitNode(userId, tid);
            const userAlreadyDislikedTuit = await dislikeDao.checkIfUserDislikedTuitNode(userId, tid);
            const howManyLikedTuit = await dislikeDao.countHowManyLikedTuit(tid);
            const howManyDislikedTuit = await dislikeDao.countHowManyDislikedTuit(tid);
            const currentNumberOfTotalLikes = howManyLikedTuit - howManyDislikedTuit
            let tuit = await tuitDao.findTuitById(tid);

            if (userAlreadyDislikedTuit) {
                await dislikeDao.userUnDislikesTuit(userId, tid);
                tuit.stats.likes = currentNumberOfTotalLikes + 1;
            } else if (userAlreadyLikedTuit) {
                await dislikeDao.userUnlikesTuit(userId, tid)
                await DislikeController.dislikeDao.userDislikesTuit(userId, tid)
                tuit.stats.likes = currentNumberOfTotalLikes - 2;
            } else {
                await DislikeController.dislikeDao.userDislikesTuit(userId, tid);
                tuit.stats.likes = currentNumberOfTotalLikes - 1;
            };
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
}