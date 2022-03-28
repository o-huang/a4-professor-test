import { Request, Response } from "express";
/**
 * @file Controller interface RESTful Web service API for dislikes resource
 */
export default interface DislikeControllerI {
    findAllUsersThatDislikedTuit(req: Request, res: Response): void;
    findAllTuitsDislikedByUser(req: Request, res: Response): void;
    userTogglesTuitDislikes(req: Request, res: Response): void;
    checkIfUserDislikedTuit (req: Request, res: Response): void;
    userUnDislikesTuit(req: Request, res: Response): void;
};