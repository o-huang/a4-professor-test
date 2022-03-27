/**
 * @file Declares user data type representing a user
 */
import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";
import mongoose from "mongoose";
/**
 * @typedef User Represents relationship of a user.
 * @property {mongoose.Schema.Types.ObjectId} _id Id for user
 * @property {string} username User's username
 * @property {string} password User's password
 * @property {string} firstName User's firstName
 * @property {string} lastName User's lastName
 * @property {string} email User's email
 * @property {string} profilePhoto User's profile photo
 * @property {string} headerImage User's headerIamge
 * @property {string} biography User's biography
 * @property {Date} dateOfBirth User's date of birth
 * @property {AccountType} accountType User's account type
 * @property {MartialStatus} martialStatus User's martial status
 * @property {Location} location User's location
 * @property {number} salary User's salary
 */
export default interface User {
    _id?: mongoose.Schema.Types.ObjectId,
    username: string,
    password: string,
    email: string,
    firstName?: string,
    lastName?: string,
    profilePhoto?: string,
    headerImage?: string,
    biography?: string,
    dateOfBirth?: Date,
    accountType?: AccountType,
    maritalStatus?: MaritalStatus,
    location?: Location,
    salary?: number
};