// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite DB
const db = new Database('./db.sqlite');

// ✅ Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY,
  productId INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(productId) REFERENCES products(id)
);
`);

// ✅ Seed products if empty
const row = db.prepare('SELECT COUNT(1) as c FROM products').get();
if (row.c === 0) {
  const products = [
    { name: 'Vibe T-Shirt', price: 499 },
    { name: 'Vibe Hoodie', price: 1299 },
    { name: 'Vibe Cap', price: 299 },
    { name: 'Wireless Earbuds', price: 2499 },
    { name: 'Water Bottle', price: 199 },
    { name: 'Notebook', price: 149 },
    { name: 'Sunglasses', price: 799 },
  ];

  const insert = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  const insertMany = db.transaction((items) => {
    for (const p of items) insert.run(p.name, p.price);
  });
  insertMany(products);
  console.log('✅ Seeded products.');
} else {
  console.log('✅ Products already exist in DB.');
}

// --- Get all products ---
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// --- Get Cart ---
app.get('/api/cart', (req, res) => {
  const cartItems = db
    .prepare(
      `SELECT cart.id, products.name, products.price, cart.qty
       FROM cart
       JOIN products ON cart.productId = products.id`
    )
    .all();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ cartItems, total });
});

// --- Add to Cart ---
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  const existing = db.prepare('SELECT * FROM cart WHERE productId = ?').get(productId);

  if (existing) {
    db.prepare('UPDATE cart SET qty = qty + ? WHERE productId = ?').run(qty, productId);
  } else {
    db.prepare('INSERT INTO cart (productId, qty) VALUES (?, ?)').run(productId, qty);
  }

  res.json({ message: '✅ Added to cart' });
});

// --- Remove from Cart ---
app.delete('/api/cart/:id', (req, res) => {
  db.prepare('DELETE FROM cart WHERE id = ?').run(req.params.id);
  res.json({ message: '🗑️ Item removed' });
});

// --- Checkout ---
app.post('/api/checkout', (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const timestamp = new Date().toISOString();

  db.prepare('DELETE FROM cart').run();
  res.json({ message: '✅ Checkout complete', total, timestamp });
});

// --- Default route ---
app.get('/', (req, res) => {
  res.send('E-commerce API is running 🚀');
});

// --- Start server ---
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
