import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import foodRoute from "./routes/foodRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://quick-bite-woad.vercel.app"],
    credentials: true,
  }),
);

app.use("/api/user", userRoute);
app.use("/api/food", foodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port : ${PORT}`);
});
