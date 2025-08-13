const errorMiddleware = (err, req, res, next) =>{
    try{
        let error = {...err}
        error.message = err.message;
        console.log(err);

        // Handles error for 'CastError'
        if(err.name == "CastError"){
            const message = 'Resource not found';
            error = new Error(message)

            error.statusCode = 404;
        }

        // Handles error for duplicate id
        if(err.name = 11000){
            const message = 'Duplicate fixed value entered'
            error = new Error(message)
            error.statusCode = 400
        }

        // Handles validation error
        if(err.name == "ValidationError"){
            const message = Object.values(err.errors).map(value => value.message)
            error = new Error(message.join(", "))
            error.statusCode = 400
        }
        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
    }catch(err){
        next(err)
    }
}

export default errorMiddleware