const Model = require("../models/users");
const Viewable = require("../models/usersInfo");
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { userInfo, userDetails } = require("../utils");

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const allUsers = await Model.find();
  const filtered = allUsers.filter(
    (user: { User: boolean }) => user.User === true
  );
  res
    .status(201)
    .render("usersInfo", {
      title: "Users Info",
      users: [...filtered],
      token: req.cookies.Token,
      uid: req.cookies.Uid,
      user: req.cookies.Username,
      Type: req.cookies.Type,
    });
});

const getAgents = asyncHandler(async (req: Request, res: Response) => {
  const allAgents = await Model.find();
  const filtered = allAgents.filter(
    (user: { Agent: boolean }) => user.Agent === true
  );
  res
    .status(201)
    .render("agentInfo", {
      title: "Agents Info",
      users: [...filtered],
      token: req.cookies.Token,
      uid: req.cookies.Uid,
      user: req.cookies.Username,
      Type: req.cookies.Type,
    });
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  let isAgent = false;
  let isUser = false;
  let isAdmin = false;

  const body = req.body;
  await userInfo().validateAsync({
    username: body.username,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
    phone: body.phone,
    userType: body.userType,
  });

  if (body.password !== body.confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const { username, email, password, phone, userType } = req.body;

  // Check if user exists
  const userExists = await Model.find({ email: email.toLowerCase() });

  if (userExists.length > 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (userType.toLowerCase() === "agent") {
    isAgent = true;
  } else if (userType.toLowerCase() === "user") {
    isUser = true;
  } else if (userType.toLowerCase() === "admin") {
    const userAdmin = await Model.find({ Admin: true });
    if (userAdmin.length === 0) {
      isAdmin = true;
    } else {
      res.status(400);
      throw new Error("You cannot create an Admin Account");
    }
  }

  // Create user
  const user = await Model.create({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    balance: 0,
    products: [],
    cart: [],
    prevTransactions: [],
    User: isUser,
    Agent: isAgent,
    Admin: isAdmin,
    isBanned: false,
  });

  const viewableInfo = await Viewable.create({
    Uid: user._id,
    username,
    email: email.toLowerCase(),
    phone,
    products: [],
    cart: [],
    prevTransactions: [],
    User: isUser,
    Agent: isAgent,
    isBanned: false,
  });

  // register user
  if (user) {
    const mytoken = generateToken(user._id);
    let typeOfUser = "none";
    if (user.Admin === true) typeOfUser = "Admin";
    if (user.Agent === true) typeOfUser = "Agent";
    if (user.User === true) typeOfUser = "User";

    res.cookie("Token", mytoken);
    res.cookie("Uid", user._id);
    res.cookie("Username", user.username);
    res.cookie("Balance", user.balance);
    res.cookie("Type", typeOfUser);
    res.status(201).redirect("/home");
  }
});

const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const body = req.body;
  await userDetails().validateAsync({
    email: body.email,
    password: body.password,
  });

  // Check for user email
  const user = await Model.find({ email: email.toLowerCase() });

  if (user.length > 0 && (await bcrypt.compare(password, user[0].password))) {
    if (user[0].isBanned === false) {
      let typeOfUser = "none";
      if (user[0].Admin === true) typeOfUser = "Admin";
      if (user[0].Agent === true) typeOfUser = "Agent";
      if (user[0].User === true) typeOfUser = "User";

      const mytoken = generateToken(user[0]._id);
      res.cookie("Token", mytoken);
      res.cookie("Uid", user[0]._id);
      res.cookie("Username", user[0].username);
      res.cookie("Balance", user[0].balance);
      res.cookie("Type", typeOfUser);

      // res.status(201).json({Token: mytoken})
      res.status(201).redirect("/home");
    } else {
      res.status(400);
      throw new Error(
        "You have been banned from rendering service on this platform. Please contact the administrator."
      );
    }
  } else {
    res.status(400);
    throw new Error("Invalid username or password");
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("Token", "");
  res.cookie("Type", "");
  req.cookies.Token = "";
  req.cookies.Username = "";
  req.cookies.Uid = "";
  req.cookies.Balance = 0;
  req.cookies.Type = "none";

  res.status(201).redirect("/login");
});

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  getUsers,
  getAgents,
};
