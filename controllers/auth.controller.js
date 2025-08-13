import mongoose from "mongoose"
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import bycript from 'bcryptjs'
import User from '../models/user.models.js'
import { JWT_EXPIRES_IN,JWT_SECRET } from '../config/env.js'
// Sign up logic
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()


    session.startTransaction()

    try{
        const { name, email, password } = req.body()

        // Check if user already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            const refuse = new Error("Sorry, that user already exists")
            error.statusCode = 409;
            throw refuse;
            // refuse can also be error
        }

        // code to hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const newUsers = await User.create([{email, name, password: hashedPassword}], {session})

        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        })


        await session.commitTransaction()
    }catch(error){
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}
export const signIn = async (req, res, next) => {
    
}

export const signOut = async (req, res, next) => {
    
}

