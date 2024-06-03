const redis = require('redis');
const client = redis.createClient();

async function getProductsFromRedis() {
    return new Promise((resolve, reject) => {
        client.get('products', (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply ? JSON.parse(reply) : null);
            }
        });
    });
}


async function deleteProductsFromRedis() {
    return new Promise((resolve, reject) => {
        client.del('products', (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

module.exports = {
    getProductsFromRedis,
    deleteProductsFromRedis
};
