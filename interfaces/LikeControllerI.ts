import { Request, Response } from "express";
/**
 * @file Controller interface RESTful Web service API for likes resource
 */
export default interface LikeControllerI {
    findAllUsersThatLikedTuit(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    userTogglesTuitLikes(req: Request, res: Response): void;
    checkIfUserLikedTuit (req: Request, res: Response): void;
};