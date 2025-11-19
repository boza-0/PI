CREATE DATABASE demo_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE demo_app;

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: seed example rows
INSERT INTO items (name, description, price) VALUES
('Wireless Mouse', 'Ergonomic 2.4GHz mouse', 19.99),
('Mechanical Keyboard', 'Blue switches, RGB', 89.50);
