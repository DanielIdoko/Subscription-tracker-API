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
    res.status(500).json({
      success: false,
      error: "An error occured while creating subscriptions.",
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
    if (req.user.id != req.params.id) {
      const err = new Error("Invalid accunt trying to access subscriptions");
      err.status = 401;
      throw err;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions || [] });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An internal server error occured",
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
    // Validate user
    if (req.user.id != req.params.id) {
      const err = new Error("Invalid accunt trying to access subscription");
      err.status = 401;
      throw err;
    }

    const subscription = await Subscription.findOne(req.params.id);

    res.status(200).json({
      success: true,
      data: subscription || "Subscription may have been deleted. Create one",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An internal server error occured",
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
    if (req.user.id != req.params.id) {
      const err = new Error("Invalid accunt trying to update subscription");
      err.status = 401;
      throw err;
    }

    const subscription = await Subscription.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An internal server error occured",
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
      _id: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Subscription removed successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An internal server error occured",
    });
  }
};
