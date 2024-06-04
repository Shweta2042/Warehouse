const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/upload-products', upload.single('file'), handleFileUploadAndDBConnection, async (req, res) => {
    try {
        const fileContents = fs.readFileSync(req.filePath, 'utf8');
        const products = JSON.parse(fileContents);
        const productCollection = req.database.collection(productsCollectionName);
        await processProducts(products, productCollection);
        res.json({ message: `Uploaded or updated ${products.length} products.` });
    } catch (error) {
        console.error("Error uploading products:", error);
        res.status(500).send("Error uploading products.");
    } finally {
        // Close the database connection
        await client.close();
    }
});

module.exports = router;