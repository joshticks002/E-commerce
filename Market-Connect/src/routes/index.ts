var express = require('express');
var router = express.Router();
import { Request, Response, NextFunction } from 'express'
const { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct } = require('../controllers/productsControl')
const { protect } = require('../middlewares/auth')


router.route('/').get(getProducts).post(protect, addNewProduct)
router.route('/:id').get(protect, getProductById).delete(protect, deleteProduct)

router.put('/:id', protect, (req: Request, res: Response) => {
    updateProduct(req, res, req.params.id)
})

module.exports = router;
