DROP DATABASE IF EXISTS quanao;
CREATE DATABASE IF NOT EXISTS quanao;
USE quanao;

-- ========================
-- 1. Roles
-- ========================
-- ========================
-- 1. Roles (Vai trò/Nhóm quyền)
-- ========================
CREATE TABLE Roles (
    id INT PRIMARY KEY COMMENT 'Mã nhóm quyền',
    name VARCHAR(100) COMMENT 'Tên nhóm quyền (Admin, Seller, Customer...)'
) COMMENT='Bảng định nghĩa các nhóm quyền trong hệ thống';

-- ========================
-- 2. Accounts (Tài khoản quản trị/nhân viên)
-- ========================
CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã tài khoản',
    fullName VARCHAR(255) NOT NULL COMMENT 'Họ tên nhân viên',
    email VARCHAR(100) COMMENT 'Email đăng nhập (Duy nhất)',
    password VARCHAR(255) COMMENT 'Mật khẩu đã mã hóa',
    roleId INT COMMENT 'FK: Mã nhóm quyền',
    birthday DATE COMMENT 'Ngày sinh nhân viên',
    status INT DEFAULT 1 COMMENT 'Trạng thái: 1-Hoạt động, 0-Bị khóa',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày tạo tài khoản',
    FOREIGN KEY (roleId) REFERENCES Roles(id)
) COMMENT='Bảng tài khoản dành cho Admin và Nhân viên';

-- ========================
-- 3. Customers (Khách hàng mua lẻ)
-- ========================
CREATE TABLE Customers (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã tài khoản khách hàng',
    fullName VARCHAR(100) COMMENT 'Họ và tên đầy đủ',
    email VARCHAR(100) UNIQUE COMMENT 'Email khách hàng ',
    phone VARCHAR(10) UNIQUE COMMENT 'Số điện thoại liên lạc',
    password VARCHAR(255) COMMENT 'Mật khẩu đăng nhập',
    gender ENUM('Nam','Nu') COMMENT 'Giới tính',
    dateOfBirth DATE COMMENT 'Ngày sinh khách hàng',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày tạo'
) COMMENT='Bảng thông tin khách hàng mua sắm trên hệ thống';

-- ========================
-- 4. Categories (Danh mục sản phẩm)
-- ========================
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã danh mục',
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục '
) COMMENT='Bảng phân loại sản phẩm';

-- ========================
-- 5. Products (Sản phẩm)
-- ========================
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL COMMENT 'Mã sản phẩm',
    name VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm hiển thị',
    price FLOAT NOT NULL COMMENT 'Giá bán niêm yết (VNĐ)',
    description TEXT NOT NULL COMMENT 'Mô tả chi tiết sản phẩm',
    categoryId INT COMMENT 'FK: Thuộc danh mục nào',
    status INT DEFAULT 1 NOT NULL COMMENT 'Trạng thái: 1-Đang bán, 0-Ngừng kinh doanh',
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
) COMMENT='Bảng lưu trữ thông tin chung của sản phẩm';

-- ========================
-- 6. Sizes (Kích cỡ)
-- ========================
CREATE TABLE Sizes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã kích cỡ',
    sizeName VARCHAR(10) NOT NULL COMMENT 'Tên kích cỡ (S, M, L, XL)'
) COMMENT='Bảng danh sách các kích thước có sẵn';

-- ========================
-- 7. ProductSizes (Chi tiết biến thể sản phẩm)
-- ========================
CREATE TABLE ProductSizes (
    productId INT COMMENT 'FK: Mã sản phẩm',
    sizeId INT COMMENT 'FK: Mã kích cỡ',
    quantity INT NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho thực tế cho size này',
    PRIMARY KEY (productId, sizeId),
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (sizeId) REFERENCES Sizes(id)
) COMMENT='Bảng trung gian quản lý số lượng tồn kho theo từng Size của Sản phẩm';

-- ========================
-- 8. Suppliers (Nhà cung cấp)
-- ========================
CREATE TABLE Suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã nhà cung cấp',
    name VARCHAR(255) COMMENT 'Tên công ty/nhà cung cấp',
    address VARCHAR(255) COMMENT 'Địa chỉ nhà cung cấp',
    phone VARCHAR(20) COMMENT 'Số điện thoại nhà cung cấp'
) COMMENT='Bảng danh sách đối tác cung cấp hàng hóa';

-- ========================
-- 9. ImportReceipts (Phiếu nhập kho)
-- ========================
CREATE TABLE ImportReceipts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã phiếu nhập',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày lập phiếu',
    supplierId INT COMMENT 'FK: Nhập từ nhà cung cấp nào',
    accountId INT COMMENT 'FK: Mã tài khoản tạo phiếu nhập',
    total FLOAT DEFAULT 0 COMMENT 'Tổng tiền thanh toán cho phiếu nhập',
    status ENUM('Đang xử lý','Đã xác nhận') DEFAULT 'Đang xử lý' COMMENT 'Trạng thái phiếu nhập',
    FOREIGN KEY (supplierId) REFERENCES Suppliers(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id)
) COMMENT='Bảng quản lý các lần nhập hàng vào kho';

-- ========================
-- 10. ImportDetails (Chi tiết phiếu nhập)
-- ========================
CREATE TABLE ImportDetails (
    importReceiptId INT COMMENT 'FK: Thuộc phiếu nhập nào',
    productId INT COMMENT 'FK: Nhập sản phẩm nào',
    quantity INT COMMENT 'Số lượng nhập vào',
    price FLOAT COMMENT 'Giá sản phẩm nhập',
    PRIMARY KEY (importReceiptId, productId),
    FOREIGN KEY (importReceiptId) REFERENCES ImportReceipts(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
) COMMENT='Bảng chi tiết từng sản phẩm trong phiếu nhập kho';

-- ========================
-- 11. Status (Trạng thái đơn hàng)
-- ========================
CREATE TABLE Status (
    id INT PRIMARY KEY COMMENT 'Mã trạng thái',
    name VARCHAR(50) COMMENT 'Tên trạng thái (Mới, Đang giao, Đã giao, Hủy)',
    description TEXT COMMENT 'Mô tả ý nghĩa trạng thái'
) COMMENT='Bảng từ điển các trạng thái xử lý đơn hàng (Order Status)';

-- ========================
-- 12. Address (Địa chỉ chung)
-- ========================
CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã địa chỉ',
    ward VARCHAR(255) COMMENT 'Phường/Xã',
    city VARCHAR(255) COMMENT 'Tỉnh/Thành phố',
    houseNumber VARCHAR(255) COMMENT 'Số nhà, tên đường'
) COMMENT='Bảng lưu trữ thông tin địa chỉ vật lý';

-- ========================
-- 13. Orders (Đơn hàng)
-- ========================
CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã đơn hàng',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày đặt hàng',
    shippedDate DATE COMMENT 'Ngày giao hàng thành công',
    shippingAddressId INT COMMENT 'FK: Địa chỉ giao hàng',
    statusId INT COMMENT 'FK: Trạng thái hiện tại của đơn (link bảng Status)',
    cost FLOAT COMMENT 'Tổng giá trị đơn hàng (sau khi cộng/trừ phí)',
    customerId INT COMMENT 'FK: Khách hàng đặt đơn',
    FOREIGN KEY (shippingAddressId) REFERENCES Address(id),
    FOREIGN KEY (statusId) REFERENCES Status(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
) COMMENT='Bảng thông tin đơn hàng bán ra';

-- ========================
-- 14. OrderDetails (Chi tiết đơn hàng)
-- ========================
CREATE TABLE OrderDetails (
    orderId INT COMMENT 'FK: Mã đơn hàng',
    productId INT COMMENT 'FK: Mã sản phẩm',
    price FLOAT COMMENT 'Giá bán',
    quantity INT COMMENT 'Số lượng sản phẩm mua',
    PRIMARY KEY (orderId, productId),
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
) COMMENT='Bảng lưu chi tiết sản phẩm trong đơn hàng';

-- ========================
-- 15. Carts (Giỏ hàng)
-- ========================
CREATE TABLE Carts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã giỏ hàng',
    customerId INT COMMENT 'FK: Giỏ hàng của khách nào',
    FOREIGN KEY (customerId) REFERENCES Customers(id)
) COMMENT='Bảng quản lý phiên giỏ hàng của người dùng';

-- ========================
-- 16. CartDetails (Chi tiết giỏ hàng)
-- ========================
CREATE TABLE CartDetails (
    cartId INT COMMENT 'FK: Mã giỏ hàng',
    productId INT COMMENT 'FK: Sản phẩm trong giỏ',
    quantity INT DEFAULT 1 COMMENT 'Số lượng muốn mua',
    PRIMARY KEY (cartId, productId),
    FOREIGN KEY (cartId) REFERENCES Carts(id),
    FOREIGN KEY (productId) REFERENCES Products(id)
) COMMENT='Bảng lưu các sản phẩm khách đang chọn';

-- ========================
-- 17. FunctionalCategories (Danh mục chức năng hệ thống)
-- ========================
CREATE TABLE FunctionalCategories (
    functionId INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã chức năng',
    functionName VARCHAR(100) COMMENT 'Tên chức năng (VD: Quản lý User, Quản lý Đơn hàng)',
    status INT DEFAULT 1 COMMENT '1-Hoạt động, 0-Tạm khóa'
) COMMENT='Bảng danh sách các module chức năng trong trang Admin';

-- ========================
-- 18. RoleDetails (Phân quyền chi tiết)
-- ========================
CREATE TABLE RoleDetails (
    roleId INT COMMENT 'FK: Nhóm quyền nào',
    functionId INT COMMENT 'FK: Được truy cập chức năng nào',
    action VARCHAR(100) COMMENT 'Quyền hạn cụ thể (VD: CREATE, READ, UPDATE, DELETE)',
    PRIMARY KEY (roleId, functionId),
    FOREIGN KEY (roleId) REFERENCES Roles(id),
    FOREIGN KEY (functionId) REFERENCES FunctionalCategories(functionId)
) COMMENT='Bảng ma trận phân quyền chi tiết (ACL)';

-- ========================
-- 19. CustomerAddress (Sổ địa chỉ khách hàng)
-- ========================
CREATE TABLE CustomerAddress (
    addressId INT COMMENT 'FK: Mã địa chỉ',
    customerId INT COMMENT 'FK: Khách hàng sở hữu',
    isDefault BOOLEAN DEFAULT FALSE COMMENT 'Là địa chỉ mặc định? (True/False)',
    PRIMARY KEY (addressId, customerId),
    FOREIGN KEY (addressId) REFERENCES Address(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
) COMMENT='Bảng liên kết Nhiều-Nhiều quản lý danh sách địa chỉ của khách';

-- ========================
-- 20. ProductImages (Ảnh sản phẩm)
-- ========================
CREATE TABLE ProductImages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã hình ảnh',
    productId INT COMMENT 'FK: Thuộc sản phẩm nào',
    imageUrl VARCHAR(100) NOT NULL COMMENT 'Đường dẫn/Tên file ảnh',
    isMain BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Là ảnh đại diện chính? (True/False)',
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
) COMMENT='Bảng thư viện ảnh của sản phẩm';

INSERT INTO Roles (id, name) VALUES
(1, 'Admin'),
(2, 'Staff');

INSERT INTO Accounts (fullName,email, password, roleId, birthday, status, createdDate) VALUES
('Nguyễn Văn A','admin@gmail.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 1, '1990-01-01', 1, CURDATE()),
('Nguyễn Văn B','staff1@example.com', '123456', 2, '1995-05-10', 1, CURDATE()),
('Nguyễn Văn C','staff2@example.com', '123456', 2, '1998-12-20', 1, CURDATE());

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
