var express = require("express");
var router = express.Router();
import { Request, Response, NextFunction } from "express";
import { userLogin, registerUser } from "../controllers/usercontroller";

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

router.route("/login").post(userLogin);

router.route("/register").post(registerUser);

module.exports = router;
