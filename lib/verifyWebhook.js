// import { CLERK_WEBHOOK_SECRET } from "../config/env.js";
// import { Webhook } from "svix";

// const WEBHOOK_SECRET = CLERK_WEBHOOK_SECRET;

// const verifyWebhook = async (req, res, next) => {
//     const payload = req.body.toString(); 

//     // 2. Extract Svix headers
//     const svix_id = req.headers["svix-id"];
//     const svix_timestamp = req.headers["svix-timestamp"];
//     const svix_signature = req.headers["svix-signature"];

//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         return res.status(400).json({ message: "Error: No svix headers" });
//     }

//     const wh = new Webhook(WEBHOOK_SECRET);

//     try {
//         // Now passing the raw string payload
//         req.webHookEvent = await wh.verify(payload, { 
//             "svix-id": svix_id,
//             "svix-timestamp": svix_timestamp,
//             "svix-signature": svix_signature,
//         });
//         next();
//     } catch (error) {
//         // ... error handling
//         console.error("Webhook verification failed:", error);
//         return res.status(400).json({ message: "Invalid signature" });
//     }
// };

// export default verifyWebhook;