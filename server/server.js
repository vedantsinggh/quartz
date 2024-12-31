import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js";
import groupRoute from "./routes/groupRoutes.js";
import cors from "cors";

dotenv.config();
connectDB();


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/group', groupRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT , "172.16.39.134", () => console.log(`Server running on port ${PORT}`));

