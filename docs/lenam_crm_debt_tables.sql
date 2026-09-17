-- Bổ sung persistence cho công nợ khách hàng CRM.
-- Số dư công nợ KH được tính động: sales_order.total - SUM(customer_payments.amount).

CREATE TABLE IF NOT EXISTS lenam_customer_payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payload TEXT NOT NULL,
  PRIMARY KEY (id)
);

-- Công nợ NCC tiếp tục dùng bảng hiện hữu lenam_supplier_payments.
-- Payload thanh toán NCC mới có thêm: payerId, payerName, bankId, bankName, bankAccount, bankRef, createdAt.
