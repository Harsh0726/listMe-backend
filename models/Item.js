const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      require: true,
    },
    item: {
      type: String,
      max: 100,
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    quntity: {
      type: String,
      require: true,
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("newItems", ItemSchema);
