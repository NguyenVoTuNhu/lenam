# Lê Nam ERP

Frontend ERP cho Công ty Lê Nam. Project chạy bằng Apache/XAMPP ở local và đọc/ghi dữ liệu Purchase + Inventory qua KIO API do công ty cung cấp.

> **Nguyên tắc refactor:** business logic và luồng nghiệp vụ hiện có được giữ nguyên. Đợt cleanup này chỉ tổ chức lại source, gom persistence KIO, bỏ code comment chết và hợp nhất màn quản lý vật tư cũ vào màn **Tồn kho** có 3 subtab ngang.

## 1. Chạy project

1. Chép thư mục `lenam` vào `C:\xampp\htdocs\`.
2. Start **Apache** trong XAMPP. Không cần MySQL/phpMyAdmin local cho luồng KIO hiện tại.
3. Mở `http://localhost/lenam/`.
4. Khi thay source, dùng `Ctrl + F5` một lần để bỏ cache script cũ.

Project phụ thuộc hai thư viện server của công ty:

```html
<script src="https://kio.dvqt.vn/list.js"></script>
<script src="https://kio.dvqt.vn/krud.js"></script>
```

- `getKrudList(...)`: đọc danh sách từ bảng server.
- `sendFormDataKRUD(...)`: insert/update.
- `krud('delete', ...)`: delete.

## 2. Cấu trúc source sau cleanup

```text
lenam/
├── index.html
├── README.md
├── css/
│   └── style.css
├── docs/
│   └── ERP-Le-Nam.pdf
└── js/
    ├── app.js                  # Action handlers + bootstrap cuối cùng
    ├── api/
    │   ├── kio-config.js       # Tên bảng KIO + cache key
    │   ├── kio-data-utils.js   # Utility cache/clone/merge demo
    │   ├── kio-api.js          # Adapter trực tiếp list.js / krud.js
    │   ├── purchase-api.js     # Persistence cho Purchase
    │   └── inventory-api.js    # Persistence cho Inventory/Master
    ├── core/
    │   ├── app.core.js         # Router, Modal, helper UI, render chung
    │   └── charts.js
    ├── data/
    │   └── data.js             # Config + dữ liệu demo seed
    └── modules/
        ├── mod-dashboard.js
        ├── mod-customers.js
        ├── mod-orders.js
        ├── mod-production.js
        ├── mod-inventory.js
        ├── mod-purchases.js
        ├── mod-enterprise.js
        ├── mod-hr.js
        ├── mod-reports.js
        └── legacy/             # Module từ hệ thống cũ, vẫn load để giữ hành vi hiện tại
            ├── quote-engine.js
            ├── mod-quotes.js
            ├── mod-quote-param.js
            ├── mod-pricebook.js
            └── mod-catalogs.js
```

## 3. Luồng dữ liệu chuẩn

Runtime không truy cập MySQL local.

```text
UI / Modal
   ↓
Business logic trong app.js + mod-*.js
   ↓
DB.* (state frontend)
   ↓
PurchaseAPI / InventoryAPI
   ↓
KioStore
   ↓
list.js / krud.js
   ↓
KIO server
   ↓
Database dùng chung của công ty
```

### Đọc dữ liệu sau F5

```text
cache local (nếu có) → render nhanh
                   ↓
             đọc KIO background
                   ↓
             KIO ghi đè DB.*
                   ↓
                 render
```

Cache chỉ để tăng tốc. **KIO server vẫn là nguồn dữ liệu chuẩn.**

## 4. Phương án A — giữ dữ liệu demo

Project đang dùng **Option A**:

- Dữ liệu demo trong `data.js` được snapshot khi API module khởi động.
- Theo mỗi phiên bản demo, hệ thống kiểm tra và **chỉ bổ sung record demo còn thiếu** lên KIO.
- Nếu server đã có record cùng key thì **server thắng**, demo không ghi đè.
- Sync collection không tự xóa record server chỉ vì frontend không thấy record đó.

Phiên bản seed hiện tại được khai báo ở:

```javascript
KIO_CONFIG.demoVersion
```

Cache/seed key cũng tập trung ở `js/api/kio-config.js`.

### Reset cache để test

Mở DevTools → Console:

```javascript
localStorage.removeItem('lenam:kio:purchase-cache:v2');
localStorage.removeItem('lenam:kio:inventory-cache:v2');
location.reload();
```

Muốn ép chạy lại kiểm tra seed của bản refactor:

```javascript
localStorage.removeItem('lenam:kio:purchase-demo-seeded:20260910-refactor1');
localStorage.removeItem('lenam:kio:inventory-demo-seeded:20260910-refactor1');
localStorage.removeItem('lenam:kio:purchase-cache:v2');
localStorage.removeItem('lenam:kio:inventory-cache:v2');
location.reload();
```

Các lệnh trên **không xóa dữ liệu server**.

## 5. Bảng KIO đang dùng

### Purchase

```text
lenam_suppliers
lenam_purchase_requests
lenam_supplier_quotations
lenam_purchase_orders
lenam_goods_receipts
lenam_supplier_payments
lenam_purchase_price_history
lenam_supplier_evaluations
```

### Inventory / Master

```text
lenam_warehouses
lenam_warehouse_locations
lenam_inventory_lots
lenam_inventory_balances
lenam_stock_transfers
lenam_inventory_counts
lenam_inventory_transactions
lenam_goods_issues
lenam_stock_moves
lenam_inventory_audit_logs
lenam_material_return_requests
lenam_material_return_history
lenam_material_inspections
lenam_item_categories
lenam_materials
lenam_semi_finished_products
lenam_finished_products
lenam_inventory_settings
```

Tên bảng chỉ được khai báo ở `js/api/kio-config.js`; không khai báo lại rải rác trong module.

## 6. `payload` và `recordId`

KIO table hiện được adapter sử dụng theo mô hình tối thiểu:

```text
id       → khóa kỹ thuật của record trên server
payload  → dữ liệu JSON nghiệp vụ
```

Trong source dùng tên `recordId`, không dùng `serverId`, vì đây là **ID của bản ghi** chứ không phải ID của máy chủ.

Nếu JSON dài hơn giới hạn cột `payload`, `kio-api.js` tự chia thành nhiều chunk nhỏ khi ghi và ghép lại khi đọc. Module nghiệp vụ không cần biết cơ chế này.

## 7. Màn Tồn kho đã chốt

Không còn hai màn độc lập “Quản lý vật tư” và “Tồn kho”. UI chính là:

```text
Kho → Tồn kho
    ├── Kho nguyên liệu
    ├── Kho bán thành phẩm
    └── Kho thành phẩm
```

Trên từng subtab có:

- Danh mục
- Thêm master
- Xem
- Sửa
- Xóa
- Tồn hiện tại
- Số lô
- Kho đang lưu

`Views.materials` chỉ còn là **legacy alias**:

```javascript
Views.materials = () => Views.inventory();
```

mục đích là giữ route/code cũ không bị gãy; nó không render màn thứ hai nữa.

## 8. Quy tắc khi sửa tiếp

Để tránh source quay lại tình trạng chồng chéo:

- Không gọi `getKrudList`, `sendFormDataKRUD`, `krud` trực tiếp trong module nghiệp vụ. Đi qua `KioStore` / API adapter.
- Không thêm table name `lenam_*` trực tiếp vào `app.js` hay `mod-*.js`; khai báo ở `kio-config.js`.
- Không tạo thêm một màn quản lý nguyên liệu khác. Dùng `Views.inventory()`.
- Không dùng `data.js` như database runtime. `data.js` chỉ là config + demo seed.
- Không tự động DELETE dữ liệu server trong hàm sync tổng quát.
- Mở modal không gọi server; chỉ thao tác Save/Update/Delete mới persistence.
- Khi thêm nghiệp vụ mới, business logic ở module/action, persistence ở API layer.

## 9. Checklist test sau refactor

1. Mở app: không lỗi syntax/404 file JS local.
2. Purchase và Inventory đều báo nạp KIO thành công.
3. `Kho → Tồn kho` chỉ có một giao diện với 3 subtab ngang.
4. Tạo danh mục → F5 → còn dữ liệu.
5. Tạo nguyên liệu → F5 → còn dữ liệu.
6. Nguyên liệu hiển thị ở Tồn kho và có thể tìm trong PR từ cùng `DB.materials`.
7. PR → duyệt → báo giá → PO giữ nguyên luồng cũ.
8. Nhập kho → chờ QC → QC đạt/không đạt → trả NCC giữ nguyên luồng cũ.
9. Mở form/modal không phát sinh hàng loạt request KIO.
10. Console không có lỗi JavaScript mới do refactor.

## 10. Phần legacy

Các file trong `js/modules/legacy/` là phần còn lại từ source cũ. Chúng **vẫn được load** để không thay đổi chức năng hiện tại. Việc chuyển vào `legacy/` chỉ nhằm phân biệt rõ với module Lê Nam chính; chưa xóa vì xóa có thể làm thay đổi nghiệp vụ của những màn đang tham chiếu chúng.


## Cập nhật: Số lượng ban đầu & phân quyền duyệt mua

### Số lượng ban đầu khi tạo nguyên liệu
- Chỉ xuất hiện khi **Thêm nguyên liệu mới** (`RAW_MATERIAL`), không xuất hiện khi Sửa.
- Giá trị `0` hoặc để trống: hành vi cũ giữ nguyên, master được tạo với tồn bằng 0.
- Giá trị `> 0`: hệ thống dùng `InventoryService.apply()` hiện hữu để ghi một giao dịch `ADJUSTMENT_IN` với `refType = MASTER_OPENING`.
- Đây là **tồn đầu kỳ**, không tạo PR, báo giá, PO hay phiếu nhập mua hàng; do đó luồng mua hàng hiện tại không bị thay đổi.
- Khi có tồn đầu kỳ, các collection `materials`, `inventory`, `inventoryTransactions` được đồng bộ KIO.

### Phân quyền duyệt Purchase
Quyền được đọc từ `DB.users -> roleId -> DB.roles[].perms`.
Permission sử dụng: `Duyệt báo giá & mua hàng`.

Theo dữ liệu vai trò hiện tại:
- `R01 - Quản trị viên`: có quyền duyệt.
- `R02 - Ban giám đốc`: có quyền duyệt.
- Các vai trò khác: chỉ xem các chứng từ chờ duyệt, không thấy nút Duyệt/Từ chối và action cũng chặn lại nếu gọi trực tiếp.

Các action được bảo vệ:
- `pr-approve-action`
- `pr-reject-modal` / `pr-reject-save`
- `po-approve-action`

> Lưu ý: đây là phân quyền ở tầng frontend của source hiện tại. Nếu KIO/backend cung cấp cơ chế quyền theo người dùng, nên áp dụng thêm kiểm tra phía server để bảo mật thực sự.

## Cập nhật 2026-09-10 — Đồng bộ Tồn kho / PR và dashboard màn hình

Các thay đổi dưới đây chỉ tác động lớp hiển thị/lọc dữ liệu; không thay đổi luồng nghiệp vụ PR → duyệt → báo giá → PO → nhập kho → QC → tồn kho.

### 1. Trạng thái tồn kho
- `OUT`: số lượng tồn `<= 0` → **Hết hàng** (đỏ).
- `LOW`: số lượng tồn `> 0` và `< tồn tối thiểu` → **Sắp hết hàng** (cam).
- `IN`: các trường hợp còn lại → **Còn hàng** (xanh).
- Bổ sung bộ lọc `Tất cả trạng thái / Còn hàng / Sắp hết hàng / Hết hàng`.
- Dashboard của mỗi subtab Kho nguyên liệu / BTP / Thành phẩm hiển thị tổng SKU, còn hàng, sắp hết, hết hàng và tổng số lượng tồn.

### 2. Form Đề nghị mua hàng
- Nguồn nguyên liệu duy nhất là `DB.materials`, giống màn Kho nguyên liệu.
- Tồn hiển thị trong form PR lấy từ `DB.inventory` (qtyOnHand), không lấy một danh sách hard-code riêng.
- Bổ sung dropdown **Danh mục nguyên liệu**. Chọn danh mục sẽ lọc danh sách gợi ý; ô tìm kiếm tiếp tục lọc theo mã/tên trong danh mục đó.

### 3. Dashboard theo màn hình Kho
Ngoài dashboard Tồn kho/Overview/Count/Lot/Alert đã có, bổ sung KPI tóm tắt cho Nhập kho, Xuất kho, Chuyển kho, Kho & vị trí và Sổ giao dịch kho. Đây chỉ là số liệu tổng hợp từ state hiện tại, không ghi hoặc thay đổi dữ liệu nghiệp vụ.

## Cập nhật 2026-09-10 — đồng bộ danh mục & dashboard
- Danh mục nguyên liệu trùng tên (ví dụ Bao bì, Phụ gia) được chuẩn hóa còn một record hiển thị; record trùng cũ trên KIO được xóa theo đúng khóa record, không dùng cơ chế auto-delete theo state frontend.
- Dropdown Nhóm cung ứng của Nhà cung cấp chỉ lấy danh mục nguyên liệu duy nhất sau chuẩn hóa.
- PurchaseAPI kiểm tra thiếu dữ liệu theo từng collection của Option A; nếu collection Đơn đặt hàng thiếu record demo thì bổ sung lại mà không ghi đè record server trùng khóa.
- Dashboard PO bỏ PO hủy khỏi tổng giá trị/công nợ, dùng Number(...) cho dữ liệu KIO và biểu đồ trạng thái bao phủ đầy đủ trạng thái hiện có.
- Dashboard Tổng quan tồn kho tính trực tiếp từ DB.inventory để khớp số lượng thực tế thay vì dựa vào material.stock/value cache.


## CRM – Bán hàng: bảng KIO server

CRM/Bán hàng không còn lưu chung trong record `CRM_SALES_STATE`. Dữ liệu được
đồng bộ vào các bảng riêng có prefix `lenam_` để tách biệt dự án Lê Nam:

| DB runtime | Bảng KIO |
|---|---|
| `DB.customers` | `lenam_customers` |
| `DB.orders` | `lenam_sales_orders` |
| `DB.crmOpportunities` | `lenam_crm_opportunities` |
| `DB.customerCareLogs` | `lenam_customer_care_logs` |
| `DB.crmTickets` | `lenam_crm_complaints` |
| `DB.crmActivities` | `lenam_crm_activities` |

Mỗi bảng dùng cùng adapter KIO hiện tại (`id` tự tăng + `payload`). Business
logic CRM không đổi; chỉ persistence được chuyển sang các bảng riêng.

Lần chạy đầu, `CRMAPI` sẽ thử migrate dữ liệu từ `CRM_SALES_STATE`/cache CRM
cũ sang các bảng mới nếu bảng tương ứng đang trống. Sau đó KIO các bảng
`lenam_*` là nguồn dữ liệu chuẩn; localStorage chỉ là cache/fallback.

> Lưu ý: KIO frontend không có API `CREATE TABLE`. Sáu bảng trên phải tồn tại
> trên database KIO với cấu trúc tối thiểu tương thích adapter hiện tại
> (`id` khóa chính tự tăng, `payload` TEXT/VARCHAR đủ dùng) trước khi CRUD.


## Bổ sung 2026-09-11 — Quyền cá nhân + truy vết lô
- Mọi actor có menu **Thông tin phân quyền** để xem vai trò, menu được truy cập và các quyền thao tác dạng bảng.
- Ban giám đốc được xem toàn bộ các phân hệ nghiệp vụ (không cấp quyền quản trị tài khoản).
- Phiếu QC đầu vào tự lấy **người đang đăng nhập** làm người kiểm tra, không cho chọn thay actor khác.
- Chi tiết lô tồn kho hiển thị người kiểm tra QC, lịch sử trả NCC và lịch sử xuất/sử dụng của đúng lô.
- Không thay đổi business logic nhập kho → QC → tồn → xuất/trả.


## Cập nhật 2026-09-11 — Tốc độ khởi động + Kho thành phẩm
- Login/Auth dùng actor/cache ngay; KIO refresh ở nền, không chặn màn đăng nhập.
- Purchase/Inventory/CRM render từ cache/data hiện có rồi refresh KIO nền.
- Purchase demo chỉ seed một lần, không so/ghi lại demo ở mỗi lần mở.
- Bỏ menu và khối Báo cáo mua hàng riêng; Tổng quan Mua hàng giữ KPI/biểu đồ vận hành.
- Danh sách sản phẩm ở Nhập kho thành phẩm lấy từ master `DB.products` / `lenam_finished_products`.
- Khi tạo mới thành phẩm trong Tồn kho > Kho thành phẩm, có thể nhập `Số lượng ban đầu`; hệ thống tạo lô mở đầu PASSED và ghi tồn đầu kỳ vào Kho thành phẩm.

## Cập nhật luồng đơn hàng bán 2026-09-11
- Tất cả input ngày tạo/ngày đặt/ngày giao/ngày nhập/xuất/chuyển mới dùng ngày hiện tại của trình duyệt, không dùng `DB.today` demo làm mặc định form.
- Đơn hàng bán mới ở trạng thái `dh_cho_xu_ly` = Chờ duyệt.
- Trưởng Kinh doanh / Admin có `SALES_APPROVE` để Duyệt hoặc Từ chối.
- Khi duyệt, hệ thống giữ chỗ tồn kho bằng `qtyReserved`, giảm `qtyAvailable` nhưng KHÔNG giảm `qtyOnHand`.
- Đồng thời tạo `SALES_ISSUE` trạng thái `PENDING_CONFIRMATION` ở Kho thành phẩm.
- Kho xác nhận xuất bằng action `inv-sales-issue-confirm`; lúc đó mới giảm tồn thật và phiếu xuất chuyển `COMPLETED`.
- Tồn kho hiển thị số lượng đang giữ chỗ/chờ xác nhận xuất bán.
- Sau khi tạo đơn, hệ thống mở ngay trang chi tiết đơn và danh sách có nút Xem chi tiết.
