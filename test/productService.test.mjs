import { expect } from 'chai';
import 'dotenv/config';
import { before, describe, it } from 'mocha';
import { connectToDatabase, getArticleById, getProductById, getProducts } from '../src/services/productService.js';

describe('Product Service', () => {
    let sandbox;
    let databaseMock;
    const productsCollectionName = 'products';
    before(async () => {
        await connectToDatabase();
    });

    it('should get all products', async () => {
        const products = await getProducts();
        expect(products).to.be.an('array');
        expect(products.length).to.be.greaterThan(0);
    });

    it('should get product by name', async () => {
        const productName = 'Dining Chair';
        const product = await getProductById(productName);
        expect(product).to.be.an('object');
        expect(product.name).to.equal(productName);
    });

    it('should get article by id', async () => {
        const artId = 1;
        const article = await getArticleById(artId);
        expect(article).to.be.an('object');
        expect(article.art_id).to.equal(artId);
    });
});
