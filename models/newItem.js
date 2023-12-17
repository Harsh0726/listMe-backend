const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newItemSchema = new Schema(
  {
    item_name: {
      type: "String",
    },
    item_image: {
      type: "String",
    },

    item_price: {
      type: "String",
    },
    item_catagory: {
      type: "String",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bnitem", newItemSchema);
