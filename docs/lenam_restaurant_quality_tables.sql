-- LÊ NAM ERP - Restaurant/Store + QC/QA
-- CHỈ dành cho các bảng mới lenam_restaurant_* và lenam_quality_*.
-- Không thay đổi bất kỳ bảng/module cũ nào.
--
-- QUAN TRỌNG VỚI KRUD/KIO:
-- Có thể để bảng chỉ có cột id. Adapter RestaurantQualityAPI sẽ ghi tuần tự lần đầu
-- để KIO tự tạo payload mà không phát sinh race condition Duplicate column payload.
-- Nếu bảng hiện tại đã có cột payload thì KHÔNG cần drop/reset bảng; adapter mới vẫn dùng được.

CREATE TABLE IF NOT EXISTS `lenam_restaurant_stores` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_restaurant_recipes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_restaurant_pos_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_restaurant_replenishment_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_quality_inspection_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_quality_capa` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_quality_product_recalls` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tồn điểm bán của Nhà hàng/Cửa hàng.
-- Chỉ phát sinh sau khi Kho thành phẩm đã xuất và cửa hàng xác nhận nhập.
CREATE TABLE IF NOT EXISTS `lenam_restaurant_store_stock` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lịch sử nhập/xuất tồn điểm bán (nhận hàng bổ sung, POS/Tablet/QR tiêu thụ).
CREATE TABLE IF NOT EXISTS `lenam_restaurant_store_stock_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
