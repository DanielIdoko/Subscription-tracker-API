import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Admin name is required"],
        trim: true,
        minLength: 2,
        maxLength: 55
    },
    email: {
        type: String, 
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please fill in a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    }
}, {timestamps: true})


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;