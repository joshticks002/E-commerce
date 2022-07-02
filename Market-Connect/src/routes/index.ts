var express = require('express');
var router = express.Router();
import { Request, Response, NextFunction } from 'express'
const { getProducts, getProductById, addNewProduct, updateProduct, deleteProduct } = require('../controllers/productsControl')
// const { protect } = require('../middleware/authMiddleware')


router.route('/').get(getProducts).post(addNewProduct)
router.route('/:id').get(getProductById).delete(deleteProduct)

router.put('/:id', (req: Request, res: Response) => {
    updateProduct(req, res, req.params.id)
})

module.exports = router
/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
