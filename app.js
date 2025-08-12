import express from "express";
import { PORT } from './config/env.js'
import connectToDatabase from "./database/mongodb.js"
import { authRouter, subscriptionRouter, userRouter} from './routes/index.js'

const app = express()

// Prependings for separate routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)


app.get("/", (req, res)=>{
    res.send("Welcome to the subscription API!") 
})

app.listen(PORT, async()=>{
    console.log('App running on port http://localhost:' + PORT);

    await connectToDatabase();
})


export default app;