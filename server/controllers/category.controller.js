import {
  getAllCategories,
  getCategoryById,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} from "../modals/category.modal.sequelize.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await getAllCategories();
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await getCategoryById(req.params.id);
  if (!category[0]) {
    throw new ErrorHandler(404, "Category not found");
  }
  res.status(200).json(new ApiResponse(200, category[0], "Category fetched successfully"));
});

const adminCreateCategoryController = asyncHandler(async (req, res, next) => {
  const { category_name, parent_category_id } = req.body;

  if (!category_name) {
    throw new ErrorHandler(400, "Category name is required");
  }

  const result = await adminCreateCategory({
    category_name,
    parent_category_id: parent_category_id || null
  });

  res.status(201).json(new ApiResponse(201, result, "Category created successfully"));
});

const adminUpdateCategoryController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { category_name, parent_category_id } = req.body;

  const category = await getCategoryById(id);
  if (!category) {
    throw new ErrorHandler(404, "Category not found");
  }

  const result = await adminUpdateCategory(id, {
    category_name,
    parent_category_id: parent_category_id || null
  });

  res.status(200).json(new ApiResponse(200, result, "Category updated successfully"));
});

const adminDeleteCategoryController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await getCategoryById(id);
  if (!category) {
    throw new ErrorHandler(404, "Category not found");
  }

  await adminDeleteCategory(id);
  res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
  getCategories,
  getSingleCategory,
  adminCreateCategoryController,
  adminUpdateCategoryController,
  adminDeleteCategoryController
};
