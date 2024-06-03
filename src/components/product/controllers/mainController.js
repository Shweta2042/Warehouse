const productService = require('../../../services/productService');
const { ERRORS } = require('../../../utils/constants');
const logger = require('../../../utils/logger');


exports.renderIndex = (req, res) => {
    res.render('index');
};

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        logger.error(`${ERRORS.FETCH_PRODUCTS}: ${error.message}`);
        res.render('error', { message: ERRORS.FETCH_PRODUCTS });
        res.status(500).send(ERRORS.FETCH_PRODUCTS);
    }
};

exports.getProductById = async (req, res) => {
    const productName = req.params.name;
    try {
        const product = await productService.getProductById(productName);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('product-details', { product });
    } catch (error) {
        logger.error(`${ERRORS.FETCH_PRODUCT}: ${error.message}`);
        res.render('error', { message: ERRORS.FETCH_PRODUCT });
        res.status(500).send(ERRORS.FETCH_PRODUCT);
    }
};

exports.getArticleById = async (req, res) => {
    const artId = req.params.art_id;
    try {
        const article = await productService.getArticleById(artId);
        if (!article) {
            res.status(404).send({ message: "Article not found" });
            return;
        }
        res.json(article);
    } catch (error) {
        logger.error(`${ERRORS.FETCH_ARTICLE}: ${error.message}`);
        res.status(500).send(ERRORS.FETCH_ARTICLE);
    }
};

exports.handleFileUploadAndDBConnection = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400);
            res.render('error', { message: "File is not there"});
            return;
        }
        const filePath = file.path;
        const { database } = await productService.handleFileUploadAndDBConnection(filePath);
        req.filePath = filePath;
        req.database = database;
        next();
    } catch (error) {
        logger.error(`${ERRORS.FILE_UPLOAD_DB_CONNECTION}: ${error.message}`);
        res.status(500);
        res.render('error', { message: error.message});
    }
};

exports.uploadProducts = async (req, res) => {
    try {
        const numberOfProducts = await productService.uploadProducts(req.filePath, req.database);
        res.render('success', { message: `Uploaded or updated ${numberOfProducts} products.` });
    } catch (error) {
        logger.error(`${ERRORS.UPLOAD_PRODUCTS}: ${error.message}`);
        res.status(500).send(ERRORS.UPLOAD_PRODUCTS);
        res.render('error', { message: ERRORS.UPLOAD_PRODUCTS });
    }
};

exports.uploadArticles = async (req, res) => {
    try {
        const numberOfArticles = await productService.uploadArticles(req.filePath, req.database);
        res.render('success', { message: `Uploaded or updated ${numberOfArticles} articles.` });
    } catch (error) {
        logger.error(`${ERRORS.UPLOAD_ARTICLES}: ${error.message}`);
        res.render('error', { message: ERRORS.UPLOAD_ARTICLES });
        res.status(500).send(ERRORS.UPLOAD_ARTICLES);
    }
};

exports.sellProduct = async (req, res) => {
    const { productName, quantity, id } = req.body;
    try {
        const message = await productService.sellProductService(productName, quantity, id);
        res.json({ message });
    } catch (error) {
        logger.error(`${ERRORS.SELL_PRODUCT}: ${error.message}`);
        res.render('error', { message: error.message });
        res.status(500).json({ error: error.message });
    }
};
