const express = require("express");
const router = express.Router();
import { Request, Response, NextFunction } from "express";
const { userLogin, registerUser, logoutUser, getUsers, getAgents, getCartItems } = require("../controllers/usercontroller");
// const {purchaseProducts} = require('../controllers/productsControl')
const { protect, adminProtect } = require('../middlewares/auth')

/* GET users listing. */
router.get("/users", adminProtect, getUsers);
router.get("/agents", adminProtect, getAgents);
router.route("/login").post(userLogin);
router.get("/cart", protect, getCartItems);
router.get("/products", protect, getCartItems);
router.route("/register").post(registerUser);
router.get("/logout", protect, logoutUser);

module.exports = router;
