/**
 * @file Implements mongoose model to CRUD
 * documents in the roles collection
 */
import mongoose from "mongoose";
import RoleSchema from "./RoleSchema";
const RoleModel = mongoose.model("RoleModel", RoleSchema);
export default RoleModel;