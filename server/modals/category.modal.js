import { databaseInstance } from "../database/database.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

const getAllCategories = async () => {
  const query = "SELECT * FROM categories ORDER BY category_name ASC";
  try {
    const [res] = await databaseInstance.query(query);
    return res;
  } catch (error) {
    console.error("DB Error in getAllCategories:", error);
    throw new ErrorHandler(500, "Error fetching categories");
  }
};

const getCategoryById = async (id) => {
  const query = "SELECT * FROM categories WHERE category_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [id]);
    return res;
  } catch (error) {
    console.error("DB Error in getCategoryById:", error);
    throw new ErrorHandler(500, "Error fetching category by ID");
  }
};

const createCategory = async (categoryData) => {
  const query = "INSERT INTO categories SET ?";
  try {
    const [res] = await databaseInstance.query(query, categoryData);
    return res;
  } catch (error) {
    console.error("DB Error in createCategory:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ErrorHandler(400, "Category name already exists");
    }
    throw new ErrorHandler(500, "Error creating category");
  }
};

const updateCategory = async (id, categoryData) => {
  const query = "UPDATE categories SET ? WHERE category_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [categoryData, id]);
    return res;
  } catch (error) {
    console.error("DB Error in updateCategory:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ErrorHandler(400, "Category name already exists");
    }
    throw new ErrorHandler(500, "Error updating category");
  }
};

const deleteCategory = async (id) => {
  const query = "DELETE FROM categories WHERE category_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [id]);
    return res;
  } catch (error) {
    console.error("DB Error in deleteCategory:", error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new ErrorHandler(400, "Cannot delete category with associated products");
    }
    throw new ErrorHandler(500, "Error deleting category");
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
