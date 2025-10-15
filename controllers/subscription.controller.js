import Subscription from "../models/subscriptions.model.js";

/**
 * @desc Allow users create a new subscription
 * @Route PUT /
 * @Access User
 **/
export const createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    res.status(err.message || 500).json({
      success: false,
      error: err.message || "An error occured while creating subscriptions.",
    });
  }
};

/**
 * @desc Get all subscriptions from database
 * @Route GET /
 * @Access User
 **/
export const getAllSubscriptions = async (req, res) => {
  try {
    // Validate user
    if (req.user.id.toString() !== req.params.id) {
      const err = new Error("Invalid accunt trying to access subscriptions");
      err.status = 401;
      throw err;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions || [] });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Get a single user's subscription
 * @Route GET /:id
 * @Access User
 **/
export const getSubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }

    // Validate user
    if (req.user.id != req.params.id) {
      const err = new Error("Invalid accunt trying to access subscription");
      err.status = 401;
      throw err;
    }

    const subscription = await Subscription.findById(req.params.subscriptionId);

    res.status(200).json({
      success: true,
      data: subscription || "Subscription may have been deleted. Create one",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Update a user's subscription
 * @Route UPDATE /:id
 * @Access User
 **/
export const updateSubscription = async (req, res) => {
  try {
    // Validate user
    if (req.user._id != req.params.id) {
      const err = new Error("Invalid accunt trying to update subscription");
      err.status = 401;
      throw err;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      { _id: req.params.subscriptionId },
      { $set: { ...req.body } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};

/**
 * @desc Delete a user's subscription
 * @Route DELETE /:id
 * @Access User
 **/
export const deleteSubscription = async (req, res) => {
  try {
    // Validate user
    if (req.user.id != req.params.id) {
      const err = new Error("Invalid accunt trying to delete subscription");
      err.status = 401;
      throw err;
    }

    const subscription = await Subscription.findOneAndDelete({
      _id: req.params.subscriptionId,
    });

    res.status(200).json({
      success: true,
      message: "Subscription removed successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "An internal server error occurred",
    });
  }
};
