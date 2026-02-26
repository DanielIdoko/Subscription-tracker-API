import { serve } from "bun";
import { BUN_PORT } from "./config/env";
import { success } from "zod";

const server = serve({
  idleTimeout: 10,
  port: BUN_PORT,
  routes: {
    "/": () =>
      Response.json({
        success: true,
        message:
          "Managel is a service developed to make automation and management for user's subscriptions easy. Check out the docs <a href='https://github.com/DanielIdoko/Subscription-tracker-API'>here</a>",
      }),
    "/health": () => new Response("Health OK!"),
    // Major routes
  },
  fetch(req, server) {
    console.log(`Active requests: ${server.pendingRequests}`);
    return new Response("Route not found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  },
  error(error) {
    console.error(error);
    return new Response("An internal server error occured", { status: 500 });
  },
});

console.log(`Server running on ${server.url}`);
