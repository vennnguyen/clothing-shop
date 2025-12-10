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
) COMMENT = 'Bảng định nghĩa các nhóm quyền trong hệ thống';
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
) COMMENT = 'Bảng tài khoản dành cho Admin và Nhân viên';
-- ========================
-- 3. Customers (Khách hàng mua lẻ)
-- ========================
CREATE TABLE Customers (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã tài khoản khách hàng',
    fullName VARCHAR(100) COMMENT 'Họ và tên đầy đủ',
    email VARCHAR(100) UNIQUE COMMENT 'Email khách hàng ',
    phone VARCHAR(10) UNIQUE COMMENT 'Số điện thoại liên lạc',
    password VARCHAR(255) COMMENT 'Mật khẩu đăng nhập',
    gender ENUM('Nam', 'Nu') COMMENT 'Giới tính',
    dateOfBirth DATE COMMENT 'Ngày sinh khách hàng',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày tạo'
) COMMENT = 'Bảng thông tin khách hàng mua sắm trên hệ thống';
-- ========================
-- 4. Categories (Danh mục sản phẩm)
-- ========================
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã danh mục',
    name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục '
) COMMENT = 'Bảng phân loại sản phẩm';
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
) COMMENT = 'Bảng lưu trữ thông tin chung của sản phẩm';
-- ========================
-- 6. Sizes (Kích cỡ)
-- ========================
CREATE TABLE Sizes (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã kích cỡ',
    sizeName VARCHAR(10) NOT NULL COMMENT 'Tên kích cỡ (S, M, L, XL)'
) COMMENT = 'Bảng danh sách các kích thước có sẵn';
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
) COMMENT = 'Bảng trung gian quản lý số lượng tồn kho theo từng Size của Sản phẩm';
-- ========================
-- 8. Suppliers (Nhà cung cấp)
-- ========================
CREATE TABLE Suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã nhà cung cấp',
    name VARCHAR(255) COMMENT 'Tên công ty/nhà cung cấp',
    address VARCHAR(255) COMMENT 'Địa chỉ nhà cung cấp',
    phone VARCHAR(20) COMMENT 'Số điện thoại nhà cung cấp'
) COMMENT = 'Bảng danh sách đối tác cung cấp hàng hóa';
-- ========================
-- 9. ImportReceipts (Phiếu nhập kho)
-- ========================
CREATE TABLE ImportReceipts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã phiếu nhập',
    createdDate DATE DEFAULT (CURRENT_DATE) COMMENT 'Ngày lập phiếu',
    supplierId INT COMMENT 'FK: Nhập từ nhà cung cấp nào',
    accountId INT COMMENT 'FK: Mã tài khoản tạo phiếu nhập',
    total FLOAT DEFAULT 0 COMMENT 'Tổng tiền thanh toán cho phiếu nhập',
    status ENUM('Đang xử lý', 'Đã xác nhận') DEFAULT 'Đang xử lý' COMMENT 'Trạng thái phiếu nhập',
    FOREIGN KEY (supplierId) REFERENCES Suppliers(id),
    FOREIGN KEY (accountId) REFERENCES Accounts(id)
) COMMENT = 'Bảng quản lý các lần nhập hàng vào kho';
-- ========================
-- 10. ImportDetails (Chi tiết phiếu nhập)
-- ========================
CREATE TABLE ImportDetails (
    importReceiptId INT COMMENT 'FK: Thuộc phiếu nhập nào',
    productId INT COMMENT 'FK: Nhập sản phẩm nào',
    sizeId INT COMMENT 'FK: Size của sản phẩm',
    quantity INT COMMENT 'Số lượng nhập vào',
    price FLOAT COMMENT 'Giá nhập của sản phẩm theo size',
    PRIMARY KEY (importReceiptId, productId, sizeId),
    FOREIGN KEY (importReceiptId) REFERENCES ImportReceipts(id),
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id)
) COMMENT = 'Bảng chi tiết sản phẩm trong phiếu nhập (bao gồm size)';
-- ========================
-- 11. Status (Trạng thái đơn hàng)
-- ========================
CREATE TABLE Status (
    id INT PRIMARY KEY COMMENT 'Mã trạng thái',
    name VARCHAR(50) COMMENT 'Tên trạng thái (Mới, Đang giao, Đã giao, Hủy)',
    description TEXT COMMENT 'Mô tả ý nghĩa trạng thái'
) COMMENT = 'Bảng từ điển các trạng thái xử lý đơn hàng (Order Status)';
-- ========================
-- 12. Address (Địa chỉ chung)
-- ========================
CREATE TABLE Address (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã địa chỉ',
    ward VARCHAR(255) COMMENT 'Phường/Xã',
    city VARCHAR(255) COMMENT 'Tỉnh/Thành phố',
    houseNumber VARCHAR(255) COMMENT 'Số nhà, tên đường'
) COMMENT = 'Bảng lưu trữ thông tin địa chỉ vật lý';
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
) COMMENT = 'Bảng thông tin đơn hàng bán ra';
-- ========================
-- 14. OrderDetails (Chi tiết đơn hàng)
-- ========================
CREATE TABLE OrderDetails (
    orderId INT COMMENT 'FK: Mã đơn hàng',
    productId INT COMMENT 'FK: Mã sản phẩm',
    sizeId INT COMMENT 'FK: Mã size',
    price FLOAT COMMENT 'Giá bán',
    quantity INT COMMENT 'Số lượng sản phẩm mua',
    PRIMARY KEY (orderId, productId,sizeId),
    FOREIGN KEY (orderId) REFERENCES Orders(id),
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id)
) COMMENT='Bảng lưu chi tiết sản phẩm trong đơn hàng';

-- ========================
-- 15. Carts (Giỏ hàng)
-- ========================
CREATE TABLE Carts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã giỏ hàng',
    customerId INT COMMENT 'FK: Giỏ hàng của khách nào',
    FOREIGN KEY (customerId) REFERENCES Customers(id)
) COMMENT = 'Bảng quản lý phiên giỏ hàng của người dùng';
-- ========================
-- 16. CartDetails (Chi tiết giỏ hàng)
-- ========================
CREATE TABLE CartDetails (
    cartId INT COMMENT 'FK: Mã giỏ hàng',
    productId INT COMMENT 'FK: Sản phẩm trong giỏ',
    quantity INT DEFAULT 1 COMMENT 'Số lượng muốn mua',
    sizeId INT COMMENT 'Mã size sản phẩm',
    PRIMARY KEY (cartId, productId, sizeId),
    FOREIGN KEY (cartId) REFERENCES Carts(id),
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (sizeId) REFERENCES Sizes(id)
) COMMENT='Bảng lưu các sản phẩm khách đang chọn';

-- ========================
-- 17. FunctionalCategories (Danh mục chức năng hệ thống)
-- ========================
CREATE TABLE FunctionalCategories (
    functionId INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã chức năng',
    functionName VARCHAR(100) COMMENT 'Tên chức năng (VD: Quản lý User, Quản lý Đơn hàng)',
    status INT DEFAULT 1 COMMENT '1-Hoạt động, 0-Tạm khóa'
) COMMENT = 'Bảng danh sách các module chức năng trong trang Admin';
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
) COMMENT = 'Bảng ma trận phân quyền chi tiết (ACL)';
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
) COMMENT = 'Bảng liên kết Nhiều-Nhiều quản lý danh sách địa chỉ của khách';
-- ========================
-- 20. ProductImages (Ảnh sản phẩm)
-- ========================
CREATE TABLE ProductImages (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Mã hình ảnh',
    productId INT COMMENT 'FK: Thuộc sản phẩm nào',
    imageUrl VARCHAR(100) NOT NULL COMMENT 'Đường dẫn/Tên file ảnh',
    isMain BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Là ảnh đại diện chính? (True/False)',
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
) COMMENT = 'Bảng thư viện ảnh của sản phẩm';
INSERT INTO Roles (id, name)
VALUES (1, 'Admin'),
    (2, 'Staff');
INSERT INTO Accounts (
        fullName,
        email,
        password,
        roleId,
        birthday,
        status,
        createdDate
    )
VALUES (
        'Nguyễn Văn A',
        'admin@gmail.com',
        '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi',
        1,
        '1990-01-01',
        1,
        CURDATE()
    ),
    (
        'Nguyễn Văn B',
        'staff1@example.com',
        '123456',
        2,
        '1995-05-10',
        1,
        CURDATE()
    ),
    (
        'Nguyễn Văn C',
        'staff2@example.com',
        '123456',
        2,
        '1998-12-20',
        1,
        CURDATE()
    );
INSERT INTO Customers (
        fullName,
        email,
        phone,
        password,
        gender,
        dateOfBirth,
        createdDate
    )
VALUES (
        'Nguyen Van A',
        'a@example.com',
        '0900000001',
        '123456',
        'Nam',
        '2000-01-01',
        DATE_SUB(CURDATE(), INTERVAL 365 DAY)
    ),
    (
        'Tran Thi B',
        'b@example.com',
        '0900000002',
        '123456',
        'Nu',
        '1999-09-09',
        DATE_SUB(CURDATE(), INTERVAL 300 DAY)
    ),
    (
        'Le Van C',
        'c@example.com',
        '0900000003',
        '123456',
        'Nam',
        '1995-03-15',
        DATE_SUB(CURDATE(), INTERVAL 250 DAY)
    ),
    (
        'Pham Thi D',
        'd@example.com',
        '0900000004',
        '123456',
        'Nu',
        '1998-07-20',
        DATE_SUB(CURDATE(), INTERVAL 200 DAY)
    ),
    (
        'Hoang Van E',
        'e@example.com',
        '0900000005',
        '123456',
        'Nam',
        '1992-11-11',
        DATE_SUB(CURDATE(), INTERVAL 150 DAY)
    ),
    (
        'Nguyen Thi F',
        'f@example.com',
        '0900000006',
        '123456',
        'Nu',
        '2001-05-05',
        DATE_SUB(CURDATE(), INTERVAL 120 DAY)
    ),
    (
        'Tran Van G',
        'g@example.com',
        '0900000007',
        '123456',
        'Nam',
        '1997-02-28',
        DATE_SUB(CURDATE(), INTERVAL 100 DAY)
    ),
    (
        'Le Thi H',
        'h@example.com',
        '0900000008',
        '123456',
        'Nu',
        '2003-08-15',
        DATE_SUB(CURDATE(), INTERVAL 80 DAY)
    ),
    (
        'Pham Van I',
        'i@example.com',
        '0900000009',
        '123456',
        'Nam',
        '1996-12-01',
        DATE_SUB(CURDATE(), INTERVAL 60 DAY)
    ),
    (
        'Hoang Thi J',
        'j@example.com',
        '0900000010',
        '123456',
        'Nu',
        '2002-04-10',
        DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    );
INSERT INTO Categories (name)
VALUES ('Áo thun'),
    ('Quần jeans'),
    ('Áo khoác'),
    ('Đầm nữ');
INSERT INTO Products (name, price, description, categoryId, status)
VALUES (
        'Áo thun nam cổ tròn',
        150000,
        'Áo thun nam cổ tròn được làm từ vải cotton cao cấp, mềm mại, thoáng khí và thấm hút mồ hôi tốt. Thiết kế tối giản phù hợp mặc hàng ngày, đi chơi hoặc tập luyện. Giặt giữ form lâu, không bai nhão và không gây kích ứng da.',
        1,
        1
    ),
    (
        'Áo khoác gió nam',
        350000,
        'Áo khoác gió nam với chất liệu chống nước và chống bám bụi, mang lại sự thoải mái và bảo vệ hiệu quả trước thời tiết xấu. Thiết kế hiện đại, nhẹ, dễ gấp gọn mang theo. Phù hợp đi làm, du lịch hay hoạt động ngoài trời.',
        3,
        1
    ),
    (
        'Quần jeans nữ form ôm',
        280000,
        'Quần jeans nữ form ôm với chất liệu denim co giãn 4 chiều giúp tôn dáng và tạo cảm giác thoải mái suốt cả ngày. Thiết kế thời trang, dễ phối với áo thun, áo sơ mi hoặc áo kiểu. Phù hợp đi học, đi làm và đi chơi.',
        2,
        1
    ),
    (
        'Áo khoác nữ',
        320000,
        'Áo khoác nữ thời trang với chất liệu mềm mại, giữ ấm tốt và tạo cảm giác thoải mái khi mặc. Thiết kế thanh lịch phù hợp nhiều phong cách từ năng động đến sang trọng. Thích hợp sử dụng khi thời tiết lạnh hoặc khi đi làm, đi chơi.',
        4,
        1
    );
INSERT INTO Sizes (sizeName)
VALUES ('S'),
    ('M'),
    ('L'),
    ('XL');
INSERT INTO ProductSizes (productId, sizeId, quantity)
VALUES (1, 1, 20),
    (1, 2, 30),
    (2, 2, 25),
    (2, 3, 15),
    (3, 2, 20),
    (3, 3, 10),
    (4, 2, 18),
    (4, 3, 12);
INSERT INTO Suppliers (name, address, phone)
VALUES (
        'Công ty Dệt May ABC',
        '123 Đường May, Quận 1, TP.HCM',
        '0901111222'
    ),
    (
        'Nhà phân phối Quần Áo XYZ',
        '456 Đường Thời Trang, Quận 5, TP.HCM',
        '0903333444'
    );
INSERT INTO ImportReceipts (
        createdDate,
        supplierId,
        accountId,
        total,
        status
    )
VALUES ('2025-01-10', 1, 1, 5000000, 'Đã xác nhận'),
    ('2025-01-15', 2, 2, 7000000, 'Đang xử lý');
INSERT INTO ImportDetails (
        importReceiptId,
        productId,
        sizeId,
        quantity,
        price
    )
VALUES (1, 1, 1, 50, 90000),
    (1, 2, 1, 30, 200000),
    (2, 3, 1, 40, 180000),
    (2, 4, 1, 25, 220000);
INSERT INTO Status (id, name, description)
VALUES (1, 'Pending', 'Chờ xử lý'),
    (2, 'Shipping', 'Đang giao'),
    (3, 'Completed', 'Hoàn thành'),
    (4, 'Cancelled', 'Đã hủy');
INSERT INTO Address (ward, city, houseNumber)
VALUES ('Phường 1', 'Hồ Chí Minh', '123 Nguyễn Trãi'),
    ('Phường 5', 'Hồ Chí Minh', '45 Cách Mạng'),
    (
        'Phường Đông Hòa',
        'Bình Dương',
        '12/3 Khu phố 2'
    ),
    ('Phường Tân Bình','Hồ Chí Minh','98 Hoàng Văn Thụ'),
    ('Phường 2','Hà Nội','12 Lê Duẩn'),
    ('Phường Thọ Xương','Bắc Ninh','5 Trần Phú'),
    ('Phường 8','Đà Nẵng','77 Nguyễn Văn Linh'),
    ('Phường 3','Cần Thơ','200 Trần Hưng Đạo'),
    ('Phường Hoà Cường','Đà Nẵng','33 Núi Thành'),
    ('Phường 4','Hải Phòng','9 Đặng Thanh Ngữ');
INSERT INTO Orders (createdDate, shippedDate, shippingAddressId, statusId, cost, customerId) VALUES
('2024-01-05', '2024-01-07', 1, 3, 450000, 1),
('2024-01-15', '2024-01-17', 2, 3, 680000, 2),
('2024-01-20', '2024-01-22', 3, 3, 320000, 3),
('2024-02-03', NULL, 1, 1, 520000, 4),
('2024-02-10', '2024-02-12', 2, 3, 780000, 5),
('2024-02-18', '2024-02-20', 3, 3, 450000, 1),
('2024-03-05', '2024-03-07', 1, 3, 620000, 2),
('2024-03-12', '2024-03-14', 2, 3, 740000, 3),
('2024-03-25', NULL, 3, 1, 580000, 4),
('2024-04-02', '2024-04-04', 1, 3, 810000, 5),
('2024-04-15', '2024-04-17', 2, 3, 650000, 6),
('2024-04-28', '2024-04-30', 3, 3, 720000, 7),
('2024-05-08', NULL, 1, 2, 490000, 8),
('2024-05-20', '2024-05-22', 2, 3, 880000, 1),
('2024-06-03', '2024-06-05', 3, 3, 540000, 2),
('2024-06-15', '2024-06-17', 1, 3, 950000, 3),
('2024-06-28', '2024-06-30', 2, 3, 620000, 4),
('2024-07-10', NULL, 3, 1, 710000, 5),
('2024-07-22', '2024-07-24', 1, 3, 480000, 6),
('2024-08-05', '2024-08-07', 2, 3, 820000, 7),
('2024-08-18', '2024-08-20', 3, 3, 670000, 8),
('2024-09-02', '2024-09-04', 1, 3, 740000, 9),
('2024-09-15', NULL, 2, 2, 590000, 10),
('2024-09-28', '2024-09-30', 3, 3, 920000, 1),
('2024-10-10', '2024-10-12', 1, 3, 510000, 2),
('2024-10-25', '2024-10-27', 2, 3, 850000, 3),
('2024-11-05', '2024-11-07', 3, 3, 680000, 4),
('2024-11-20', NULL, 1, 1, 760000, 5),
('2024-12-02', '2024-12-04', 2, 3, 620000, 6),
('2024-12-15', '2024-12-17', 3, 3, 890000, 7);

INSERT INTO OrderDetails (orderId, productId, sizeId, price, quantity) VALUES
(1, 1, 1, 150000, 2),
(1, 3, 2, 280000, 1),
(2, 2, 3, 350000, 1),
(3, 4, 4, 320000, 1),
(4, 1, 2, 150000, 2),
(4, 2, 1, 350000, 1),
(5, 3, 3, 280000, 2),
(5, 4, 2, 320000, 1),
(6, 1, 1, 150000, 3),
(6, 4, 3, 320000, 1),
(7, 2, 2, 350000, 1),
(7, 3, 1, 280000, 2),
(8, 1, 3, 150000, 2),
(8, 4, 1, 320000, 2),
(9, 2, 1, 350000, 1),
(9, 3, 2, 280000, 1),
(10, 1, 2, 150000, 3),
(10, 3, 3, 280000, 2),
(11, 4, 1, 320000, 1),
(11, 2, 3, 350000, 1),
(12, 1, 1, 150000, 2),
(12, 2, 2, 350000, 2),
(13, 3, 2, 280000, 1),
(13, 4, 3, 320000, 1),
(14, 1, 3, 150000, 2),
(14, 2, 1, 350000, 3),
(15, 3, 1, 280000, 1),
(15, 4, 2, 320000, 1),
(16, 1, 2, 150000, 3),
(16, 3, 3, 280000, 1),
(17, 2, 1, 350000, 1),
(17, 4, 3, 320000, 2),
(18, 1, 1, 150000, 2),
(18, 3, 2, 280000, 2),
(19, 2, 2, 350000, 1),
(19, 4, 1, 320000, 1),
(20, 1, 3, 150000, 2),
(20, 2, 3, 350000, 1),
(21, 3, 1, 280000, 2),
(21, 4, 2, 320000, 1),
(22, 1, 2, 150000, 3),
(22, 2, 1, 350000, 2),
(23, 3, 2, 280000, 1),
(23, 4, 3, 320000, 1),
(24, 1, 1, 150000, 2),
(24, 3, 3, 280000, 2),
(25, 2, 1, 350000, 1),
(25, 4, 2, 320000, 1),
(26, 1, 3, 150000, 2),
(26, 2, 2, 350000, 1),
(27, 3, 1, 280000, 3),
(27, 4, 3, 320000, 1),
(28, 1, 2, 150000, 2),
(28, 2, 3, 350000, 2),
(29, 3, 2, 280000, 1),
(29, 4, 1, 320000, 1),
(30, 1, 1, 150000, 3),
(30, 2, 1, 350000, 1);

INSERT INTO Carts (customerId) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);
INSERT INTO CartDetails (cartId, productId, quantity, sizeId) VALUES
(1, 1, 2, 1),
(1, 3, 1, 2),
(2, 2, 1, 3),
(3, 3, 1, 2),
(4, 1, 1, 1),
(4, 4, 2, 3),
(5, 2, 1, 2),
(5, 3, 2, 1),
(6, 1, 3, 2),
(6, 4, 1, 1),
(7, 3, 1, 3),
(7, 2, 2, 1),
(8, 4, 1, 2),
(8, 1, 2, 3),
(9, 2, 1, 1),
(9, 3, 1, 2),
(10, 1, 2, 3),
(10, 4, 1, 1);
INSERT INTO FunctionalCategories (functionName, status)
VALUES ('Quản lý sản phẩm', 1),
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
INSERT INTO CustomerAddress (addressId, customerId, isDefault)
VALUES (1, 1, TRUE),
    (2, 2, TRUE),
    (3, 3, TRUE),
    (1, 4, FALSE),
    (2, 5, TRUE),
    (3, 6, FALSE),
    (1, 7, TRUE),
    (2, 8, FALSE),
    (3, 9, TRUE),
    (1, 10, FALSE);
INSERT INTO ProductImages (productId, imageUrl, isMain)
VALUES (1, '/uploads/product1_main.jpg', 1),
    (1, '/uploads/product1_2.jpg', 0),
    (1, '/uploads/1764740390102-pro1imgtest.jpg', 0),
    (2, '/uploads/product2_main.jpg', 1),
    (3, '/uploads/1764694489894-product6_main.jpg', 1),
    (3, '/uploads/1764694489909-product6_1.jpg', 0),
    (3, '/uploads/1764694489919-product6_2.jpg', 0),
    (
        4,
        '/uploads/1764693514844-swelb0635_dbc196b9427143dabde76567453a4a9f_master.jpg',
        1
    ),
    (
        4,
        '/uploads/1764693514846-1_010469a27497440ea1dd174f4a255229_master.jpg',
        0
    ),
    (4, '/uploads/1764693514849-pro1.jpg', 0),
    (4, '/uploads/1764693514859-pro2.jpg', 0),
    (4, '/uploads/1764693514869-pro3.jpg', 0);

-- ========================
-- Large extra seed: 100 customers + many orders across 2024
-- This section adds more customers and many orders (orders pick customerId randomly)
-- to ensure monthly statistics and segments have enough data for charts.
-- ========================
-- Add 50 customers (2024 spread)
INSERT INTO Customers (fullName, email, phone, password, gender, dateOfBirth, createdDate) VALUES
('Customer 101','cust101@example.com','0900100101','123456','Nam','1990-01-01','2024-01-05'),
('Customer 102','cust102@example.com','0900100102','123456','Nu','1991-02-02','2024-01-12'),
('Customer 103','cust103@example.com','0900100103','123456','Nam','1992-03-03','2024-01-20'),
('Customer 104','cust104@example.com','0900100104','123456','Nu','1993-04-04','2024-02-02'),
('Customer 105','cust105@example.com','0900100105','123456','Nam','1994-05-05','2024-02-10'),
('Customer 106','cust106@example.com','0900100106','123456','Nu','1995-06-06','2024-02-18'),
('Customer 107','cust107@example.com','0900100107','123456','Nam','1996-07-07','2024-03-01'),
('Customer 108','cust108@example.com','0900100108','123456','Nu','1997-08-08','2024-03-08'),
('Customer 109','cust109@example.com','0900100109','123456','Nam','1998-09-09','2024-03-15'),
('Customer 110','cust110@example.com','0900100110','123456','Nu','1999-10-10','2024-03-22'),
('Customer 111','cust111@example.com','0900100111','123456','Nam','1988-11-11','2024-04-02'),
('Customer 112','cust112@example.com','0900100112','123456','Nu','1989-12-12','2024-04-09'),
('Customer 113','cust113@example.com','0900100113','123456','Nam','1990-01-13','2024-04-16'),
('Customer 114','cust114@example.com','0900100114','123456','Nu','1991-02-14','2024-04-23'),
('Customer 115','cust115@example.com','0900100115','123456','Nam','1992-03-15','2024-05-02'),
('Customer 116','cust116@example.com','0900100116','123456','Nu','1993-04-16','2024-05-09'),
('Customer 117','cust117@example.com','0900100117','123456','Nam','1994-05-17','2024-05-16'),
('Customer 118','cust118@example.com','0900100118','123456','Nu','1995-06-18','2024-05-23'),
('Customer 119','cust119@example.com','0900100119','123456','Nam','1996-07-19','2024-06-03'),
('Customer 120','cust120@example.com','0900100120','123456','Nu','1997-08-20','2024-06-10'),
('Customer 121','cust121@example.com','0900100121','123456','Nam','1998-09-21','2024-06-17'),
('Customer 122','cust122@example.com','0900100122','123456','Nu','1999-10-22','2024-06-24'),
('Customer 123','cust123@example.com','0900100123','123456','Nam','1990-11-23','2024-07-01'),
('Customer 124','cust124@example.com','0900100124','123456','Nu','1991-12-24','2024-07-08'),
('Customer 125','cust125@example.com','0900100125','123456','Nam','1992-01-25','2024-07-15'),
('Customer 126','cust126@example.com','0900100126','123456','Nu','1993-02-26','2024-07-22'),
('Customer 127','cust127@example.com','0900100127','123456','Nam','1994-03-27','2024-08-01'),
('Customer 128','cust128@example.com','0900100128','123456','Nu','1995-04-28','2024-08-08'),
('Customer 129','cust129@example.com','0900100129','123456','Nam','1996-05-29','2024-08-15'),
('Customer 130','cust130@example.com','0900100130','123456','Nu','1997-06-30','2024-08-22'),
('Customer 131','cust131@example.com','0900100131','123456','Nam','1998-07-01','2024-09-02'),
('Customer 132','cust132@example.com','0900100132','123456','Nu','1999-08-02','2024-09-09'),
('Customer 133','cust133@example.com','0900100133','123456','Nam','1990-09-03','2024-09-16'),
('Customer 134','cust134@example.com','0900100134','123456','Nu','1991-10-04','2024-09-23'),
('Customer 135','cust135@example.com','0900100135','123456','Nam','1992-11-05','2024-10-01'),
('Customer 136','cust136@example.com','0900100136','123456','Nu','1993-12-06','2024-10-08'),
('Customer 137','cust137@example.com','0900100137','123456','Nam','1994-01-07','2024-10-15'),
('Customer 138','cust138@example.com','0900100138','123456','Nu','1995-02-08','2024-10-22'),
('Customer 139','cust139@example.com','0900100139','123456','Nam','1996-03-09','2024-11-02'),
('Customer 140','cust140@example.com','0900100140','123456','Nu','1997-04-10','2024-11-09'),
('Customer 141','cust141@example.com','0900100141','123456','Nam','1998-05-11','2024-11-16'),
('Customer 142','cust142@example.com','0900100142','123456','Nu','1999-06-12','2024-11-23'),
('Customer 143','cust143@example.com','0900100143','123456','Nam','1990-07-13','2024-12-02'),
('Customer 144','cust144@example.com','0900100144','123456','Nu','1991-08-14','2024-12-09'),
('Customer 145','cust145@example.com','0900100145','123456','Nam','1992-09-15','2024-12-16'),
('Customer 146','cust146@example.com','0900100146','123456','Nu','1993-10-16','2024-12-23'),
('Customer 147','cust147@example.com','0900100147','123456','Nam','1994-11-17','2024-12-28'),
('Customer 148','cust148@example.com','0900100148','123456','Nu','1995-12-18','2024-12-30'),
('Customer 149','cust149@example.com','0900100149','123456','Nam','1996-01-19','2025-01-05'),
('Customer 150','cust150@example.com','0900100150','123456','Nu','1997-02-20','2025-01-12');

-- Insert many orders across 2024 (approx 3-6 per month) using a random existing customerId
INSERT INTO Orders (createdDate, shippedDate, shippingAddressId, statusId, cost, customerId) VALUES
('2024-01-05','2024-01-07',1,3,450000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-01-12','2024-01-14',2,3,650000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-01-20',NULL,3,1,320000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-01-25','2024-01-27',4,3,780000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-02-02','2024-02-04',5,3,520000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-02-09',NULL,6,1,410000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-02-15','2024-02-17',7,3,880000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-02-23','2024-02-25',8,3,620000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-03-03','2024-03-05',9,3,540000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-03-10',NULL,1,1,720000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-03-18','2024-03-20',2,3,610000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-03-27','2024-03-29',3,3,450000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-04-04','2024-04-06',4,3,810000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-04-11',NULL,5,2,490000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-04-19','2024-04-21',6,3,730000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-04-28','2024-04-30',7,3,670000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-05-06','2024-05-08',8,3,560000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-05-13',NULL,9,1,480000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-05-21','2024-05-23',1,3,880000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-05-29','2024-05-31',2,3,620000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-06-07','2024-06-09',3,3,950000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-06-15',NULL,4,1,430000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-06-23','2024-06-25',5,3,610000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-07-02','2024-07-04',6,3,710000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-07-11',NULL,7,1,480000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-07-19','2024-07-21',8,3,820000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-07-28','2024-07-30',9,3,670000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-08-05','2024-08-07',1,3,740000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-08-13',NULL,2,1,590000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-08-21','2024-08-23',3,3,920000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-08-30','2024-09-01',4,3,510000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-09-08','2024-09-10',5,3,850000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-09-16',NULL,6,1,680000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-09-24','2024-09-26',7,3,760000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-10-02','2024-10-04',8,3,620000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-10-11',NULL,9,1,890000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-10-19','2024-10-21',1,3,520000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-10-28','2024-10-30',2,3,880000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-11-06','2024-11-08',3,3,430000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-11-14',NULL,4,1,760000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-11-22','2024-11-24',5,3,610000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-11-30','2024-12-02',6,3,900000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-12-08','2024-12-10',7,3,650000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-12-16',NULL,8,1,710000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1)),
('2024-12-24','2024-12-26',9,3,520000,(SELECT id FROM Customers ORDER BY RAND() LIMIT 1));

-- End of large extra seed