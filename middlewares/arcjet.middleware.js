import aj from '../config/arcjet.js'

const arcjetMiddleware = async(req, res, next)=>{
    try {
        const decision = await aj.protect(req,{requested: 1});

        if(decision.isDenied()){
            // Check the reason for denying a request 
            // Check for exceeded rate limit
            if(decision.reason.isRateLimit())return res.status(429).json({error: "Rate limit exceeded"});
            // Check for bot 
            if(decision.reason.isBot())res.status(403).json({error: "Bot detected"})

            // return case for neither of the reasons above
            return res.status(403).json({error: "Access denied"});
        }
        next();
    } catch (error) {
        console.log("Arcjet middleware error, ", error);
        next(error);
    }
}

export default arcjetMiddleware;