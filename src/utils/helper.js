const updateInventoryStock = async (inventoryCollection, name, artId, stockToAdd, operation) => {
    const inventoryItem = await inventoryCollection.findOne({ art_id: artId });
    if (inventoryItem) {
        let newStock = 0;
        if (operation === '+') {
            newStock = inventoryItem.stock + stockToAdd;
        } else if (operation === '-') {
            newStock = inventoryItem.stock - stockToAdd;
            if (newStock <= 0) {
                throw new Error(`Quantity of product ${name} cannot be zero or negative.`);
            }
        } else {
            console.error("Invalid operation. Please specify '+' or '-'.");
            return;
        }
        await inventoryCollection.updateOne(
            { art_id: artId },
            { $set: { stock: newStock } },
            { upsert: true }
        );
        console.log(`Updated stock of art_id ${artId} to ${newStock}`);
    } else {
        await inventoryCollection.insertOne(
            { art_id: artId, stock: stockToAdd, name: name },
        );
        console.log(`Article with art_id ${artId} new added`);
    }
};

const processProducts = async (products, productCollection) => {
    for (const product of products) {
        const existingProduct = await productCollection.findOne({ name: product.name });
        if (!existingProduct) {
            await productCollection.insertOne(product);
            console.log(`Inserted new product: ${product.name}`);
        } else {
            console.log(`Old product: ${product.name}`);
        }
    }
};

const processArticles = async (articles, inventoryCollection) => {
    for (const article of articles) {
        const artId = article.art_id;
        const stockToAdd = article.stock;
        const name = article.name;
        await updateInventoryStock(inventoryCollection, name, artId, stockToAdd, "+");
    }
};

const sellProduct = async (productCollection, inventoryCollection, productName, quantity) => {
    const product = await productCollection.findOne({ name: productName });
    if (!product) {
        throw new Error(`Product with name ${productName} not found.`);
    }

    const articleUpdates = [];
    for (const article of product.contain_articles) {
        const artId = article.art_id;
        const name = article.name;
        const amountNeeded = article.amount_of * quantity;
        const inventoryItem = await inventoryCollection.findOne({ art_id: artId });

        if (!inventoryItem || inventoryItem.stock < amountNeeded) {
            throw new Error(`Product ${productName} is out of stock due to insufficient stock of article with art_id ${artId}.`);
        }

        articleUpdates.push({ artId, amountNeeded, name });
    }

    for (const { artId, amountNeeded, name } of articleUpdates) {
        await updateInventoryStock(inventoryCollection, name, artId, amountNeeded, '-');
    }

    console.log(`Sold ${quantity} of ${productName}`);
};

module.exports = {
    processProducts,
    processArticles,
    sellProduct,
    updateInventoryStock
};