CREATE DATABASE IF NOT EXISTS quanao;
USE quanao;

-- ========================
-- 1. Roles
-- ========================
CREATE TABLE Roles (
    id INT PRIMARY KEY,
    name TEXT
);


-- ========================
-- 2. Accounts
-- ========================
CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email TEXT,
    password TEXT,
    roleId INT,
    birthday DATE,
    status INT,
    createdDate DATE,
    FOREIGN KEY (roleId) REFERENCES Roles(id)
);

-- ========================
-- 3. Customers
-- ========================
CREATE TABLE Customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) UNIQUE,
    password TEXT,
    gender ENUM('Nam','Nu'),
    dateOfBirth DATE,
    createdDate DATE
);

-- ========================
-- 4. Categories
-- ========================
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT
);

-- ========================
-- 5. Products
-- ========================
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    price FLOAT,
    description TEXT,
    categoryId INT,
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

-- ========================
-- 6. Sizes
-- ========================
CREATE TABLE Sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sizeName VARCHAR(10)
);

-- ========================
-- 7. ProductSizes (n - n)
-- ========================
CREATE TABLE ProductSizes (
    productId INT,
    sizeId INT,
    quantity INT,
    PRIMARY KEY (productId, sizeId),
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id)
);

-- ========================
-- 8. Suppliers
-- ========================
CREATE TABLE Suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT,
    address VARCHAR(255),
    phone VARCHAR(20)
);


-- ========================
-- 9. ImportReceipts
-- ========================
CREATE TABLE ImportReceipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    createdDate DATE,
    supplierId INT,
    accountId INT,
    total FLOAT,
    status ENUM('Đang xử lý','Đã xác nhận') DEFAULT 'Đang xử lý',
    FOREIGN KEY (supplierId) REFERENCES Suppliers(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id)
);

-- ========================
-- 10. ImportDetails
-- ========================
CREATE TABLE ImportDetails (
    importReceiptId INT,
    productId INT,
    quantity INT,
    price FLOAT,
    PRIMARY KEY (importReceiptId, productId),
    FOREIGN KEY (importReceiptId) REFERENCES ImportReceipts(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- ========================
-- 11. Status
-- ========================
CREATE TABLE Status (
    id INT PRIMARY KEY,
    name TEXT,
    description TEXT
);

-- ========================
-- 12. Address
-- ========================
CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ward TEXT,
    city TEXT,
    houseNumber TEXT
);

-- ========================
-- 13. Orders
-- ========================
CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    createdDate DATE,
    shippedDate DATE,
    shippingAddressId INT,
    statusId INT,
    cost FLOAT,
    customerId INT,
    FOREIGN KEY (shippingAddressId) REFERENCES Address(id),
    FOREIGN KEY (statusId) REFERENCES Status(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);

-- ========================
-- 14. OrderDetails
-- ========================
CREATE TABLE OrderDetails (
    orderId INT,
    productId INT,
    price FLOAT,
    quantity INT,
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- ========================
-- 15. Carts
-- ========================
CREATE TABLE Carts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customerId INT,
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);

-- ========================
-- 16. CartDetails
-- ========================
CREATE TABLE CartDetails (
    cartId INT,
    productId INT,
    quantity INT,
    PRIMARY KEY (cartId, productId),
    FOREIGN KEY (cartId) REFERENCES Carts(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
);

-- ========================
-- 17. FunctionalCategories
-- ========================
CREATE TABLE FunctionalCategories (
    functionId INT PRIMARY KEY AUTO_INCREMENT,
    functionName TEXT,
    status INT
);

-- ========================
-- 18. RoleDetails
-- ========================
CREATE TABLE RoleDetails (
    roleId INT,
    functionId INT,
    action TEXT,
    PRIMARY KEY (roleId, functionId),
    FOREIGN KEY (roleId) REFERENCES Roles(id),
    FOREIGN KEY (functionId) REFERENCES FunctionalCategories(functionId)
);

-- ========================
-- 19. CustomerAddress
-- ========================
CREATE TABLE CustomerAddress (
    addressId INT,
    customerId INT,
    isDefault BOOLEAN,
    PRIMARY KEY (addressId, customerId),
    FOREIGN KEY (addressId) REFERENCES Address(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);

-- ========================
-- 20. ProductImages
-- ========================
CREATE TABLE ProductImages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    productId INT,
    imageUrl TEXT,
    isMain BOOLEAN,
    FOREIGN KEY (productId) REFERENCES Products(id)
);


INSERT INTO Roles (id, name) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Customer');

INSERT INTO Accounts (email, password, roleId, birthday, status, createdDate) VALUES
('admin@example.com', '123456', 1, '1990-01-01', 1, CURDATE()),
('staff1@example.com', '123456', 2, '1995-05-10', 1, CURDATE()),
('staff2@example.com', '123456', 2, '1998-12-20', 1, CURDATE());

INSERT INTO Customers (fullName, email, phone, password, gender, dateOfBirth, createdDate) VALUES
('Nguyen Van A', 'a@example.com', '0900000001', '123456', 'Nam', '2000-01-01', CURDATE()),
('Tran Thi B', 'b@example.com', '0900000002', '123456', 'Nu', '1999-09-09', CURDATE()),
('Le Van C', 'c@example.com', '0900000003', '123456', 'Nam', '1995-03-15', CURDATE());

INSERT INTO Categories (name) VALUES
('Áo thun'),
('Quần jeans'),
('Áo khoác'),
('Đầm nữ');

INSERT INTO Products (name, price, description, categoryId) VALUES
('Áo thun nam cổ tròn', 150000, 'Áo thun cotton thoáng mát', 1),
('Áo khoác gió nam', 350000, 'Áo khoác chống nước', 3),
('Quần jeans nữ form ôm', 280000, 'Chất liệu co giãn', 2),
('Đầm suông nữ', 320000, 'Đầm suông thoải mái', 4);

INSERT INTO Sizes (sizeName) VALUES
('S'),
('M'),
('L'),
('XL');

INSERT INTO ProductSizes (productId, sizeId, quantity) VALUES
(1, 1, 20),
(1, 2, 30),
(2, 2, 25),
(2, 3, 15),
(3, 2, 20),
(3, 3, 10),
(4, 2, 18),
(4, 3, 12);

INSERT INTO Suppliers (name, address, phone) VALUES
('Công ty Dệt May ABC', '123 Đường May, Quận 1, TP.HCM', '0901111222'),
('Nhà phân phối Quần Áo XYZ', '456 Đường Thời Trang, Quận 5, TP.HCM', '0903333444');

INSERT INTO ImportReceipts (createdDate, supplierId, accountId, total, status) VALUES
('2025-01-10', 1, 1, 5000000, 'Đã xác nhận'),
('2025-01-15', 2, 2, 7000000, 'Đang xử lý');

INSERT INTO ImportDetails (importReceiptId, productId, quantity, price) VALUES
(1, 1, 50, 90000),
(1, 2, 30, 200000),
(2, 3, 40, 180000),
(2, 4, 25, 220000);

INSERT INTO Status (id, name, description) VALUES
(1, 'Pending', 'Chờ xử lý'),
(2, 'Shipping', 'Đang giao'),
(3, 'Completed', 'Hoàn thành'),
(4, 'Cancelled', 'Đã hủy');

INSERT INTO Address (ward, city, houseNumber) VALUES
('Phường 1', 'Hồ Chí Minh', '123 Nguyễn Trãi'),
('Phường 5', 'Hồ Chí Minh', '45 Cách Mạng'),
('Phường Đông Hòa', 'Bình Dương', '12/3 Khu phố 2');

INSERT INTO Orders (createdDate, shippedDate, shippingAddressId, statusId, cost, customerId) VALUES
('2025-02-01', '2025-02-03', 1, 3, 450000, 1),
('2025-02-03', NULL, 2, 1, 680000, 2),
('2025-02-05', '2025-02-07', 3, 3, 320000, 3);

INSERT INTO OrderDetails (orderId, productId, price, quantity) VALUES
(1, 1, 150000, 2),
(1, 3, 280000, 1),
(2, 2, 350000, 1),
(3, 4, 320000, 1);

INSERT INTO Carts (customerId) VALUES
(1),
(2),
(3);

INSERT INTO CartDetails (cartId, productId, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 1),
(3, 4, 1);

INSERT INTO FunctionalCategories (functionName, status) VALUES
('Quản lý sản phẩm', 1),
('Quản lý đơn hàng', 1),
('Quản lý khách hàng', 1),
('Quản lý phân quyền', 1);


-- INSERT INTO RoleDetails (roleId, functionId, action) VALUES
-- (1, 1, 'CRUD'),
-- (1, 2, 'CRUD'),
-- (1, 3, 'CRUD'),
-- (1, 4, 'CRUD'),
-- (2, 1, 'READ,CREATE,UPDATE'),
-- (2, 2, 'READ,UPDATE'),
-- (3, 1, 'READ'),
-- (3, 2, 'READ');

INSERT INTO CustomerAddress (addressId, customerId, isDefault) VALUES
(1, 1, TRUE),
(2, 2, TRUE),
(3, 3, TRUE);

INSERT INTO ProductImages (productId, imageUrl, isMain) VALUES
(1, '/uploads/product1_main.jpg', TRUE),
(1, '/uploads/product1_1.jpg', FALSE),
(2, '/uploads/product2_main.jpg', TRUE),
(3, '/uploads/product3_main.jpg', TRUE),
(4, '/uploads/product4_main.jpg', TRUE);

