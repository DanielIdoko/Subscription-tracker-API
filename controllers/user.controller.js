import mongoose from 'mongoose';
import User from '../models/user.models.js'

// get all users function 
export const getUsers = async (req, res, next)=>{
    try {
        const users = await User.find();

        if(!users){
            const error = new Error("Users not found");
            error.statusCode = 404
            throw error
        }
        
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error)
    }
}


// get user function  
export const getUser = async (req, res, next)=>{
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            const error = new Error("User not found");
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error)
    }
}

// delete user function 
export const deleteUser = async (req, res, next)=>{
    try {
        // code to delete user from databae based on id
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user)return res.status(404).json({message: "User not found"})
     
        res.status(200).json({
            success: true,
            message: "Account successfully deleted"
        })
    } catch (error) {
        next(error)
    }
}
// Update user function 
export const updateUser = async (req, res, next)=>{
    try {
        // code to update user to databae based on id
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {new: true, runValidators: true}
        ).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"})
        }
     
        res.status(200).json({
            success: true,
            message: "Account successfully updated"
        })
    } catch (error) {
        next(error)
    }
}




