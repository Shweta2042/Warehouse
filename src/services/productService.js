const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const helper = require('../utils/helper');
const { getProductsFromRedis, deleteProductsFromRedis } = require('../utils/redisFunction');
const redisClient = require('../utils/redisClient');

const uri = process.env.URI;
const dbName = process.env.DB_NAME;
const productsCollectionName = process.env.productCollectionName;
const inventoryCollectionName = process.env.inventoryCollectionName;

const options = {
    maxPoolSize: 50, 
    wtimeoutMS: 2500,
    useNewUrlParser: true
};

const client = new MongoClient(uri, options);

let database; 

async function connectToDatabase() {
    try {
        await client.connect();
        database = client.db(dbName);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}


async function getProducts() {
    if (!database) await connectToDatabase();
    const collection = database.collection(productsCollectionName);
    const products = await collection.find({}).toArray();
    // await redisClient.set(cacheKey, JSON.stringify(products));
    return products;
}

async function getProductById(productName) {
    if (!database) await connectToDatabase();
    const collection = database.collection(productsCollectionName);
    const product = await collection.findOne({ name: productName });
    return product;
}

async function getArticleById(artId) {
    if (!database) await connectToDatabase();
    const collection = database.collection(inventoryCollectionName);
    const article = await collection.findOne({ art_id: artId });
    return article;
}

async function handleFileUploadAndDBConnection(filePath) {
    if (!database) await connectToDatabase();
    return { filePath, database };
}

async function uploadProducts(filePath, database) {
    await deleteProductsFromRedis();
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileContents);
    const productCollection = database.collection(productsCollectionName);
    await helper.processProducts(products, productCollection);
    return products.length;
}

async function uploadArticles(filePath, database) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const articles = JSON.parse(fileContents);
    const inventoryCollection = database.collection(inventoryCollectionName);
    await helper.processArticles(articles, inventoryCollection);
    return articles.length;
}

async function sellProductService(productName, quantity, id) {
    if (!database) await connectToDatabase();
    const productCollection = database.collection(productsCollectionName);
    const inventoryCollection = database.collection(inventoryCollectionName);

    const product = await productCollection.findOne({ _id: new ObjectId(id) });
    if (!product) {
            throw new Error('Product not found.');
    }

    const updatedArticles = product.contain_articles.map(article => ({
        art_id: article.art_id,
        amount_of: parseInt(article.amount_of) * parseInt(quantity)
    }));

    for (const article of updatedArticles) {
        const inventoryItem = await inventoryCollection.findOne({ art_id: article.art_id });
        if (!inventoryItem || parseInt(inventoryItem.stock) < article.amount_of) {
             throw new Error(`Not enough stock for article ID ${article.art_id}`);
        }
    }

    for (const article of updatedArticles) {
        await inventoryCollection.updateOne(
            { art_id: article.art_id },
            { $inc: { stock: -article.amount_of } }
        );
    }

    return `Successfully sold ${quantity} of ${productName}.`;
}

module.exports = {
    connectToDatabase,
    getProducts,
    getProductById,
    getArticleById,
    handleFileUploadAndDBConnection,
    uploadProducts,
    uploadArticles,
    sellProductService
};
