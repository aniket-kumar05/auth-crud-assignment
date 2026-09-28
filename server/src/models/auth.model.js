import mongoose from "mongoose";


const User = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: ""
    }
})

const UserModel = mongoose.model("User", User)
export default UserModel