require('dotenv').config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

// Replace with your actual values from the Azure Portal
const uri = process.env.URI
const dbName = process.env.DB_NAME

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function uploadData(collectionName, filePath) {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    await collection.deleteMany({});
    console.log(`Deleted documents from ${collectionName}`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const result = await collection.insertMany(data);
    console.log(`Inserted ${result.insertedCount} documents into ${collectionName}`);
  } catch (error) {
    console.error("Error uploading data:", error);
  } finally {
    await client.close();
  }
}

async function main() {
  await uploadData('articles', './inventory.json');
  await uploadData('products', './products.json');
  console.log("Data uploaded successfully!");
}

main().catch(error => {
  console.error("Error in main function:", error);
});
