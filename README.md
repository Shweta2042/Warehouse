# Warehouse 

## Description
This warehouse software manages articles and products. Articles have an identification number, a name, and available stock. Products are made from different articles and have a name, price, and a list of articles with quantities.

## Installation
1. Make sure you have Node.js 18 installed.
2. Clone this repository.
3. Navigate to the project directory: `cd warehouse`.
4. Install dependencies: `npm install`.
5. Run the command: `npm start`.

## MongoDB Connection
1. Set up a MongoDB database (either locally or using a cloud service).
2. Create a `.env` file in the project root with the following variables:
   - `MONGODB_URI`: The connection string for your MongoDB database.
   - Other environment variables as needed (e.g., secret keys, API keys).

## Usage
1. Load articles from a file (e.g., `inventory.json`).
2. Load products from a file (e.g., `products.json`).
3. Implement the following functionality:
   - Get all products and their quantities available with the current inventory.
   - Remove (sell) a product and update the inventory accordingly.

## Running the Application
To start the application, run: `npm start`.

## Example API Endpoints
- `/articles`: Get all articles
- `/products`: Get all products
- `/products/:productId`: Get details of a specific product
- `/sell/`: Sell a product (update inventory)

## Contributing
Contributions are welcome! Please follow our contribution guidelines.

## License
This project is licensed under the MIT License.
