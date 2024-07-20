import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAT: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAT: {type: Date, required: true, default: Date.now}
})

export interface User extends Document{
    username: string;
    email: String;
    password: string;
    verifyCode: string;
    verifycodeExpire: Date;
    isverified: boolean;
    isAcceptingMessage: boolean;
    message: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {type: String, required: [true, "Username is required"], trim: true, unique: true},
    email: {type: String, required: [true, "Email is required"], match: [/.+\@.+\..+/, 'please use a valid email addr'],trim: true, unique: true},
    password: {type: String, required: [true, "Password is required"], trim: true},
    verifyCode: {type: String, required: true},
    verifycodeExpire: {type: Date, required: true},
    isverified: {type: Boolean, default: false},
    isAcceptingMessage: {type: Boolean, default: true},
    message: [MessageSchema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema); 

export default UserModel;