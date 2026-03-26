import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";
import { sequelize } from "../database/database.js";

const { Product, Category, Review } = models;

// Get all active products
const getAllProducts = async (filters = {}) => {
  try {
    console.log("Fetching all products with filters:", filters);
    
    const whereCondition = {};
    
    // Only add filters if they exist
    if (filters.category_id) {
      whereCondition.category_id = filters.category_id;
    }
    
    if (filters.search) {
      whereCondition.product_name = {
        [sequelize.Sequelize.Op.like]: `%${filters.search}%`
      };
    }

    const products = await Product.findAll({
      where: whereCondition
    });

    console.log("Found products:", products.length);

    return products;
  } catch (error) {
    console.error("DB Error in getAllProducts:", error);
    throw new ErrorHandler(500, "Error fetching products");
  }
};

// Get product by ID
const getProductById = async (productId) => {
  try {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['user_first_name', 'user_last_name']
            }
          ]
        }
      ]
    });

    if (!product) {
      throw new ErrorHandler(404, "Product not found");
    }

    return product;
  } catch (error) {
    console.error("DB Error in getProductById:", error);
    throw error;
  }
};

// Create new product (Admin)
const adminCreateProduct = async (productData) => {
  try {
    const product = await Product.create({
      product_name: productData.product_name,
      description: productData.description,
      price: productData.price,
      discount_price: productData.discount_price,
      stock_quantity: productData.stock_quantity || 0,
      category_id: productData.category_id,
      main_image_url: productData.main_image_url,
      is_active: 1
    });

    return product;
  } catch (error) {
    console.error("DB Error in adminCreateProduct:", error);
    throw new ErrorHandler(500, "Error creating product");
  }
};

// Update product (Admin)
const adminUpdateProduct = async (productId, productData) => {
  try {
    const [affectedCount] = await Product.update(productData, {
      where: { product_id: productId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Product not found");
    }

    const updatedProduct = await Product.findByPk(productId);
    return updatedProduct;
  } catch (error) {
    console.error("DB Error in adminUpdateProduct:", error);
    throw error;
  }
};

// Delete product (Admin)
const adminDeleteProduct = async (productId) => {
  try {
    const affectedCount = await Product.destroy({
      where: { product_id: productId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Product not found");
    }

    return true;
  } catch (error) {
    console.error("DB Error in adminDeleteProduct:", error);
    throw error;
  }
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  try {
    const products = await Product.findAll({
      where: { 
        category_id: categoryId,
        is_active: 1
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return products;
  } catch (error) {
    console.error("DB Error in getProductsByCategory:", error);
    throw new ErrorHandler(500, "Error fetching products by category");
  }
};

// Search products
const searchProducts = async (searchTerm) => {
  try {
    const products = await Product.findAll({
      where: {
        is_active: 1,
        [sequelize.Sequelize.Op.or]: [
          {
            product_name: {
              [sequelize.Sequelize.Op.like]: `%${searchTerm}%`
            }
          },
          {
            description: {
              [sequelize.Sequelize.Op.like]: `%${searchTerm}%`
            }
          }
        ]
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return products;
  } catch (error) {
    console.error("DB Error in searchProducts:", error);
    throw new ErrorHandler(500, "Error searching products");
  }
};

// Update stock quantity
const updateStock = async (productId, quantity) => {
  try {
    const [affectedCount] = await Product.update(
      { stock_quantity: quantity },
      { where: { product_id: productId } }
    );

    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in updateStock:", error);
    throw new ErrorHandler(500, "Error updating stock");
  }
};

export {
  getAllProducts,
  getProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getProductsByCategory,
  searchProducts,
  updateStock
};
