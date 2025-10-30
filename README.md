Mock E-Commerce Cart

This is a simple full stack shopping cart application built using React, Node.js (Express), and SQLite.
It allows users to view products, add them to the cart, see the total price, and do a mock checkout.

Features

View a list of products

Add or remove items from the cart

See total price in the cart

Mock checkout (no real payment)

Simple and responsive design

Tech Stack

Frontend: React

Backend: Node.js + Express

Database: SQLite

How to Run
1. Clone the project
git clone https://github.com/<your-username>/mock-ecom-cart.git
cd mock-ecom-cart

2. Setup the backend
cd server
npm install
node index.js


This will start the backend on http://localhost:4000

3. Setup the frontend
cd ../client
npm install
npm start


This will start the frontend on http://localhost:3000

API Endpoints
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/cart	Get cart items
POST	/api/cart	Add item to cart
DELETE	/api/cart/:id	Remove item from cart
POST	/api/checkout	Mock checkout
Folder Structure
mock-ecom-cart/
│
├── client/       
│   ├── src/
│   ├── components/
│   └── styles.css
│
├── server/      
│   └── index.js
│
└── db.sqlite     

How it Works

Products are fetched from the backend (SQLite database).

Users can add products to their cart.

Cart shows all added items and total price.

Checkout clears the cart and shows a mock receipt.
