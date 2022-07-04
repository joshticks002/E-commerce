var express = require('express');
var router = express.Router();
import { Request, Response, NextFunction } from "express";

router.get('/home', (req: Request, res: Response) => {
    res.status(201).render("index", {
      title: "Home",
      "token": req.cookies.Token,
        "uid": req.cookies.Uid,
        "user": req.cookies.Username,
        "Type": req.cookies.Type || "none",
  })
});

router.get("/register", (req: Request, res: Response) => {
    res.status(201).render("register", {
       title: "Register",
       "token": req.cookies.Token,
         "uid": req.cookies.Uid,
         "user": req.cookies.Username,
         "Type": req.cookies.Type || "none",
    });
});

router.get("/login", (req: Request, res: Response) => {
   res.status(201).render("login", {
      title: "Login",
       "token": req.cookies.Token,
         "uid": req.cookies.Uid,
         "user": req.cookies.Username,
         "Type": req.cookies.Type || "none",
   });
});

module.exports = router;