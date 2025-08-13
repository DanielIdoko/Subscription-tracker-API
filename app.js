import express from "express";
import { PORT } from './config/env.js'
import connectToDatabase from "./database/mongodb.js"
import { authRouter, subscriptionRouter, userRouter} from './routes/index.js'
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express()


// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// Prependings for separate routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)

app.use(errorMiddleware)

app.get("/", (req, res)=>{
    res.send("Welcome to the subscription API!") 
})

app.listen(PORT, async()=>{
    console.log('App running on port http://localhost:' + PORT);

    await connectToDatabase();
})


export default app;