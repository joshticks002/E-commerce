const mongoReview = require("mongoose");

const reviewSchema = new mongoReview.Schema(
  {
    productName: {
      type: String,
      required: [true],
    },
    userId: {
      type: String,
      required: [true],
    },
    rate: {
      type: Number,
      required: [true],
    },
    review: {
      type: String,
      required: [true, "Please add a review for the product"],
    }
  }
);

module.exports = mongoReview.model("Review", reviewSchema);
