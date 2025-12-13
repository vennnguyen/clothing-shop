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

-- Dumping data for table quanao.accounts: ~4 rows (approximately)
INSERT INTO `accounts` (`id`, `fullName`, `email`, `password`, `roleId`, `birthday`, `status`, `createdDate`) VALUES
	(1, 'Nguyễn Văn A', 'admin@gmail.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 1, '1990-01-01', 1, '2025-12-11'),
	(2, 'Nguyễn Văn B', 'staff1@example.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 2, '1995-05-10', 1, '2025-12-11'),
	(3, 'Nguyễn Văn C', 'staff2@example.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 2, '1998-12-20', 1, '2025-12-11'),
	(4, 'Nguyễn Văn D', 'staff3@example.com', '$2b$10$6zJRsJ/RGFxf2LcyUyCGauls/HunfZPUpuRO0SKWJIL9ZK7eBxaJi', 2, '2000-06-15', 1, '2025-12-11');

-- Dumping structure for table quanao.address
CREATE TABLE IF NOT EXISTS `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã địa chỉ',
  `ward` varchar(255) DEFAULT NULL COMMENT 'Phường/Xã',
  `city` varchar(255) DEFAULT NULL COMMENT 'Tỉnh/Thành phố',
  `houseNumber` varchar(255) DEFAULT NULL COMMENT 'Số nhà, tên đường',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu trữ thông tin địa chỉ vật lý';

-- Dumping data for table quanao.address: ~10 rows (approximately)
INSERT INTO `address` (`id`, `ward`, `city`, `houseNumber`) VALUES
	(1, 'Phường 1', 'Hồ Chí Minh', '123 Nguyễn Trãi'),
	(2, 'Phường 5', 'Hồ Chí Minh', '45 Cách Mạng'),
	(3, 'Phường Đông Hòa', 'Bình Dương', '12/3 Khu phố 2'),
	(4, 'Phường Tân Bình', 'Hồ Chí Minh', '98 Hoàng Văn Thụ'),
	(5, 'Phường 2', 'Hà Nội', '12 Lê Duẩn'),
	(6, 'Phường Thọ Xương', 'Bắc Ninh', '5 Trần Phú'),
	(7, 'Phường 8', 'Đà Nẵng', '77 Nguyễn Văn Linh'),
	(8, 'Phường 3', 'Cần Thơ', '200 Trần Hưng Đạo'),
	(9, 'Phường Hoà Cường', 'Đà Nẵng', '33 Núi Thành'),
	(10, 'Phường 4', 'Hải Phòng', '9 Đặng Thanh Ngữ');

-- Dumping structure for table quanao.cartdetails
CREATE TABLE IF NOT EXISTS `cartdetails` (
  `cartId` int(11) NOT NULL COMMENT 'FK: Mã giỏ hàng',
  `productId` int(11) NOT NULL COMMENT 'FK: Sản phẩm trong giỏ',
  `quantity` int(11) DEFAULT 1 COMMENT 'Số lượng muốn mua',
  `sizeId` int(11) NOT NULL COMMENT 'Mã size sản phẩm',
  PRIMARY KEY (`cartId`,`productId`,`sizeId`),
  KEY `productId` (`productId`),
  KEY `sizeId` (`sizeId`),
  CONSTRAINT `cartdetails_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts` (`id`),
  CONSTRAINT `cartdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `cartdetails_ibfk_3` FOREIGN KEY (`sizeId`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu các sản phẩm khách đang chọn';

-- Dumping data for table quanao.cartdetails: ~18 rows (approximately)
INSERT INTO `cartdetails` (`cartId`, `productId`, `quantity`, `sizeId`) VALUES
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
	(7, 2, 2, 1),
	(7, 3, 1, 3),
	(8, 1, 2, 3),
	(8, 4, 1, 2),
	(9, 2, 1, 1),
	(9, 3, 1, 2),
	(10, 1, 2, 3),
	(10, 4, 1, 1);

-- Dumping structure for table quanao.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Mã giỏ hàng',
  `customerId` int(11) DEFAULT NULL COMMENT 'FK: Giỏ hàng của khách nào',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng quản lý phiên giỏ hàng của người dùng';

-- Dumping data for table quanao.carts: ~10 rows (approximately)
INSERT INTO `carts` (`id`, `customerId`) VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(5, 5),
	(6, 6),
	(7, 7),
	(8, 8),
	(9, 9),
	(10, 10);

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

-- Dumping data for table quanao.customeraddress: ~10 rows (approximately)
INSERT INTO `customeraddress` (`addressId`, `customerId`, `isDefault`) VALUES
	(1, 1, 1),
	(1, 4, 0),
	(1, 7, 1),
	(1, 10, 0),
	(2, 2, 1),
	(2, 5, 1),
	(2, 8, 0),
	(3, 3, 1),
	(3, 6, 0),
	(3, 9, 1);

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
  `status` int(11) DEFAULT 1 COMMENT '1: Hoạt động; 2: Đã khóa',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thông tin khách hàng mua sắm trên hệ thống';

-- Dumping data for table quanao.customers: ~60 rows (approximately)
INSERT INTO `customers` (`id`, `fullName`, `email`, `phone`, `password`, `gender`, `dateOfBirth`, `createdDate`, `status`) VALUES
	(1, 'Nguyen Van A', 'a@example.com', '0900000001', '123456', 'Nam', '2000-01-01', '2024-12-11', 1),
	(2, 'Tran Thi B', 'b@example.com', '0900000002', '123456', 'Nu', '1999-09-09', '2025-02-14', 1),
	(3, 'Le Van C', 'c@example.com', '0900000003', '123456', 'Nam', '1995-03-15', '2025-04-05', 1),
	(4, 'Pham Thi D', 'd@example.com', '0900000004', '123456', 'Nu', '1998-07-20', '2025-05-25', 1),
	(5, 'Hoang Van E', 'e@example.com', '0900000005', '123456', 'Nam', '1992-11-11', '2025-07-14', 1),
	(6, 'Nguyen Thi F', 'f@example.com', '0900000006', '123456', 'Nu', '2001-05-05', '2025-08-13', 1),
	(7, 'Tran Van G', 'g@example.com', '0900000007', '123456', 'Nam', '1997-02-28', '2025-09-02', 1),
	(8, 'Le Thi H', 'h@example.com', '0900000008', '123456', 'Nu', '2003-08-15', '2025-09-22', 1),
	(9, 'Pham Van I', 'i@example.com', '0900000009', '123456', 'Nam', '1996-12-01', '2025-10-12', 1),
	(10, 'Hoang Thi J', 'j@example.com', '0900000010', '123456', 'Nu', '2002-04-10', '2025-11-11', 1),
	(11, 'Customer 101', 'cust101@example.com', '0900100101', '123456', 'Nam', '1990-01-01', '2024-01-05', 1),
	(12, 'Customer 102', 'cust102@example.com', '0900100102', '123456', 'Nu', '1991-02-02', '2024-01-12', 1),
	(13, 'Customer 103', 'cust103@example.com', '0900100103', '123456', 'Nam', '1992-03-03', '2024-01-20', 1),
	(14, 'Customer 104', 'cust104@example.com', '0900100104', '123456', 'Nu', '1993-04-04', '2024-02-02', 1),
	(15, 'Customer 105', 'cust105@example.com', '0900100105', '123456', 'Nam', '1994-05-05', '2024-02-10', 1),
	(16, 'Customer 106', 'cust106@example.com', '0900100106', '123456', 'Nu', '1995-06-06', '2024-02-18', 1),
	(17, 'Customer 107', 'cust107@example.com', '0900100107', '123456', 'Nam', '1996-07-07', '2024-03-01', 1),
	(18, 'Customer 108', 'cust108@example.com', '0900100108', '123456', 'Nu', '1997-08-08', '2024-03-08', 1),
	(19, 'Customer 109', 'cust109@example.com', '0900100109', '123456', 'Nam', '1998-09-09', '2024-03-15', 1),
	(20, 'Customer 110', 'cust110@example.com', '0900100110', '123456', 'Nu', '1999-10-10', '2024-03-22', 1),
	(21, 'Customer 111', 'cust111@example.com', '0900100111', '123456', 'Nam', '1988-11-11', '2024-04-02', 1),
	(22, 'Customer 112', 'cust112@example.com', '0900100112', '123456', 'Nu', '1989-12-12', '2024-04-09', 1),
	(23, 'Customer 113', 'cust113@example.com', '0900100113', '123456', 'Nam', '1990-01-13', '2024-04-16', 1),
	(24, 'Customer 114', 'cust114@example.com', '0900100114', '123456', 'Nu', '1991-02-14', '2024-04-23', 1),
	(25, 'Customer 115', 'cust115@example.com', '0900100115', '123456', 'Nam', '1992-03-15', '2024-05-02', 1),
	(26, 'Customer 116', 'cust116@example.com', '0900100116', '123456', 'Nu', '1993-04-16', '2024-05-09', 1),
	(27, 'Customer 117', 'cust117@example.com', '0900100117', '123456', 'Nam', '1994-05-17', '2024-05-16', 1),
	(28, 'Customer 118', 'cust118@example.com', '0900100118', '123456', 'Nu', '1995-06-18', '2024-05-23', 1),
	(29, 'Customer 119', 'cust119@example.com', '0900100119', '123456', 'Nam', '1996-07-19', '2024-06-03', 1),
	(30, 'Customer 120', 'cust120@example.com', '0900100120', '123456', 'Nu', '1997-08-20', '2024-06-10', 1),
	(31, 'Customer 121', 'cust121@example.com', '0900100121', '123456', 'Nam', '1998-09-21', '2024-06-17', 1),
	(32, 'Customer 122', 'cust122@example.com', '0900100122', '123456', 'Nu', '1999-10-22', '2024-06-24', 1),
	(33, 'Customer 123', 'cust123@example.com', '0900100123', '123456', 'Nam', '1990-11-23', '2024-07-01', 1),
	(34, 'Customer 124', 'cust124@example.com', '0900100124', '123456', 'Nu', '1991-12-24', '2024-07-08', 1),
	(35, 'Customer 125', 'cust125@example.com', '0900100125', '123456', 'Nam', '1992-01-25', '2024-07-15', 1),
	(36, 'Customer 126', 'cust126@example.com', '0900100126', '123456', 'Nu', '1993-02-26', '2024-07-22', 1),
	(37, 'Customer 127', 'cust127@example.com', '0900100127', '123456', 'Nam', '1994-03-27', '2024-08-01', 1),
	(38, 'Customer 128', 'cust128@example.com', '0900100128', '123456', 'Nu', '1995-04-28', '2024-08-08', 1),
	(39, 'Customer 129', 'cust129@example.com', '0900100129', '123456', 'Nam', '1996-05-29', '2024-08-15', 1),
	(40, 'Customer 130', 'cust130@example.com', '0900100130', '123456', 'Nu', '1997-06-30', '2024-08-22', 1),
	(41, 'Customer 131', 'cust131@example.com', '0900100131', '123456', 'Nam', '1998-07-01', '2024-09-02', 1),
	(42, 'Customer 132', 'cust132@example.com', '0900100132', '123456', 'Nu', '1999-08-02', '2024-09-09', 1),
	(43, 'Customer 133', 'cust133@example.com', '0900100133', '123456', 'Nam', '1990-09-03', '2024-09-16', 1),
	(44, 'Customer 134', 'cust134@example.com', '0900100134', '123456', 'Nu', '1991-10-04', '2024-09-23', 1),
	(45, 'Customer 135', 'cust135@example.com', '0900100135', '123456', 'Nam', '1992-11-05', '2024-10-01', 1),
	(46, 'Customer 136', 'cust136@example.com', '0900100136', '123456', 'Nu', '1993-12-06', '2024-10-08', 1),
	(47, 'Customer 137', 'cust137@example.com', '0900100137', '123456', 'Nam', '1994-01-07', '2024-10-15', 1),
	(48, 'Customer 138', 'cust138@example.com', '0900100138', '123456', 'Nu', '1995-02-08', '2024-10-22', 1),
	(49, 'Customer 139', 'cust139@example.com', '0900100139', '123456', 'Nam', '1996-03-09', '2024-11-02', 1),
	(50, 'Customer 140', 'cust140@example.com', '0900100140', '123456', 'Nu', '1997-04-10', '2024-11-09', 1),
	(51, 'Customer 141', 'cust141@example.com', '0900100141', '123456', 'Nam', '1998-05-11', '2024-11-16', 1),
	(52, 'Customer 142', 'cust142@example.com', '0900100142', '123456', 'Nu', '1999-06-12', '2024-11-23', 1),
	(53, 'Customer 143', 'cust143@example.com', '0900100143', '123456', 'Nam', '1990-07-13', '2024-12-02', 1),
	(54, 'Customer 144', 'cust144@example.com', '0900100144', '123456', 'Nu', '1991-08-14', '2024-12-09', 1),
	(55, 'Customer 145', 'cust145@example.com', '0900100145', '123456', 'Nam', '1992-09-15', '2024-12-16', 1),
	(56, 'Customer 146', 'cust146@example.com', '0900100146', '123456', 'Nu', '1993-10-16', '2024-12-23', 1),
	(57, 'Customer 147', 'cust147@example.com', '0900100147', '123456', 'Nam', '1994-11-17', '2024-12-28', 1),
	(58, 'Customer 148', 'cust148@example.com', '0900100148', '123456', 'Nu', '1995-12-18', '2024-12-30', 1),
	(59, 'Customer 149', 'cust149@example.com', '0900100149', '123456', 'Nam', '1996-01-19', '2025-01-05', 1),
	(60, 'Customer 150', 'cust150@example.com', '0900100150', '123456', 'Nu', '1997-02-20', '2025-01-12', 1);

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
  `sizeId` int(11) NOT NULL COMMENT 'FK: Mã size',
  `price` float DEFAULT NULL COMMENT 'Giá bán',
  `quantity` int(11) DEFAULT NULL COMMENT 'Số lượng sản phẩm mua',
  PRIMARY KEY (`orderId`,`productId`,`sizeId`),
  KEY `productId` (`productId`),
  KEY `sizeId` (`sizeId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `orderdetails_ibfk_3` FOREIGN KEY (`sizeId`) REFERENCES `sizes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lưu chi tiết sản phẩm trong đơn hàng';

-- Dumping data for table quanao.orderdetails: ~58 rows (approximately)
INSERT INTO `orderdetails` (`orderId`, `productId`, `sizeId`, `price`, `quantity`) VALUES
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
	(11, 2, 3, 350000, 1),
	(11, 4, 1, 320000, 1),
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
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thông tin đơn hàng bán ra';

-- Dumping data for table quanao.orders: ~75 rows (approximately)
INSERT INTO `orders` (`id`, `createdDate`, `shippedDate`, `shippingAddressId`, `statusId`, `cost`, `customerId`) VALUES
	(1, '2024-01-05', '2024-01-07', 1, 3, 450000, 1),
	(2, '2024-01-15', '2024-01-17', 2, 3, 680000, 2),
	(3, '2024-01-20', '2024-01-22', 3, 3, 320000, 3),
	(4, '2024-02-03', NULL, 1, 1, 520000, 4),
	(5, '2024-02-10', '2024-02-12', 2, 3, 780000, 5),
	(6, '2024-02-18', '2024-02-20', 3, 3, 450000, 1),
	(7, '2024-03-05', '2024-03-07', 1, 3, 620000, 2),
	(8, '2024-03-12', '2024-03-14', 2, 3, 740000, 3),
	(9, '2024-03-25', NULL, 3, 1, 580000, 4),
	(10, '2024-04-02', '2024-04-04', 1, 3, 810000, 5),
	(11, '2024-04-15', '2024-04-17', 2, 3, 650000, 6),
	(12, '2024-04-28', '2024-04-30', 3, 3, 720000, 7),
	(13, '2024-05-08', NULL, 1, 2, 490000, 8),
	(14, '2024-05-20', '2024-05-22', 2, 3, 880000, 1),
	(15, '2024-06-03', '2024-06-05', 3, 3, 540000, 2),
	(16, '2024-06-15', '2024-06-17', 1, 3, 950000, 3),
	(17, '2024-06-28', '2024-06-30', 2, 3, 620000, 4),
	(18, '2024-07-10', NULL, 3, 1, 710000, 5),
	(19, '2024-07-22', '2024-07-24', 1, 3, 480000, 6),
	(20, '2024-08-05', '2024-08-07', 2, 3, 820000, 7),
	(21, '2024-08-18', '2024-08-20', 3, 3, 670000, 8),
	(22, '2024-09-02', '2024-09-04', 1, 3, 740000, 9),
	(23, '2024-09-15', NULL, 2, 2, 590000, 10),
	(24, '2024-09-28', '2024-09-30', 3, 3, 920000, 1),
	(25, '2024-10-10', '2024-10-12', 1, 3, 510000, 2),
	(26, '2024-10-25', '2024-10-27', 2, 3, 850000, 3),
	(27, '2024-11-05', '2024-11-07', 3, 3, 680000, 4),
	(28, '2024-11-20', NULL, 1, 1, 760000, 5),
	(29, '2024-12-02', '2024-12-04', 2, 3, 620000, 6),
	(30, '2024-12-15', '2024-12-17', 3, 3, 890000, 7),
	(31, '2024-01-05', '2024-01-07', 1, 3, 450000, 45),
	(32, '2024-01-12', '2024-01-14', 2, 3, 650000, 60),
	(33, '2024-01-20', NULL, 3, 1, 320000, 48),
	(34, '2024-01-25', '2024-01-27', 4, 3, 780000, 51),
	(35, '2024-02-02', '2024-02-04', 5, 3, 520000, 44),
	(36, '2024-02-09', NULL, 6, 1, 410000, 56),
	(37, '2024-02-15', '2024-02-17', 7, 3, 880000, 11),
	(38, '2024-02-23', '2024-02-25', 8, 3, 620000, 16),
	(39, '2024-03-03', '2024-03-05', 9, 3, 540000, 9),
	(40, '2024-03-10', NULL, 1, 1, 720000, 8),
	(41, '2024-03-18', '2024-03-20', 2, 3, 610000, 56),
	(42, '2024-03-27', '2024-03-29', 3, 3, 450000, 58),
	(43, '2024-04-04', '2024-04-06', 4, 3, 810000, 60),
	(44, '2024-04-11', NULL, 5, 2, 490000, 25),
	(45, '2024-04-19', '2024-04-21', 6, 3, 730000, 6),
	(46, '2024-04-28', '2024-04-30', 7, 3, 670000, 26),
	(47, '2024-05-06', '2024-05-08', 8, 3, 560000, 5),
	(48, '2024-05-13', NULL, 9, 1, 480000, 57),
	(49, '2024-05-21', '2024-05-23', 1, 3, 880000, 20),
	(50, '2024-05-29', '2024-05-31', 2, 3, 620000, 4),
	(51, '2024-06-07', '2024-06-09', 3, 3, 950000, 43),
	(52, '2024-06-15', NULL, 4, 1, 430000, 38),
	(53, '2024-06-23', '2024-06-25', 5, 3, 610000, 26),
	(54, '2024-07-02', '2024-07-04', 6, 3, 710000, 51),
	(55, '2024-07-11', NULL, 7, 1, 480000, 31),
	(56, '2024-07-19', '2024-07-21', 8, 3, 820000, 6),
	(57, '2024-07-28', '2024-07-30', 9, 3, 670000, 59),
	(58, '2024-08-05', '2024-08-07', 1, 3, 740000, 48),
	(59, '2024-08-13', NULL, 2, 1, 590000, 31),
	(60, '2024-08-21', '2024-08-23', 3, 3, 920000, 34),
	(61, '2024-08-30', '2024-09-01', 4, 3, 510000, 23),
	(62, '2024-09-08', '2024-09-10', 5, 3, 850000, 3),
	(63, '2024-09-16', NULL, 6, 1, 680000, 46),
	(64, '2024-09-24', '2024-09-26', 7, 3, 760000, 46),
	(65, '2024-10-02', '2024-10-04', 8, 3, 620000, 8),
	(66, '2024-10-11', NULL, 9, 1, 890000, 24),
	(67, '2024-10-19', '2024-10-21', 1, 3, 520000, 47),
	(68, '2024-10-28', '2024-10-30', 2, 3, 880000, 23),
	(69, '2024-11-06', '2024-11-08', 3, 3, 430000, 59),
	(70, '2024-11-14', NULL, 4, 1, 760000, 52),
	(71, '2024-11-22', '2024-11-24', 5, 3, 610000, 48),
	(72, '2024-11-30', '2024-12-02', 6, 3, 900000, 22),
	(73, '2024-12-08', '2024-12-10', 7, 3, 650000, 34),
	(74, '2024-12-16', NULL, 8, 1, 710000, 33),
	(75, '2024-12-24', '2024-12-26', 9, 3, 520000, 10);

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
	(12, 4, '/uploads/1764693514869-pro3.jpg', 0),
	(13, 2, '/uploads/product2_1.jpg', 0),
	(14, 2, '/uploads/product2_2.jpg', 0);

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
  `name` varchar(100) DEFAULT NULL COMMENT 'Tên nhóm quyền (Admin, Sales, Revenue)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng định nghĩa các nhóm quyền trong hệ thống';

-- Dumping data for table quanao.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `name`) VALUES
	(1, 'Admin'),
	(2, 'Sales'),
	(3, 'Revenue');

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
