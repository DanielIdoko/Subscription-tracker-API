import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.models.js";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";

/**
 * @desc Signup a new user
 * @Route POST /
 * @Access Public
 **/
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   const error = new Error("Sorry, that user already exists");
    //   error.status = 409;
    //   throw error;
    // }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Cookie setup
    const cookieOptions = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    // Remove password before returning
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: "New user created successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Login user
 * @Route POST /
 * @Access Public
 **/
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User account not found");
      error.status = 404;
      throw error;
    }

    // Validate inputs before DB query
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password to login",
      });
    }

    // Check for valid password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = new Error("Invalid password provided");
      error.status = 401;
      throw error;
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Cookie setup
    const cookieOptions = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Logout user
 * @Route POST /:id
 * @Access User
 **/
export const signOut = async (req, res, next) => {
  try {
    if (!req.user || req.user.id.toString() !== req.params.id) {
      const error = new Error("Unauthorised logout attempt");
      error.statusCode = 401;
      throw error;
    }

    // Clear JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server occured",
    });
  }
};
