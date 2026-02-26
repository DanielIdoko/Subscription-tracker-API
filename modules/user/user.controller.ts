import Subscription from "../models/subscriptions.model.js";
import User from "../models/user.models.js";

/**
 * @desc Get user profile
 * @Route GET /:id
 * @Access User
 **/
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: true,
        error: "Invalid user, try again",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Delete a user's acccount
 * @Route DELETE /:id
 * @Access User
 **/
export const deleteUser = async (req, res) => {
  try {
    // code to delete user from databae based on id
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "Invalid user, try again." });

    await Subscription.deleteMany({ user });

    res.status(200).json({
      success: true,
      message: "Account successfully removed.",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Update a user's account
 * @Route UPDATE /:id
 * @Access User
 **/
export const updateUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!req.params.id) {
      return res.status(400).json({ error: "Please provide a user id." });
    }

    //Find and update user details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ error: "Invalid User, try again." });
    }

    // Response message
    res.status(200).json({
      success: true,
      message: "Account successfully updated",
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};