import {
  getAllProducts,
  getProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getProductsByCategory,
  searchProducts
} from "../modals/product.modal.sequelize.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res, next) => {
  const { category_id, search, minPrice, maxPrice } = req.query;
  console.log("=== API REQUEST RECEIVED ===");
  console.log("Query params:", { category_id, search, minPrice, maxPrice });
  
  const products = await getAllProducts({ category_id, search, minPrice, maxPrice });
  
  console.log("=== API RESPONSE ===");
  console.log(`Products found: ${products.length}`);
  if (products.length > 0) {
    console.log("First product:", products[0].product_name);
    console.log("First product category:", products[0].category_id);
  }
  
  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

const adminGetProducts = asyncHandler(async (req, res, next) => {
  const products = await getAllProducts(); // Use existing function
  res.status(200).json(new ApiResponse(200, products, "All products fetched successfully for admin"));
});

const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    throw new ErrorHandler(404, "Product not found");
  }
  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const adminCreateProductController = asyncHandler(async (req, res, next) => {
  const { product_name, category_id, description, price, stock_quantity, main_image_url } = req.body;

  if (!product_name || !price) {
    throw new ErrorHandler(400, "Product name and price are required");
  }

  const result = await adminCreateProduct({
    product_name,
    category_id,
    description,
    price,
    stock_quantity,
    main_image_url
  });

  res.status(201).json(new ApiResponse(201, result, "Product created successfully"));
});

const adminUpdateProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product) {
    throw new ErrorHandler(404, "Product not found");
  }

  const result = await adminUpdateProduct(id, req.body);
  res.status(200).json(new ApiResponse(200, result, "Product updated successfully"));
});

const adminDeleteProductController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product) {
    throw new ErrorHandler(404, "Product not found");
  }

  await adminDeleteProduct(id);
  res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
  getProducts,
  adminGetProducts,
  getSingleProduct,
  adminCreateProductController,
  adminUpdateProductController,
  adminDeleteProductController
};
