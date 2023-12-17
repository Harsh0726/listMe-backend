const { ObjectId } = require("mongodb"); // Import ObjectId from MongoDB
const { connectToDb, getDb } = require("../db");

// check connect to the database
connectToDb((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to the database successfully.");

    db = getDb();
  }
});

const getAllProductDetails = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || ""; // Get user input from query parameter
    const db = getDb();
    // Use a regular expression to perform a case-insensitive search on the item_name field
    const items = await db
      .collection("items")
      .find({ item_name: { $regex: new RegExp(searchTerm, "i") } })
      .sort({ createdAt: -1 })
      .toArray();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Could not fetch the documents" });
  }
};

const crateProduct = async (req, res) => {
  try {
    const { item_name, item_image, item_price, item_category } = req.body; // Extract fields from request body

    // Validate the presence of required fields
    if (!item_name || !item_image || !item_price || !item_category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(req.body);

    const db = getDb();
    const newItem = {
      item_name,
      item_image,
      item_price: Number(item_price), // Convert price to number if needed
      item_category,
    };

    // Insert the new item into the database
    const result = await db.collection("items").insertOne(newItem);
    res.status(201).json({ message: "Product added successfully", newItem });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Could not add the product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the ID of the product is passed in the URL
    const { item_name, item_image, item_price, item_category } = req.body;

    // Validate if at least one field is provided for update
    if (!item_name && !item_image && !item_price && !item_category) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const db = getDb();

    const updatedFields = {};
    if (item_name) updatedFields.item_name = item_name;
    if (item_image) updatedFields.item_image = item_image;
    if (item_price) updatedFields.item_price = Number(item_price);
    if (item_category) updatedFields.item_category = item_category;

    const updatedItem = await db.collection("items").findOneAndUpdate(
      { _id: ObjectId(productId) }, // Assuming you're using MongoDB ObjectId
      { $set: updatedFields },
      { returnOriginal: false }
    );

    if (!updatedItem.value) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedItem: updatedItem.value,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Could not update the product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the ID of the product is passed in the URL

    const db = getDb();

    const deletedItem = await db
      .collection("items")
      .findOneAndDelete({ _id: new ObjectId(productId) });

    if (!deletedItem || !deletedItem.value) {
      return res
        .status(404)
        .json({ error: "Product not found or already deleted" });
    }

    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        deletedItem: deletedItem.value,
      });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Could not delete the product" });
  }
};

module.exports = {
  getAllProductDetails,
  crateProduct,
  updateProduct,
  deleteProduct,
};
