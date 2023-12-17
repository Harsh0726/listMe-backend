const express = require("express");

const {
  getAllProductDetails,
  crateProduct,
  updateProduct,
  deleteProduct,
} = require("../controler/adminControllers");

const router = express.Router();

router.get("/getDetails", getAllProductDetails);
router.post("/createProduct", crateProduct);
router.post("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
