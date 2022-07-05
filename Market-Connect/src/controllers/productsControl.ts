const Products = require("../models/products");
import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const { newInput, updateInput } = require("../utils");

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const allProducts = await Products.find();
  res.status(201).render("market", {
    title: "All Product",
      "products": allProducts,
      "token": req.cookies.Token,
      "uid": req.cookies.Uid,
      "user": req.cookies.Username,
      "Type": req.cookies.Type || "none",
  });
});

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { srch } = req.body
  const allPrds = await Products.find({ type: srch });
  const items = await Products.find()
  const allItems = items.filter((p: { name: string | any[]; }) => p.name.includes(srch))
  
  res.status(201).render("market", {
    title: "All Product",
      "products": [...allPrds, ...allItems],
      "token": req.cookies.Token,
      "uid": req.cookies.Uid,
      "user": req.cookies.Username,
      "Type": req.cookies.Type || "none",
  });
});

const purchaseProducts = asyncHandler(async (req: Request, res: Response) => {

  res.status(200).render("purchase", {
    title: "Purchase Item",
    "token": req.cookies.Token,
    "uid": req.cookies.Uid,
    "user": req.cookies.Username,
    "Type": req.cookies.Type || "none",
  });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id);
    res.status(201).render("productInfo", {
      title: "New Product",
        "products": [product],
        "token": req.cookies.Token,
        "uid": req.cookies.Uid,
        "user": req.cookies.Username,
        "Type": req.cookies.Type || "none",
    });
  } catch (error) {
    res.status(404)
    throw new Error(`Product with id ${req.params.id} not found`);
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
  res.status(201).render("newproduct", {
    title: "New Product",
      "product": [addInput],
      "token": req.cookies.Token,
      "uid": req.cookies.Uid,
      "user": req.cookies.Username,
      "Type": req.cookies.Type || "none",
  });
});

const updateProduct = asyncHandler(
  async (req: Request, res: Response, id: string) => {
    try {
      const body: Product = req.body;
      console.log(body)

      // await updateInput().validateAsync({
      //   imageUrl: body.imageUrl,
      //   name: body.name,
      //   Quantity: body.Quantity,
      //   Description: body.Description,
      //   price: body.price,
      //   size: body.size,
      //   type: body.type,
      // });

      const theProduct = await Products.findById(id);
      console.log(theProduct)
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
      console.log(input)

      const updInput = await Products.findByIdAndUpdate(id, input, {
        new: true,
      });
      res.status(201).render("productInfo", {
        title: "New Product",
          "products": [updInput],
          "token": req.cookies.Token,
          "uid": req.cookies.Uid,
          "user": req.cookies.Username,
          "Type": req.cookies.Type || "none",
      });
    } catch (error) {
      res.status(404)
      throw new Error(`Product with id ${id} not found or invalid field(s) parameter`);
    }
  }
);

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await Products.findById(id);

    await product.remove();
    res.status(201)
    res.render('404', { title: "Successful", 
                        message:`${product.name} with id ${id} has been removed`,
                        "token": req.cookies.Token,
                        "uid": req.cookies.Uid,
                        "user": req.cookies.Username,
                        "Type": req.cookies.Type || "none",});
  } catch (error) {
    res.status(404)
      throw new Error(`Product with id ${id} not found`);
  }
});

module.exports = {
  getProductById,
  getProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
  purchaseProducts,
  searchProducts
};
function p(p: any, arg1: { name: any; }) {
  throw new Error("Function not implemented.");
}

