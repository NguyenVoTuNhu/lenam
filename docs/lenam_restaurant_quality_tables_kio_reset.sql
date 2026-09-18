-- ============================================================================
-- ONE-TIME RESET - CHỈ 7 BẢNG MỚI CỦA RESTAURANT + QUALITY
-- ============================================================================
-- CHỈ dùng khi người quản trị chủ động muốn xóa sạch dữ liệu thử của các bảng mới.
-- Với adapter RestaurantQualityAPI mới, lỗi Duplicate column payload KHÔNG còn yêu cầu reset bảng.
--
-- Script này KHÔNG đụng bất kỳ bảng cũ nào của Purchase/Inventory/CRM/
-- Production/Logistics/Auth...
--
-- CẢNH BÁO: DROP TABLE sẽ xóa dữ liệu hiện có trong CHÍNH 7 bảng dưới đây.
-- Nếu đã có dữ liệu thật cần giữ, backup 7 bảng trước khi chạy.

DROP TABLE IF EXISTS `lenam_restaurant_stores`;
DROP TABLE IF EXISTS `lenam_restaurant_recipes`;
DROP TABLE IF EXISTS `lenam_restaurant_pos_orders`;
DROP TABLE IF EXISTS `lenam_restaurant_replenishment_requests`;
DROP TABLE IF EXISTS `lenam_quality_inspection_records`;
DROP TABLE IF EXISTS `lenam_quality_capa`;
DROP TABLE IF EXISTS `lenam_quality_product_recalls`;

CREATE TABLE `lenam_restaurant_stores` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_restaurant_recipes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_restaurant_pos_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_restaurant_replenishment_requests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_quality_inspection_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_quality_capa` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lenam_quality_product_recalls` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
