const Products = require("../models/products");
import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const { newInput, updateInput } = require("../utils");

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const allProducts = await Products.find();
  res.send(allProducts);
});

const purchaseProducts = asyncHandler(async (req: Request, res: Response) => {
  // const balance =
  res.status(200).render("purchase");
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id);
    res.send(product);
  } catch (error) {
    res.status(404).send(`Product with id ${req.params.id} not found`);
  }
});

const addNewProduct = asyncHandler(async (req: Request, res: Response) => {
  const body: Product = req.body;
  await newInput().validateAsync({
    imageUrl: body.imageUrl,
    name: body.name,
    Quantity: body.Quantity,
    Description: body.Description,
    price: body.price,
    size: body.size,
    type: body.type,
  });

  const input = {
    imageUrl: body.imageUrl,
    name: body.name,
    Quantity: body.Quantity,
    Description: body.Description,
    price: `$${body.price}`,
    size: body.size.toUpperCase(),
    type: body.type,
    "Amount Earned": 0,
  };

  const addInput = await Products.create(input);
  res.send(addInput);
});

const updateProduct = asyncHandler(
  async (req: Request, res: Response, id: string) => {
    try {
      const body: Product = req.body;

      await updateInput().validateAsync({
        imageUrl: body.imageUrl,
        name: body.name,
        Quantity: body.Quantity,
        Description: body.Description,
        price: body.price,
        size: body.size,
        type: body.type,
      });

      const theProduct = await Products.findById(id);
      const input = {
        imageUrl: body.imageUrl || theProduct.imageUrl,
        name: body.name || theProduct.name,
        Quantity: body.Quantity || theProduct.Quantity,
        Description: body.Description || theProduct.Description,
        price: `$${body.price}` || theProduct.price,
        size: body.size.toUpperCase() || theProduct.size,
        type: body.type || theProduct.type,
        "Amount Earned": theProduct["Amount Earned"],
      };

      const updInput = await Products.findByIdAndUpdate(id, input, {
        new: true,
      });
      res.send(updInput);
    } catch (error) {
      res
        .status(404)
        .send(`Product with id ${id} not found or invalid field(s) parameter`);
    }
  }
);

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await Products.findById(id);

    await product.remove();
    res
      .status(201)
      .json({ message: `${product.name} with id ${id} has been removed` });
  } catch (error) {
    res.status(404).send(`Product with id ${id} not found`);
  }
});

module.exports = {
  getProductById,
  getProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
  purchaseProducts,
};
