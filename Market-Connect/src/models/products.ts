const mongoModel = require("mongoose");

const dbSchema = new mongoModel.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    Quantity: {
      type: Number,
      required: [true, "What quantity to display"],
    },
    Description: {
      type: String,
      required: [true, "Please add a description for the product"],
    },
    price: {
      type: String,
      required: [true, "What is the price for the product?"],
    },
    size: {
      type: Number,
      required: [true, "Please include the size"],
    },
    "Amount Earned": {
      type: String,
      required: [true, "Please add the maker"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoModel.model("Products", dbSchema);