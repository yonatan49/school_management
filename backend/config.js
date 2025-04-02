import dotenv from "dotenv"

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const mongoDBURL = process.env.MONGO_DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;