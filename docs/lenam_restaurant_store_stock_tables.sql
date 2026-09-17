-- LÊ NAM ERP - Bổ sung riêng cho phân hệ Nhà hàng & Cửa hàng
-- Không thay đổi bất kỳ bảng/module cũ nào.
-- Chỉ tạo 2 bảng dữ liệu thật cho tồn điểm bán.
-- Theo chuẩn KRUD/KIO: chỉ khai báo id, KIO tự tạo payload ở lần ghi đầu tiên.

CREATE TABLE IF NOT EXISTS `lenam_restaurant_store_stock` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lenam_restaurant_store_stock_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
