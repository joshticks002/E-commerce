const Products = require('../models/products')
import { Request, Response } from 'express'
const Joi = require('joi')
const { newInput, updateInput } = require('../utils')

interface Product { 
    name: string; 
    Quantity: string; 
    Description: string; 
    price: number; 
    size: string; 
    Make: string; 
}

const getProducts = async(req: Request, res: Response) => {
    const allProducts = await Products.find()
    res.send(allProducts)
}

const getProductById = async(req: Request, res: Response) => {
    try{
        const product = await Products.findById(req.params.id)
        res.send(product)
    } catch(error) {
        res.status(404).send(`Product with id ${req.params.id} not found`)
    }
}

const addNewProduct = async(req: Request, res: Response) => {
    try{
        const body: Product = req.body
        await newInput().validateAsync({
            "name": body.name,
            "Quantity": body.Quantity,
            "Description": body.Description,
            "price": body.price,
            "size": body.size,
        })

        const input = {
            "name": body.name,
            "Quantity": body.Quantity,
            "Description": body.Description,
            "price": `$${body.price}`,
            "size": body.size,
            "Amount Earned": 0
        }
    
        const addInput = await Products.create(input)
        res.send(addInput)
    } catch(error) {
        res.status(404).send({message: "All fields are required"})
    }
}

const updateProduct = async(req: Request, res: Response, id: string) => {
    try{
        const body: Product = req.body

        await updateInput().validateAsync({
            "name": body.name,
            "Quantity": body.Quantity,
            "Description": body.Description,
            "price": body.price,
            "size": body.size,
        })

        const theProduct = await Products.findById(id)
        const input = {
            "name": body.name || theProduct.name,
            "Quantity": body.Quantity || theProduct.Quantity,
            "Description": body.Description || theProduct.Description,
            "price": `$${body.price}` || theProduct.price,
            "size": body.size || theProduct.size,
            "Amount Earned": theProduct["Amount Earned"], 
        }

        const updInput = await Products.findByIdAndUpdate(id, input, { new: true})
        res.send(updInput)
    } catch(error) {
        res.status(404).send(`Product with id ${id} not found or invalid field(s) parameter`)
    }  
}

const deleteProduct = async(req: Request, res: Response,) => {
    const id = req.params.id
    try{
        const product = await Products.findById(id);

        await product.remove();
        res.status(201).json({ message: `${product.name} with id ${id} has been removed` })
    } catch(error) {
        res.status(404).send(`Product with id ${id} not found`)
    }
}

module.exports = {
    getProductById,
    getProducts,
    addNewProduct,
    updateProduct,
    deleteProduct,
}