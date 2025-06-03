-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(255) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
                             );

-- ========== REWARDS ==========
CREATE TABLE IF NOT EXISTS rewards (
                                       id SERIAL PRIMARY KEY,
                                       name VARCHAR(255) NOT NULL,
    points_cost INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
                             );

-- ========== TRANSACTIONS ==========
CREATE TABLE IF NOT EXISTS transactions (
                                            id SERIAL PRIMARY KEY,
                                            type VARCHAR(10) CHECK (type IN ('earn', 'redeem')) NOT NULL,
    points INT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
                       CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- ========== PURCHASES ==========
CREATE TABLE IF NOT EXISTS purchases (
                                         id SERIAL PRIMARY KEY,
                                         amount FLOAT NOT NULL,
                                         date TIMESTAMP WITH TIME ZONE NOT NULL,
                                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                         deleted_at TIMESTAMP WITH TIME ZONE,
                                         user_id INT NOT NULL,
                                         CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

-- ========== INSERT 3 REWARDS BASE ==========
INSERT INTO rewards (name, points_cost)
SELECT 'Gift Card $10', 500
    WHERE NOT EXISTS (SELECT 1 FROM rewards WHERE name = 'Gift Card $10');

INSERT INTO rewards (name, points_cost)
SELECT 'Discount Coupon', 300
    WHERE NOT EXISTS (SELECT 1 FROM rewards WHERE name = 'Discount Coupon');

INSERT INTO rewards (name, points_cost)
SELECT 'Free Shipping', 200
    WHERE NOT EXISTS (SELECT 1 FROM rewards WHERE name = 'Free Shipping');
