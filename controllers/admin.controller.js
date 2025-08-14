import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Admin from '../models/admin.models.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'


// Admin Sign up logic here
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try{
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({email});
        
        if(existingAdmin){
            const error = new Error("Admin already exists")
            error.statusCode = 409;
            throw error;
        }

        // Code to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // code to create new admin
        const Admins = await Admin.create([{name, email, password: hashedPassword}])

        const token = jwt.sign({ adminId: Admins[0]._id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        await session.commitTransaction(); 
        session.endSession();

        res.status(201).json({
            success: true,
            message: "New Admin created successfully",
            data: {
                token, 
                admin: Admins[0],
            }
        })
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const admin = await Admin.findOne({email})

        if(!admin){
            const error = new Error("Admin not found")
            error.statusCode = 404;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);

        if(!isValidPassword){
            const error = new Error("Invalid password")
            error.statusCode = 401; // Unauthorised
            throw error
        }

        const token = jwt.sign({adminId: admin._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        res.status(200).json({
            success: true,
            message: "Admin signed in successfully",
            data: {token, admin}
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}

