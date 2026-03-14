import { databaseInstance } from "../database/database.js";

const createReviewModal = async (reviewData) => {
  const query = "INSERT INTO reviews SET ?";
  try {
    const [res] = await databaseInstance.query(query, reviewData);
    return res;
  } catch (error) {
    console.error("DB Error in createReviewModal:", error);
    throw new ErrorHandler(500, "Error creating review");
  }
};

const getReviewsByProductId = async (product_id) => {
  const query = `
    SELECT r.*, u.user_first_name, u.user_last_name 
    FROM reviews r
    JOIN user_master u ON r.user_id = u.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  try {
    const [res] = await databaseInstance.query(query, [product_id]);
    return res;
  } catch (error) {
    console.error("DB Error in getReviewsByProductId:", error);
    throw new ErrorHandler(500, "Error fetching reviews");
  }
};

const deleteReviewModal = async (review_id, user_id) => {
  const query = "DELETE FROM reviews WHERE review_id = ? AND user_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [review_id, user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in deleteReviewModal:", error);
    throw new ErrorHandler(500, "Error deleting review");
  }
};

export {
  createReviewModal,
  getReviewsByProductId,
  deleteReviewModal
};

