DROP DATABASE IF EXISTS quanao;
CREATE DATABASE IF NOT EXISTS quanao;
USE quanao;

-- ========================
-- 1. Roles
-- ========================
CREATE TABLE Roles (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);


-- ========================
-- 2. Accounts
-- ========================
CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    password VARCHAR(255),
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
    phone VARCHAR(10) UNIQUE,
    password VARCHAR(255),
    gender ENUM('Nam','Nu'),
    dateOfBirth DATE,
    createdDate DATE
);

-- ========================
-- 4. Categories
-- ========================
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

-- ========================
-- 5. Products
-- ========================
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    price FLOAT,
    description TEXT,
    categoryId INT,
    status INT,
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
    name VARCHAR(255),
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
    name VARCHAR(50),
    description TEXT
);

-- ========================
-- 12. Address
-- ========================
CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ward VARCHAR(255),
    city VARCHAR(255),
    houseNumber VARCHAR(255)
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
    functionName VARCHAR(100),
    status INT
);

-- ========================
-- 18. RoleDetails
-- ========================
CREATE TABLE RoleDetails (
    roleId INT,
    functionId INT,
    action VARCHAR(100),
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
    imageUrl VARCHAR(100),
    isMain BOOLEAN,
    FOREIGN KEY (productId) REFERENCES Products(id)
);


INSERT INTO Roles (id, name) VALUES
(1, 'Admin'),
(2, 'Staff'),

INSERT INTO Accounts (email, password, roleId, birthday, status, createdDate) VALUES
('admin@gmail.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 1, '1990-01-01', 1, CURDATE()),
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

INSERT INTO Products (name, price, description, categoryId,status) VALUES
('Áo thun nam cổ tròn', 150000, 'Áo thun nam cổ tròn được làm từ vải cotton cao cấp, mềm mại, thoáng khí và thấm hút mồ hôi tốt. Thiết kế tối giản phù hợp mặc hàng ngày, đi chơi hoặc tập luyện. Giặt giữ form lâu, không bai nhão và không gây kích ứng da.', 1,1),

('Áo khoác gió nam', 350000, 'Áo khoác gió nam với chất liệu chống nước và chống bám bụi, mang lại sự thoải mái và bảo vệ hiệu quả trước thời tiết xấu. Thiết kế hiện đại, nhẹ, dễ gấp gọn mang theo. Phù hợp đi làm, du lịch hay hoạt động ngoài trời.', 3,1),

('Quần jeans nữ form ôm', 280000, 'Quần jeans nữ form ôm với chất liệu denim co giãn 4 chiều giúp tôn dáng và tạo cảm giác thoải mái suốt cả ngày. Thiết kế thời trang, dễ phối với áo thun, áo sơ mi hoặc áo kiểu. Phù hợp đi học, đi làm và đi chơi.', 2,1),

('Áo khoác nữ', 320000, 'Áo khoác nữ thời trang với chất liệu mềm mại, giữ ấm tốt và tạo cảm giác thoải mái khi mặc. Thiết kế thanh lịch phù hợp nhiều phong cách từ năng động đến sang trọng. Thích hợp sử dụng khi thời tiết lạnh hoặc khi đi làm, đi chơi.', 4,1);


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
(1, '/uploads/product1_main.jpg', 1),
(1, '/uploads/product1_2.jpg', 0),
(1, '/uploads/1764740390102-pro1imgtest.jpg', 0),
(2, '/uploads/product2_main.jpg', 1),
(3, '/uploads/1764694489894-product6_main.jpg', 1),
(3, '/uploads/1764694489909-product6_1.jpg', 0),
(3, '/uploads/1764694489919-product6_2.jpg', 0),
(4, '/uploads/1764693514844-swelb0635_dbc196b9427143dabde76567453a4a9f_master.jpg', 1),
(4, '/uploads/1764693514846-1_010469a27497440ea1dd174f4a255229_master.jpg', 0),
(4, '/uploads/1764693514849-pro1.jpg', 0),
(4, '/uploads/1764693514859-pro2.jpg', 0),
(4, '/uploads/1764693514869-pro3.jpg', 0);
