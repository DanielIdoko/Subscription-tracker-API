import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from '../config/env.js'

if(!DB_URI) {
    throw new Error("Please, include the DB_URI environment variable inside the .env.<development/production>.local file")
}

// Connect to DB
const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`Connected to Db in ${NODE_ENV} mode`);
    }
    catch(err){
        console.log("An Error occured, couldn't connect",err);
        process.exit(1)
    }
}

export default connectToDatabase;