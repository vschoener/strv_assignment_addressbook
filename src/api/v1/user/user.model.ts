import { Schema, Model, model, Document, DocumentQuery } from "mongoose";
import * as _ from "lodash";

import * as validator from "validator";

export interface IUserDocument extends Document {
    email: any;
    password: any;
    tokens: Array<any>;
    findUserFromToken(): IUserDocument;
}

export const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `The value is not an valid email`
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return _.pick(obj, [
        "_id",
        "email"
    ]);
};

export const User: Model<IUserDocument> = model<IUserDocument>("User", UserSchema);
