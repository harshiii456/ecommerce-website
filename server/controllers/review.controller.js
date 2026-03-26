import {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewStats
} from "../modals/review.modal.sequelize.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addReview = asyncHandler(async (req, res, next) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user.user_id;

  if (!product_id || !rating) {
    throw new ErrorHandler(400, "Product ID and rating are required");
  }

  try {
    await createReviewModal({
      product_id,
      user_id,
      rating,
      comment
    });
    res.status(201).json(new ApiResponse(201, {}, "Review added successfully"));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ErrorHandler(400, "You have already reviewed this product");
    }
    throw error;
  }
});

const getProductReviews = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
  const reviews = await getReviewsByProductId(product_id);
  res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

const removeReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  await deleteReviewModal(id, user_id);
  res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export {
  addReview,
  getProductReviews,
  removeReview
};
