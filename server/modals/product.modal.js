import { databaseInstance } from "../database/database.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

const getAllProducts = async (filters) => {
  let query = "SELECT * FROM products WHERE is_active = 1";
  const queryParams = [];

  if (filters.category_id) {
    query += " AND category_id = ?";
    queryParams.push(filters.category_id);
  }

  if (filters.search) {
    query += " AND (product_name LIKE ? OR description LIKE ?)";
    const searchTerm = `%${filters.search}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  if (filters.minPrice) {
    query += " AND price >= ?";
    queryParams.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += " AND price <= ?";
    queryParams.push(filters.maxPrice);
  }

  try {
    const [res] = await databaseInstance.query(query, queryParams);
    return res;
  } catch (error) {
    console.error("DB Error in getAllProducts:", error);
    throw new ErrorHandler(500, "Error fetching products");
  }
};

const getAllProductsAdmin = async () => {
  const query = "SELECT * FROM products ORDER BY created_at DESC";
  try {
    const [res] = await databaseInstance.query(query);
    return res;
  } catch (error) {
    console.error("DB Error in getAllProductsAdmin:", error);
    throw new ErrorHandler(500, "Error fetching all products for admin");
  }
};

const getProductById = async (id) => {
  const query = "SELECT * FROM products WHERE product_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [id]);
    return res;
  } catch (error) {
    console.error("DB Error in getProductById:", error);
    throw new ErrorHandler(500, "Error fetching product by ID");
  }
};

const createProduct = async (productData) => {
  const query = "INSERT INTO products SET ?";
  try {
    const [res] = await databaseInstance.query(query, productData);
    return res;
  } catch (error) {
    console.error("DB Error in createProduct:", error);
    throw new ErrorHandler(500, "Error creating product");
  }
};

const updateProduct = async (id, productData) => {
  const query = "UPDATE products SET ? WHERE product_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [productData, id]);
    return res;
  } catch (error) {
    console.error("DB Error in updateProduct:", error);
    throw new ErrorHandler(500, "Error updating product");
  }
};

const deleteProduct = async (id) => {
  const query = "UPDATE products SET is_active = 0 WHERE product_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [id]);
    return res;
  } catch (error) {
    console.error("DB Error in deleteProduct:", error);
    throw new ErrorHandler(500, "Error deleting product");
  }
};

export {
  getAllProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

