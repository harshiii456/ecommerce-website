import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../modals/product.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res, next) => {
  const { category_id, search, minPrice, maxPrice } = req.query;
  const products = await getAllProducts({ category_id, search, minPrice, maxPrice });
  res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await getProductById(req.params.id);
  if (!product[0]) {
    throw new ErrorHandler(404, "Product not found");
  }
  res.status(200).json(new ApiResponse(200, product[0], "Product fetched successfully"));
});

const adminCreateProduct = asyncHandler(async (req, res, next) => {
  const { product_name, category_id, description, price, stock_quantity, main_image_url } = req.body;

  if (!product_name || !price) {
    throw new ErrorHandler(400, "Product name and price are required");
  }

  const result = await createProduct({
    product_name,
    category_id,
    description,
    price,
    stock_quantity,
    main_image_url
  });

  res.status(201).json(new ApiResponse(201, { product_id: result.insertId }, "Product created successfully"));
});

const adminUpdateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product[0]) {
    throw new ErrorHandler(404, "Product not found");
  }

  await updateProduct(id, req.body);
  res.status(200).json(new ApiResponse(200, {}, "Product updated successfully"));
});

const adminDeleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await getProductById(id);
  if (!product[0]) {
    throw new ErrorHandler(404, "Product not found");
  }

  await deleteProduct(id);
  res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
  getProducts,
  getSingleProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
};
