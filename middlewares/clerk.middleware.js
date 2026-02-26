import { requireAuth } from "@clerk/express";

const protect = requireAuth();

export default protect;