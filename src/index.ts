import express from "express";
import mongoose from "mongoose";
import uploadRoutes from "./routes/upload";
import statusRoutes from "./routes/status";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);

// Connect to mongo db
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
