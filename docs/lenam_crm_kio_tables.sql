-- CRM / Sales tables for Lê Nam KIO persistence
-- Chạy trên database server do KIO sử dụng. Không liên quan business logic frontend.
-- Nếu server đã có chuẩn charset/collation riêng, giữ theo chuẩn server hiện tại.

CREATE TABLE IF NOT EXISTS lenam_customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lenam_sales_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lenam_crm_opportunities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lenam_customer_care_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lenam_crm_complaints (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lenam_crm_activities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);


-- Lịch sử thu tiền công nợ khách hàng. Một đơn hàng có thể có nhiều lần thu.
CREATE TABLE IF NOT EXISTS lenam_customer_payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);
