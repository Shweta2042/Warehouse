const validateProductNameParam = (req, res, next) => {
    const { name } = req.params;
    if (!name) {
        return res.status(400).json({ error: 'Product name is required.' });
    }
    next();
};

const validateSellProductBody = (req, res, next) => {
    const { productName, quantity, id } = req.body;
    if (!id || !quantity) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }
    next();
};

const validateArtIdParam = (req, res, next) => {
    const { art_id } = req.params;
    if (!art_id) {
        return res.status(400).json({ error: 'Article ID is required.' });
    }
    next();
};

module.exports = {
    validateProductNameParam,
    validateSellProductBody,
    validateArtIdParam
};
