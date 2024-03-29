const express = require("express");
const router = express.Router();
const {
  userLogin,
  registerUser,
  logoutUser,
  getUsers,
  getAgents,
  banAgent,
  getCartItems,
  getReviewPage,
  getAgentItems,
  getTransactions,
  submitReview
} = require("../controllers/usercontroller");
const { protect, adminProtect } = require("../middlewares/auth");

/* GET users listing. */
router.get("/users", adminProtect, getUsers);
router.get("/agents", adminProtect, getAgents);
router.route("/login").post(userLogin);
router.get("/cart", protect, getCartItems);
router.get("/products", protect, getAgentItems);
router.get("/orders", protect, getTransactions);
router.route("/register").post(registerUser);
router.get("/logout", protect, logoutUser);
router.post("/ban/agent", adminProtect, banAgent);
router.post("/review/product", protect, getReviewPage);
router.post("/rate/product", protect, submitReview);

module.exports = router;
