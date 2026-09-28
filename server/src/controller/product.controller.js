import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const userId = req.user.userId;

    const product = await ProductModel.create({
      name,
      description: description || "",
      price: Number(price),
      category: category || "General",
      stock: stock !== undefined ? Number(stock) : 0,
      user: userId,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: {
        count: products.length,
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate("user", "name email");

    if (!product) {
      return res.status(404).json({
        message: `Product with ID '${id}' not found`,
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Scoped check: verify product existence before updating
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        message: `Product with ID '${id}' not found`,
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    return res.status(200).json({
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    // Scoped check: verify product existence before deleting
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        message: `Product with ID '${id}' not found`,
      });
    }

    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
