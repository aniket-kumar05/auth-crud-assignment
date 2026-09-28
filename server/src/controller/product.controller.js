import ProductModel from "../models/product.model.js";
import imagekit from "../utils/imagekit.js";

// Helper: upload a buffer to ImageKit
const uploadToImageKit = async (fileBuffer, fileName, mimeType) => {
  const response = await imagekit.upload({
    file: fileBuffer,           // Buffer from multer memoryStorage
    fileName: fileName,         // Original file name
    folder: "/products",        // ImageKit folder to store product images
    useUniqueFileName: true,    // Prevent name collisions
  });
  return { url: response.url, fileId: response.fileId };
};

// Helper: delete an image from ImageKit by its fileId
const deleteFromImageKit = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.error("ImageKit delete error (non-fatal):", err.message);
  }
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const userId = req.user.userId;

    let image = { url: "", fileId: "" };

    // If an image file was sent via multipart/form-data, upload it to ImageKit
    if (req.file) {
      image = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const product = await ProductModel.create({
      name,
      description: description || "",
      price: Number(price),
      category: category || "General",
      stock: stock !== undefined ? Number(stock) : 0,
      user: userId,
      image,
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

    let image = existingProduct.image; // Keep old image by default

    // If a new image was uploaded, upload to ImageKit and delete the old one
    if (req.file) {
      // Delete old image from ImageKit first
      await deleteFromImageKit(existingProduct.image?.fileId);

      // Upload new image
      image = await uploadToImageKit(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const { name, description, price, category, stock } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price: Number(price) }),
          ...(category && { category }),
          ...(stock !== undefined && { stock: Number(stock) }),
          image,
        },
      },
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

    // Delete product image from ImageKit
    await deleteFromImageKit(existingProduct.image?.fileId);

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
