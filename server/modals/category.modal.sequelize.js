import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";

const { Category, Product } = models;

// Get all active categories
const getAllCategories = async () => {
  try {
    console.log("Fetching all categories");
    
    const categories = await Category.findAll({
      order: [['category_name', 'ASC']]
    });

    console.log("Found categories:", categories.length);

    return categories;
  } catch (error) {
    console.error("DB Error in getAllCategories:", error);
    throw new ErrorHandler(500, "Error fetching categories");
  }
};

// Get category by ID
const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Product,
          as: 'products',
          where: { is_active: 1 },
          required: false
        }
      ]
    });

    if (!category) {
      throw new ErrorHandler(404, "Category not found");
    }

    return category;
  } catch (error) {
    console.error("DB Error in getCategoryById:", error);
    throw error;
  }
};

// Create new category (Admin)
const adminCreateCategory = async (categoryData) => {
  try {
    const category = await Category.create({
      category_name: categoryData.category_name,
      category_image: categoryData.category_image,
      is_active: 1
    });

    return category;
  } catch (error) {
    console.error("DB Error in adminCreateCategory:", error);
    throw new ErrorHandler(500, "Error creating category");
  }
};

// Update category (Admin)
const adminUpdateCategory = async (categoryId, categoryData) => {
  try {
    const [affectedCount] = await Category.update(categoryData, {
      where: { category_id: categoryId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Category not found");
    }

    const updatedCategory = await Category.findByPk(categoryId);
    return updatedCategory;
  } catch (error) {
    console.error("DB Error in adminUpdateCategory:", error);
    throw error;
  }
};

// Delete category (Admin)
const adminDeleteCategory = async (categoryId) => {
  try {
    // Check if category has products
    const productCount = await Product.count({
      where: { category_id: categoryId }
    });

    if (productCount > 0) {
      throw new ErrorHandler(400, "Cannot delete category with existing products");
    }

    const affectedCount = await Category.destroy({
      where: { category_id: categoryId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Category not found");
    }

    return true;
  } catch (error) {
    console.error("DB Error in adminDeleteCategory:", error);
    throw error;
  }
};

export {
  getAllCategories,
  getCategoryById,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
};
