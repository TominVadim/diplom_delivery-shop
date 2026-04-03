-- Таблица products (из ProductCardProps)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    img TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    rating_rate DECIMAL(3,1) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    weight TEXT,
    quantity INTEGER DEFAULT 0
);

-- Таблица users (расширенная для авторизации)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    birth_date DATE,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица purchases (связь пользователей и товаров)
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица articles (из ArticleCardProps)
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    img TEXT NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
