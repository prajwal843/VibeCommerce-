const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');


// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
price REAL NOT NULL
);


CREATE TABLE IF NOT EXISTS cart_items (
id INTEGER PRIMARY KEY,
product_id INTEGER NOT NULL,
qty INTEGER NOT NULL DEFAULT 1,
created_at TEXT DEFAULT (datetime('now')),
FOREIGN KEY(product_id) REFERENCES products(id)
);
`);


// Seed products if empty
const row = db.prepare('SELECT COUNT(1) as c FROM products').get();
if (row.c === 0) {
const products = [
{ name: 'Vibe T‑Shirt', price: 499 },
{ name: 'Vibe Hoodie', price: 1299 },
{ name: 'Vibe Cap', price: 299 },
{ name: 'Wireless Earbuds', price: 2499 },
{ name: 'Water Bottle', price: 199 },
{ name: 'Notebook', price: 149 },
{ name: 'Sunglasses', price: 799 }
];
const insert = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
const insertMany = db.transaction((items) => {
for (const p of items) insert.run(p.name, p.price);
});
insertMany(products);
console.log('Seeded products.');
} else {
console.log('Products already seeded.');
}


console.log('DB initialized at ./db.sqlite');