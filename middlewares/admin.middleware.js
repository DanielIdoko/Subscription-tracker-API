import Admin from '../models/admin.models.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'

const adminMiddleware = async(req, res, next)=>{
    try {
        // initialize token
        let token;
        // Confirm if there is an admin token passed in
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token)return res.status(401).json({message: "Unauthorized"})

        const decoded = jwt.verify(token, JWT_SECRET)
        const admin = await Admin.findById(decoded.adminId);
        
        if(!admin)return res.status(401).json({message: "Unauthorized"})

        // Set the admin object to be the one above 
        req.admin = admin;

        next()
    } catch (error) {
        res.status(401).json({message: "Unauthorized", error: error.message})
    }
}

export default adminMiddleware