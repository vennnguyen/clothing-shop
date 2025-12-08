-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for quanao
CREATE DATABASE IF NOT EXISTS `quanao` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `quanao`;

-- Dumping structure for table quanao.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã tài khoản',
  `fullName` varchar(255) NOT NULL COMMENT 'Họ tên nhân viên',
  `email` varchar(100) DEFAULT NULL COMMENT 'Email đăng nhập (Duy nhất)',
  `password` varchar(255) DEFAULT NULL COMMENT 'Mật khẩu đã mã hóa',
  `roleId` int(11) DEFAULT NULL COMMENT 'FK: Mã nhóm quyền',
  `birthday` date DEFAULT NULL COMMENT 'Ngày sinh nhân viên',
  `status` int(11) DEFAULT 1 COMMENT 'Trạng thái: 1-Hoạt động, 0-Bị khóa',
  `createdDate` date DEFAULT curdate() COMMENT 'Ngày tạo tài khoản',
  PRIMARY KEY (`id`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng tài khoản dành cho Admin và Nhân viên';

-- Dumping data for table quanao.accounts: ~3 rows (approximately)
INSERT INTO `accounts` (`id`, `fullName`, `email`, `password`, `roleId`, `birthday`, `status`, `createdDate`) VALUES
	(1, 'Nguyễn Văn A', 'admin@gmail.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 1, '1990-01-01', 1, '2025-12-08'),
	(2, 'Nguyễn Văn B', 'staff1@example.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 3, '1995-05-10', 1, '2025-12-08'),
	(3, 'Nguyễn Văn Cac', 'staff2@example.com', '$2b$10$zDOimcwfM32.4mNi5K7/H.3K/m9ElocH9vftNI/VX6cd4QqxId.nS', 2, '2025-12-05', 1, '2025-12-08');

-- Dumping structure for table quanao.address
CREATE TABLE IF NOT EXISTS `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã địa chỉ',
  `ward` varchar(255) DEFAULT NULL COMMENT 'Phường/Xã',
  `city` varchar(255) DEFAULT NULL COMMENT 'Tỉnh/Thành phố',
  `houseNumber` varchar(255) DEFAULT NULL COMMENT 'Số nhà, tên đường',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu trữ thông tin địa chỉ vật lý';

-- Dumping data for table quanao.address: ~3 rows (approximately)
INSERT INTO `address` (`id`, `ward`, `city`, `houseNumber`) VALUES
	(1, 'Phường 1', 'Hồ Chí Minh', '123 Nguyễn Trãi'),
	(2, 'Phường 5', 'Hồ Chí Minh', '45 Cách Mạng'),
	(3, 'Phường Đông Hòa', 'Bình Dương', '12/3 Khu phố 2');

-- Dumping structure for table quanao.cartdetails
CREATE TABLE IF NOT EXISTS `cartdetails` (
  `cartId` int(11) NOT NULL COMMENT 'FK: Mã giỏ hàng',
  `productId` int(11) NOT NULL COMMENT 'FK: Sản phẩm trong giỏ',
  `quantity` int(11) DEFAULT 1 COMMENT 'Số lượng muốn mua',
  PRIMARY KEY (`cartId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cartdetails_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`),
  CONSTRAINT `cartdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu các sản phẩm khách đang chọn';

-- Dumping data for table quanao.cartdetails: ~4 rows (approximately)
INSERT INTO `cartdetails` (`cartId`, `productId`, `quantity`) VALUES
	(1, 1, 2),
	(1, 3, 1),
	(2, 2, 1),
	(3, 4, 1);

-- Dumping structure for table quanao.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã giỏ hàng',
  `customerId` int(11) DEFAULT NULL COMMENT 'FK: Giỏ hàng của khách nào',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng quản lý phiên giỏ hàng của người dùng';

-- Dumping data for table quanao.carts: ~3 rows (approximately)
INSERT INTO `carts` (`id`, `customerId`) VALUES
	(1, 1),
	(2, 2),
	(3, 3);

-- Dumping structure for table quanao.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã danh mục',
  `name` varchar(255) NOT NULL COMMENT 'Tên danh mục ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng phân loại sản phẩm';

-- Dumping data for table quanao.categories: ~4 rows (approximately)
INSERT INTO `categories` (`id`, `name`) VALUES
	(1, 'Áo thun'),
	(2, 'Quần jeans'),
	(3, 'Áo khoác'),
	(4, 'Đầm nữ');

-- Dumping structure for table quanao.customeraddress
CREATE TABLE IF NOT EXISTS `customeraddress` (
  `addressId` int(11) NOT NULL COMMENT 'FK: Mã địa chỉ',
  `customerId` int(11) NOT NULL COMMENT 'FK: Khách hàng sở hữu',
  `isDefault` tinyint(1) DEFAULT 0 COMMENT 'Là địa chỉ mặc định? (True/False)',
  PRIMARY KEY (`addressId`,`customerId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `customeraddress_ibfk_1` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`),
  CONSTRAINT `customeraddress_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng liên kết Nhiều-Nhiều quản lý danh sách địa chỉ của khách';

-- Dumping data for table quanao.customeraddress: ~3 rows (approximately)
INSERT INTO `customeraddress` (`addressId`, `customerId`, `isDefault`) VALUES
	(1, 1, 1),
	(2, 2, 1),
	(3, 3, 1);

-- Dumping structure for table quanao.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã tài khoản khách hàng',
  `fullName` varchar(100) DEFAULT NULL COMMENT 'Họ và tên đầy đủ',
  `email` varchar(100) DEFAULT NULL COMMENT 'Email khách hàng ',
  `phone` varchar(10) DEFAULT NULL COMMENT 'Số điện thoại liên lạc',
  `password` varchar(255) DEFAULT NULL COMMENT 'Mật khẩu đăng nhập',
  `gender` enum('Nam','Nu') DEFAULT NULL COMMENT 'Giới tính',
  `dateOfBirth` date DEFAULT NULL COMMENT 'Ngày sinh khách hàng',
  `createdDate` date DEFAULT curdate() COMMENT 'Ngày tạo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thông tin khách hàng mua sắm trên hệ thống';

-- Dumping data for table quanao.customers: ~3 rows (approximately)
INSERT INTO `customers` (`id`, `fullName`, `email`, `phone`, `password`, `gender`, `dateOfBirth`, `createdDate`) VALUES
	(1, 'Nguyen Van A', 'a@example.com', '0900000001', '123456', 'Nam', '2000-01-01', '2025-12-08'),
	(2, 'Tran Thi B', 'b@example.com', '0900000002', '123456', 'Nu', '1999-09-09', '2025-12-08'),
	(3, 'Le Van C', 'c@example.com', '0900000003', '123456', 'Nam', '1995-03-15', '2025-12-08');

-- Dumping structure for table quanao.functionalcategories
CREATE TABLE IF NOT EXISTS `functionalcategories` (
  `functionId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã chức năng',
  `functionName` varchar(100) DEFAULT NULL COMMENT 'Tên chức năng (VD: Quản lý User, Quản lý Đơn hàng)',
  `status` int(11) DEFAULT 1 COMMENT '1-Hoạt động, 0-Tạm khóa',
  PRIMARY KEY (`functionId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng danh sách các module chức năng trong trang Admin';

-- Dumping data for table quanao.functionalcategories: ~4 rows (approximately)
INSERT INTO `functionalcategories` (`functionId`, `functionName`, `status`) VALUES
	(1, 'Quản lý sản phẩm', 1),
	(2, 'Quản lý đơn hàng', 1),
	(3, 'Quản lý khách hàng', 1),
	(4, 'Quản lý phân quyền', 1);

-- Dumping structure for table quanao.importdetails
CREATE TABLE IF NOT EXISTS `importdetails` (
  `importReceiptId` int(11) NOT NULL COMMENT 'FK: Thuộc phiếu nhập nào',
  `productId` int(11) NOT NULL COMMENT 'FK: Nhập sản phẩm nào',
  `sizeId` int(11) NOT NULL COMMENT 'FK: Size của sản phẩm',
  `quantity` int(11) DEFAULT NULL COMMENT 'Số lượng nhập vào',
  `price` float DEFAULT NULL COMMENT 'Giá nhập của sản phẩm theo size',
  PRIMARY KEY (`importReceiptId`,`productId`,`sizeId`),
  KEY `productId` (`productId`),
  KEY `sizeId` (`sizeId`),
  CONSTRAINT `importdetails_ibfk_1` FOREIGN KEY (`importReceiptId`) REFERENCES `importreceipts` (`id`),
  CONSTRAINT `importdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `importdetails_ibfk_3` FOREIGN KEY (`sizeId`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng chi tiết sản phẩm trong phiếu nhập (bao gồm size)';

-- Dumping data for table quanao.importdetails: ~4 rows (approximately)
INSERT INTO `importdetails` (`importReceiptId`, `productId`, `sizeId`, `quantity`, `price`) VALUES
	(1, 1, 1, 50, 90000),
	(1, 2, 1, 30, 200000),
	(2, 3, 1, 40, 180000),
	(2, 4, 1, 25, 220000);

-- Dumping structure for table quanao.importreceipts
CREATE TABLE IF NOT EXISTS `importreceipts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã phiếu nhập',
  `createdDate` date DEFAULT curdate() COMMENT 'Ngày lập phiếu',
  `supplierId` int(11) DEFAULT NULL COMMENT 'FK: Nhập từ nhà cung cấp nào',
  `accountId` int(11) DEFAULT NULL COMMENT 'FK: Mã tài khoản tạo phiếu nhập',
  `total` float DEFAULT 0 COMMENT 'Tổng tiền thanh toán cho phiếu nhập',
  `status` enum('Đang xử lý','Đã xác nhận') DEFAULT 'Đang xử lý' COMMENT 'Trạng thái phiếu nhập',
  PRIMARY KEY (`id`),
  KEY `supplierId` (`supplierId`),
  KEY `accountId` (`accountId`),
  CONSTRAINT `importreceipts_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `importreceipts_ibfk_2` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng quản lý các lần nhập hàng vào kho';

-- Dumping data for table quanao.importreceipts: ~2 rows (approximately)
INSERT INTO `importreceipts` (`id`, `createdDate`, `supplierId`, `accountId`, `total`, `status`) VALUES
	(1, '2025-01-10', 1, 1, 5000000, 'Đã xác nhận'),
	(2, '2025-01-15', 2, 2, 7000000, 'Đang xử lý');

-- Dumping structure for table quanao.orderdetails
CREATE TABLE IF NOT EXISTS `orderdetails` (
  `orderId` int(11) NOT NULL COMMENT 'FK: Mã đơn hàng',
  `productId` int(11) NOT NULL COMMENT 'FK: Mã sản phẩm',
  `price` float DEFAULT NULL COMMENT 'Giá bán',
  `quantity` int(11) DEFAULT NULL COMMENT 'Số lượng sản phẩm mua',
  PRIMARY KEY (`orderId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu chi tiết sản phẩm trong đơn hàng';

-- Dumping data for table quanao.orderdetails: ~4 rows (approximately)
INSERT INTO `orderdetails` (`orderId`, `productId`, `price`, `quantity`) VALUES
	(1, 1, 150000, 2),
	(1, 3, 280000, 1),
	(2, 2, 350000, 1),
	(3, 4, 320000, 1);

-- Dumping structure for table quanao.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã đơn hàng',
  `createdDate` date DEFAULT curdate() COMMENT 'Ngày đặt hàng',
  `shippedDate` date DEFAULT NULL COMMENT 'Ngày giao hàng thành công',
  `shippingAddressId` int(11) DEFAULT NULL COMMENT 'FK: Địa chỉ giao hàng',
  `statusId` int(11) DEFAULT NULL COMMENT 'FK: Trạng thái hiện tại của đơn (link bảng Status)',
  `cost` float DEFAULT NULL COMMENT 'Tổng giá trị đơn hàng (sau khi cộng/trừ phí)',
  `customerId` int(11) DEFAULT NULL COMMENT 'FK: Khách hàng đặt đơn',
  PRIMARY KEY (`id`),
  KEY `shippingAddressId` (`shippingAddressId`),
  KEY `statusId` (`statusId`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`shippingAddressId`) REFERENCES `address` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`statusId`) REFERENCES `status` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thông tin đơn hàng bán ra';

-- Dumping data for table quanao.orders: ~3 rows (approximately)
INSERT INTO `orders` (`id`, `createdDate`, `shippedDate`, `shippingAddressId`, `statusId`, `cost`, `customerId`) VALUES
	(1, '2025-02-01', '2025-02-03', 1, 3, 450000, 1),
	(2, '2025-02-03', NULL, 2, 1, 680000, 2),
	(3, '2025-02-05', '2025-02-07', 3, 3, 320000, 3);

-- Dumping structure for table quanao.productimages
CREATE TABLE IF NOT EXISTS `productimages` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã hình ảnh',
  `productId` int(11) DEFAULT NULL COMMENT 'FK: Thuộc sản phẩm nào',
  `imageUrl` varchar(100) NOT NULL COMMENT 'Đường dẫn/Tên file ảnh',
  `isMain` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Là ảnh đại diện chính? (True/False)',
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `productimages_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thư viện ảnh của sản phẩm';

-- Dumping data for table quanao.productimages: ~12 rows (approximately)
INSERT INTO `productimages` (`id`, `productId`, `imageUrl`, `isMain`) VALUES
	(1, 1, '/uploads/product1_main.jpg', 1),
	(2, 1, '/uploads/product1_2.jpg', 0),
	(3, 1, '/uploads/1764740390102-pro1imgtest.jpg', 0),
	(4, 2, '/uploads/product2_main.jpg', 1),
	(5, 3, '/uploads/1764694489894-product6_main.jpg', 1),
	(6, 3, '/uploads/1764694489909-product6_1.jpg', 0),
	(7, 3, '/uploads/1764694489919-product6_2.jpg', 0),
	(8, 4, '/uploads/1764693514844-swelb0635_dbc196b9427143dabde76567453a4a9f_master.jpg', 1),
	(9, 4, '/uploads/1764693514846-1_010469a27497440ea1dd174f4a255229_master.jpg', 0),
	(10, 4, '/uploads/1764693514849-pro1.jpg', 0),
	(11, 4, '/uploads/1764693514859-pro2.jpg', 0),
	(12, 4, '/uploads/1764693514869-pro3.jpg', 0);

-- Dumping structure for table quanao.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã sản phẩm',
  `name` varchar(255) NOT NULL COMMENT 'Tên sản phẩm hiển thị',
  `price` float NOT NULL COMMENT 'Giá bán niêm yết (VNĐ)',
  `description` text NOT NULL COMMENT 'Mô tả chi tiết sản phẩm',
  `categoryId` int(11) DEFAULT NULL COMMENT 'FK: Thuộc danh mục nào',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT 'Trạng thái: 1-Đang bán, 0-Ngừng kinh doanh',
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu trữ thông tin chung của sản phẩm';

-- Dumping data for table quanao.products: ~4 rows (approximately)
INSERT INTO `products` (`id`, `name`, `price`, `description`, `categoryId`, `status`) VALUES
	(1, 'Áo thun nam cổ tròn', 150000, 'Áo thun nam cổ tròn được làm từ vải cotton cao cấp, mềm mại, thoáng khí và thấm hút mồ hôi tốt. Thiết kế tối giản phù hợp mặc hàng ngày, đi chơi hoặc tập luyện. Giặt giữ form lâu, không bai nhão và không gây kích ứng da.', 1, 1),
	(2, 'Áo khoác gió nam', 350000, 'Áo khoác gió nam với chất liệu chống nước và chống bám bụi, mang lại sự thoải mái và bảo vệ hiệu quả trước thời tiết xấu. Thiết kế hiện đại, nhẹ, dễ gấp gọn mang theo. Phù hợp đi làm, du lịch hay hoạt động ngoài trời.', 3, 1),
	(3, 'Quần jeans nữ form ôm', 280000, 'Quần jeans nữ form ôm với chất liệu denim co giãn 4 chiều giúp tôn dáng và tạo cảm giác thoải mái suốt cả ngày. Thiết kế thời trang, dễ phối với áo thun, áo sơ mi hoặc áo kiểu. Phù hợp đi học, đi làm và đi chơi.', 2, 1),
	(4, 'Áo khoác nữ', 320000, 'Áo khoác nữ thời trang với chất liệu mềm mại, giữ ấm tốt và tạo cảm giác thoải mái khi mặc. Thiết kế thanh lịch phù hợp nhiều phong cách từ năng động đến sang trọng. Thích hợp sử dụng khi thời tiết lạnh hoặc khi đi làm, đi chơi.', 4, 1);

-- Dumping structure for table quanao.productsizes
CREATE TABLE IF NOT EXISTS `productsizes` (
  `productId` int(11) NOT NULL COMMENT 'FK: Mã sản phẩm',
  `sizeId` int(11) NOT NULL COMMENT 'FK: Mã kích cỡ',
  `quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho thực tế cho size này',
  PRIMARY KEY (`productId`,`sizeId`),
  KEY `sizeId` (`sizeId`),
  CONSTRAINT `productsizes_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `productsizes_ibfk_2` FOREIGN KEY (`sizeId`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng trung gian quản lý số lượng tồn kho theo từng Size của Sản phẩm';

-- Dumping data for table quanao.productsizes: ~8 rows (approximately)
INSERT INTO `productsizes` (`productId`, `sizeId`, `quantity`) VALUES
	(1, 1, 20),
	(1, 2, 30),
	(2, 2, 25),
	(2, 3, 15),
	(3, 2, 20),
	(3, 3, 10),
	(4, 2, 18),
	(4, 3, 12);

-- Dumping structure for table quanao.roledetails
CREATE TABLE IF NOT EXISTS `roledetails` (
  `roleId` int(11) NOT NULL COMMENT 'FK: Nhóm quyền nào',
  `functionId` int(11) NOT NULL COMMENT 'FK: Được truy cập chức năng nào',
  `action` varchar(100) DEFAULT NULL COMMENT 'Quyền hạn cụ thể (VD: CREATE, READ, UPDATE, DELETE)',
  PRIMARY KEY (`roleId`,`functionId`),
  KEY `functionId` (`functionId`),
  CONSTRAINT `roledetails_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`),
  CONSTRAINT `roledetails_ibfk_2` FOREIGN KEY (`functionId`) REFERENCES `functionalcategories` (`functionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng ma trận phân quyền chi tiết (ACL)';

-- Dumping data for table quanao.roledetails: ~0 rows (approximately)

-- Dumping structure for table quanao.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL COMMENT 'Mã nhóm quyền',
  `name` varchar(100) DEFAULT NULL COMMENT 'Tên nhóm quyền (Admin, Seller, Customer...)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng định nghĩa các nhóm quyền trong hệ thống';

-- Dumping data for table quanao.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `name`) VALUES
	(1, 'Admin'),
	(2, 'Warehouse '),
	(3, 'Sales');

-- Dumping structure for table quanao.sizes
CREATE TABLE IF NOT EXISTS `sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã kích cỡ',
  `sizeName` varchar(10) NOT NULL COMMENT 'Tên kích cỡ (S, M, L, XL)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng danh sách các kích thước có sẵn';

-- Dumping data for table quanao.sizes: ~4 rows (approximately)
INSERT INTO `sizes` (`id`, `sizeName`) VALUES
	(1, 'S'),
	(2, 'M'),
	(3, 'L'),
	(4, 'XL');

-- Dumping structure for table quanao.status
CREATE TABLE IF NOT EXISTS `status` (
  `id` int(11) NOT NULL COMMENT 'Mã trạng thái',
  `name` varchar(50) DEFAULT NULL COMMENT 'Tên trạng thái (Mới, Đang giao, Đã giao, Hủy)',
  `description` text DEFAULT NULL COMMENT 'Mô tả ý nghĩa trạng thái',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng từ điển các trạng thái xử lý đơn hàng (Order Status)';

-- Dumping data for table quanao.status: ~4 rows (approximately)
INSERT INTO `status` (`id`, `name`, `description`) VALUES
	(1, 'Pending', 'Chờ xử lý'),
	(2, 'Shipping', 'Đang giao'),
	(3, 'Completed', 'Hoàn thành'),
	(4, 'Cancelled', 'Đã hủy');

-- Dumping structure for table quanao.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã nhà cung cấp',
  `name` varchar(255) DEFAULT NULL COMMENT 'Tên công ty/nhà cung cấp',
  `address` varchar(255) DEFAULT NULL COMMENT 'Địa chỉ nhà cung cấp',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Số điện thoại nhà cung cấp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng danh sách đối tác cung cấp hàng hóa';

-- Dumping data for table quanao.suppliers: ~2 rows (approximately)
INSERT INTO `suppliers` (`id`, `name`, `address`, `phone`) VALUES
	(1, 'Công ty Dệt May ABC', '123 Đường May, Quận 1, TP.HCM', '0901111222'),
	(2, 'Nhà phân phối Quần Áo XYZ', '456 Đường Thời Trang, Quận 5, TP.HCM', '0903333444');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
