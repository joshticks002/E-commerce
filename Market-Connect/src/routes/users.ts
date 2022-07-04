const express = require("express");
const router = express.Router();
import { Request, Response, NextFunction } from "express";
const { userLogin, registerUser, logoutUser, getUsers } = require("../controllers/usercontroller");
const {purchaseProducts} = require('../controllers/productsControl')
const { protect, adminProtect } = require('../middlewares/auth')

/* GET users listing. */
router.get("/all", adminProtect, getUsers);

router.route("/login").post(userLogin);

router.route("/register").post(registerUser);
router.get("/logout", logoutUser);

module.exports = router;
