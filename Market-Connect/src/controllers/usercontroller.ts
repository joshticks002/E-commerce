const Model = require('../models/users')
import { Request, Response } from "express";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Joi = require('joi')
const { userInfo, userDetails } = require('../utils')

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    })
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    let isAgent = false
    let isUser = false
    let isAdmin = false

    const body = req.body
    await userInfo().validateAsync({
        "username": body.username,
        "email": body.email,
        "password": body.password,
        "phone": body.phone,
        "userType": body.userType
    })
    
    const { username, 
      email, 
      password,
      phone,
      userType } = req.body

    // Check if user exists
    const userExists = await Model.find({ email: email.toLowerCase()})
  
    if (userExists.length > 0) {
      res.status(400)
      throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    if (userType.toLowerCase() === 'agent') {
      isAgent = true
    } else if (userType.toLowerCase() === 'user') {
      isUser = true
    }  else if (userType.toLowerCase() === 'admin') {
      const userAdmin = await Model.find({ Admin: true})
      if (userAdmin.length === 0) {
        isAdmin = true
      } else {
        res.status(400)
        throw new Error('You cannot create an Admin Account')
      }
    } else {
      res.status(400)
      throw new Error('Specify a user type: Agent or User')
    }

    // Create user
    const user = await Model.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      balance: '$1000',
      products: [],
      User: isUser,
      Agent: isAgent,
      Admin: isAdmin,
      isBanned: false
    })
    console.log(user)

    // register user
    if (user) {
      const mytoken = generateToken(user._id)
      res.cookie('Token', mytoken)
      res.cookie('Uid', user._id)
      res.cookie('Username', user.username)
      
      res.status(201).json({user, Token: mytoken})
      // res.status(201).redirect('/home')
    }
})

const userLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const body = req.body
    await userDetails().validateAsync({
        "email": body.email,
        "password": body.password
    })
  
    // Check for user email
    const user = await Model.find({ email: email.toLowerCase()})
    
    if ((user.length > 0) && (await bcrypt.compare(password, user[0].password))) {
      const mytoken = generateToken(user._id)
      console.log(user)
      res.cookie('Token', mytoken)
      res.cookie('Uid', user._id)
      res.cookie('Username', user.username)
      
      res.status(201).json({Token: mytoken})
      // res.redirect('/home')
    } else {
      res.status(400)
      throw new Error('Invalid username or password')
    }
})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    req.cookies.Token = ''
    req.cookies.Username = ''
    req.cookies._id = ''

    res.status(201).redirect('/api/products')
    // res.redirect('/home')
})

module.exports = {
    registerUser,
    userLogin,
    logoutUser
}
