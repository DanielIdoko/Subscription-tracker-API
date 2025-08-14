import Subscription from '../models/subscriptions.model.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })
        console.log(subscription);
        
        res.status(201).json({success: true, data: subscription})
    } catch (err) {
        next(err)
    }
}


export const getUserSubscriptions = async(req, res, next) =>{
    try {
        if(req.user.id != req.params.id){
            const err = new Error("Invalid accunt trying to access subscriptions");
            err.status = 401
            throw err
        }

        const subscriptions = await Subscription.find({user: req.params.id})

        res.status(200).json({success: true, data: subscriptions})
    } catch (error) {
        next(error)
    }
}

export const getAllSubscriptions = async(req, res, next) =>{
    try {
        const subscriptions = await Subscription.find()

        res.status(200).json({success: true, data: subscriptions})
    } catch (error) {
        next(error)
    }
}
