const express = require('express');
const router = express.Router();
const mainController = require('../components/product/controllers/mainController');
const { validateProductNameParam, validateSellProductBody, validateArtIdParam } = require('../middleware/validateParams');

router.get('/', mainController.renderIndex);
router.get('/products', mainController.getProducts);
router.get('/product/:name', validateProductNameParam , mainController.getProductById);
router.get('/article/:art_id', validateArtIdParam, mainController.getArticleById);
router.post('/upload-products', mainController.handleFileUploadAndDBConnection, mainController.uploadProducts);
router.post('/upload-articles', mainController.handleFileUploadAndDBConnection, mainController.uploadArticles);
router.post('/sell-product', validateSellProductBody ,mainController.sellProduct);

module.exports = router;
