import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("/public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import interactionRouter from "./routes/user_interaction.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import categoryRouter from "./routes/category.routes.js";
import razorpayRouter from "./routes/razorpay.routes.js";
import testRouter from "./test-endpoint.js";

app.use("/api/v1/test", testRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/interaction", interactionRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/payment", razorpayRouter);

import { errorMiddleware } from "./utils/ErrorHandler.js";
app.use(errorMiddleware);

export { app };
