import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";
import { sequelize } from "../database/database.js";

const { Review, User, Product } = models;

// Create new review
const createReview = async (reviewData) => {
  try {
    const { user_id, product_id, rating, comment } = reviewData;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { user_id, product_id }
    });

    if (existingReview) {
      throw new ErrorHandler(400, "You have already reviewed this product");
    }

    // Check if product exists and is active
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      throw new ErrorHandler(404, "Product not found");
    }

    const review = await Review.create({
      user_id,
      product_id,
      rating,
      comment,
      is_verified: 1 // Auto-verify for now
    });

    return review;
  } catch (error) {
    console.error("DB Error in createReview:", error);
    throw error;
  }
};

// Get reviews by product
const getReviewsByProduct = async (productId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const reviews = await Review.findAll({
      where: { 
        product_id: productId,
        is_verified: 1
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'user_first_name', 'user_last_name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const total = await Review.count({
      where: { 
        product_id: productId,
        is_verified: 1
      }
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("DB Error in getReviewsByProduct:", error);
    throw new ErrorHandler(500, "Error fetching reviews");
  }
};

// Get reviews by user
const getReviewsByUser = async (userId) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'product_name', 'product_image']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return reviews;
  } catch (error) {
    console.error("DB Error in getReviewsByUser:", error);
    throw new ErrorHandler(500, "Error fetching user reviews");
  }
};

// Update review
const updateReview = async (reviewId, userId, reviewData) => {
  try {
    const review = await Review.findOne({
      where: { review_id: reviewId, user_id: userId }
    });

    if (!review) {
      throw new ErrorHandler(404, "Review not found");
    }

    const [affectedCount] = await Review.update(reviewData, {
      where: { review_id: reviewId, user_id: userId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(400, "Failed to update review");
    }

    const updatedReview = await Review.findByPk(reviewId);
    return updatedReview;
  } catch (error) {
    console.error("DB Error in updateReview:", error);
    throw error;
  }
};

// Delete review
const deleteReview = async (reviewId, userId) => {
  try {
    const affectedCount = await Review.destroy({
      where: { review_id: reviewId, user_id: userId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Review not found");
    }

    return true;
  } catch (error) {
    console.error("DB Error in deleteReview:", error);
    throw error;
  }
};

// Get review statistics for a product
const getReviewStats = async (productId) => {
  try {
    const stats = await Review.findAll({
      where: { 
        product_id: productId,
        is_verified: 1
      },
      attributes: [
        [sequelize.Sequelize.fn('COUNT', sequelize.Sequelize.col('review_id')), 'total_reviews'],
        [sequelize.Sequelize.fn('AVG', sequelize.Sequelize.col('rating')), 'average_rating']
      ],
      raw: true
    });

    const ratingDistribution = await Review.findAll({
      where: { 
        product_id: productId,
        is_verified: 1
      },
      attributes: [
        'rating',
        [sequelize.Sequelize.fn('COUNT', sequelize.Sequelize.col('review_id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    const result = {
      total_reviews: parseInt(stats[0]?.total_reviews) || 0,
      average_rating: parseFloat(stats[0]?.average_rating) || 0,
      rating_distribution: ratingDistribution.reduce((acc, item) => {
        acc[item.rating] = parseInt(item.count);
        return acc;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    };

    return result;
  } catch (error) {
    console.error("DB Error in getReviewStats:", error);
    throw new ErrorHandler(500, "Error fetching review statistics");
  }
};

// Admin functions
const adminGetAllReviews = async (filters = {}) => {
  try {
    const whereCondition = {};
    
    if (filters.product_id) {
      whereCondition.product_id = filters.product_id;
    }
    
    if (filters.user_id) {
      whereCondition.user_id = filters.user_id;
    }
    
    if (filters.is_verified !== undefined) {
      whereCondition.is_verified = filters.is_verified;
    }

    const reviews = await Review.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'user_first_name', 'user_last_name', 'email_id']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'product_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return reviews;
  } catch (error) {
    console.error("DB Error in adminGetAllReviews:", error);
    throw new ErrorHandler(500, "Error fetching all reviews");
  }
};

const adminUpdateReviewVerification = async (reviewId, isVerified) => {
  try {
    const [affectedCount] = await Review.update(
      { is_verified: isVerified },
      { where: { review_id: reviewId } }
    );

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Review not found");
    }

    const updatedReview = await Review.findByPk(reviewId);
    return updatedReview;
  } catch (error) {
    console.error("DB Error in adminUpdateReviewVerification:", error);
    throw error;
  }
};

export {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewStats,
  adminGetAllReviews,
  adminUpdateReviewVerification
};
