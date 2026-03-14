import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderDetails,
  adminGetAllOrders,
  adminUpdateStatus
} from "../controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(placeOrder).get(getMyOrders);
router.route("/:id").get(getOrderDetails);

// Admin Routes
router.route("/admin/all").get(isAdmin, adminGetAllOrders);
router.route("/admin/status/:id").put(isAdmin, adminUpdateStatus);

export default router;
