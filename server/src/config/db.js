import mongoose from "mongoose";
import ENV from "../ENV/index.js";

export const connectDb = async() =>{
    try {
        await mongoose.connect(ENV.MONGO_URL)
        console.log("Connected to database")
    } catch (error) {
        console.error("Error connecting to database", error)
    }
}