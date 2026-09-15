-- Lê Nam ERP - bảng Auth/Permission/Audit trên KIO server
-- Adapter hiện tại lưu object nghiệp vụ trong payload và tự chunk khi cần.
CREATE TABLE IF NOT EXISTS lenam_users (id BIGINT AUTO_INCREMENT PRIMARY KEY, payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lenam_roles (id BIGINT AUTO_INCREMENT PRIMARY KEY, payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lenam_permissions (id BIGINT AUTO_INCREMENT PRIMARY KEY, payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lenam_role_permissions (id BIGINT AUTO_INCREMENT PRIMARY KEY, payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS lenam_audit_logs (id BIGINT AUTO_INCREMENT PRIMARY KEY, payload TEXT NOT NULL);
