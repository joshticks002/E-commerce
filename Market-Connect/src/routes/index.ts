var express = require('express');
var router = express.Router();
import { Request, Response } from 'express'
const { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct, purchaseProducts, searchProducts } = require('../controllers/productsControl')
const { protect, adminProtect } = require('../middlewares/auth')


router.route('/').get(getProducts).post(protect, addNewProduct)
router.route('/purchase').get(purchaseProducts)
router.route('/:id').get(protect, getProductById).delete(protect, deleteProduct)
router.post('/name', searchProducts)
router.put('/update/:id', adminProtect, (req: Request, res: Response) => {
    updateProduct(req, res, req.params.id)
})

module.exports = router;