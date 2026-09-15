# Lê Nam ERP — Quản lý sản xuất và kinh doanh đậu hủ

Lê Nam ERP là hệ thống ERP nội bộ phục vụ quản lý mua hàng, kho, sản xuất, bán hàng, QC/QA, nhà hàng/cửa hàng và các nghiệp vụ liên quan của Công ty Lê Nam.

Phiên bản hiện tại được phát triển theo kiến trúc frontend JavaScript chạy trên Apache/XAMPP, sử dụng KIO API làm lớp đọc/ghi dữ liệu dùng chung. Một số phân hệ phụ trợ vẫn dùng localStorage để lưu tạm trong giai đoạn hoàn thiện.

> Mục tiêu của source hiện tại là giữ nguyên logic nghiệp vụ đã xây dựng, đồng thời tách rõ UI, business logic và persistence để dễ mở rộng và tránh phát sinh lỗi đồng bộ dữ liệu.

---

## 1. Chạy project

### Yêu cầu

- Windows 10/11
- XAMPP hoặc Apache tương đương
- Trình duyệt Chrome/Edge
- Có kết nối tới KIO API của công ty

### Cách chạy

1. Giải nén project vào:

```text
C:\xampp\htdocs\lenam\
```

2. Mở XAMPP và Start **Apache**.

3. Truy cập:

```text
http://localhost/lenam/
```

4. Sau khi thay source, nên dùng:

```text
Ctrl + F5
```

để bỏ cache JavaScript cũ.

Project sử dụng hai thư viện KIO do công ty cung cấp:

```html
<script src="https://kio.dvqt.vn/list.js"></script>
<script src="https://kio.dvqt.vn/krud.js"></script>
```

Các hàm chính:

```text
getKrudList(...)       → đọc dữ liệu
sendFormDataKRUD(...)  → thêm / cập nhật
krud('delete', ...)    → xóa
```

---

## 2. Kiến trúc tổng thể

```text
Người dùng
   ↓
UI / Modal / View
   ↓
Action trong app.js và mod-*.js
   ↓
DB.* — state runtime phía frontend
   ↓
API layer
   ├── PurchaseAPI
   ├── InventoryAPI
   ├── CRMAPI
   ├── ProductionAPI
   └── SystemAPI
   ↓
KioStore / kio-api.js
   ↓
list.js / krud.js
   ↓
KIO Server
```

Nguyên tắc quan trọng:

- Module giao diện không gọi KIO trực tiếp.
- Business logic nằm trong `app.js` và `js/modules/`.
- Persistence nằm trong `js/api/`.
- `data.js` chỉ dùng làm dữ liệu demo/seed và cấu hình ban đầu, không phải database runtime.
- Cache local chỉ giúp mở màn hình nhanh; dữ liệu server vẫn là nguồn chính đối với các module đã kết nối KIO.

---

## 3. Cấu trúc source

```text
lenam/
├── index.html
├── README.md
├── LOGIN_CREDENTIALS_ACTORS.csv
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── api/
    │   ├── kio-config.js
    │   ├── kio-data-utils.js
    │   ├── kio-api.js
    │   ├── purchase-api.js
    │   ├── inventory-api.js
    │   ├── crm-api.js
    │   ├── production-api.js
    │   └── system-api.js
    ├── core/
    │   ├── app.core.js
    │   └── charts.js
    ├── data/
    │   └── data.js
    └── modules/
        ├── mod-dashboard.js
        ├── mod-purchases.js
        ├── mod-inventory.js
        ├── mod-production.js
        ├── mod-crm-sales.js
        ├── mod-enterprise.js
        ├── mod-customers.js
        ├── mod-orders.js
        ├── mod-hr.js
        └── mod-reports.js
```

---

## 4. Các phân hệ chính

### 4.1 Mua hàng

Luồng hiện tại:

```text
Đề nghị mua
   ↓
Duyệt mua
   ↓
Báo giá nhà cung cấp
   ↓
Đơn đặt hàng PO
   ↓
Nhập kho nguyên liệu
   ↓
QC đầu vào
   ↓
Cộng tồn / trả NCC nếu không đạt
```

Chức năng chính:

- Nhà cung cấp
- Đề nghị mua PR
- Duyệt PR
- Báo giá nhà cung cấp
- PO
- Nhập kho
- Công nợ nhà cung cấp
- Lịch sử giá
- Đánh giá nhà cung cấp

Rule quan trọng:

- PR chưa duyệt mới được chỉnh sửa/xóa theo trạng thái cho phép.
- Quyền duyệt được kiểm tra theo role/permission.
- Dữ liệu mua hàng được lưu ở các bảng KIO riêng.

---

### 4.2 Kho

Các khu vực tồn kho:

```text
Kho nguyên liệu
Kho bán thành phẩm
Kho thành phẩm
Kho sản xuất
Kho cửa hàng
Kho hàng lỗi
Kho hàng trả về
```

Chức năng:

- Nhập kho
- Xuất kho
- Chuyển kho
- Kiểm kê
- Tồn kho
- Lô & hạn sử dụng
- Kho & vị trí lưu trữ
- Sổ giao dịch kho
- Theo dõi tồn tối thiểu
- Theo dõi số lô

#### Xuất NVL cho sản xuất

Yêu cầu nguyên liệu từ Sản xuất được đưa trực tiếp vào:

```text
Kho → Xuất kho → Kho nguyên liệu
```

Luồng:

```text
Sản xuất lập yêu cầu NVL
   ↓
Kho nhận yêu cầu
   ↓
Kho duyệt
   ↓
Kho xuất NVL
   ↓
Trừ tồn theo lô
   ↓
Tạo phiếu xuất kho
   ↓
Ghi lịch sử inventoryTransactions
```

Mọi dòng dữ liệu nghiệp vụ đều có thao tác **Xem chi tiết**.

---

## 5. BOM / Định mức

BOM được khai báo theo từng thành phẩm.

Mỗi BOM gồm:

```text
Thành phẩm
├── Danh sách nguyên liệu
│   ├── Mã nguyên liệu
│   └── Định mức cho 1 đơn vị thành phẩm
└── Routing / Công đoạn
    └── Chọn công đoạn
```

Phần công đoạn hiện tại **không yêu cầu nhập số lượng**. Người dùng chỉ chọn công đoạn áp dụng cho sản phẩm.

Ví dụ:

```text
Đậu hủ cứng — 1 Khối
├── Đậu nành: 0.18 Kg
├── Thạch cao: 0.004 Kg
├── Muối: 0.001 Kg
└── Hộp PP: 1 Cái
```

Khi sản xuất 100 khối:

```text
Nhu cầu NVL = Định mức BOM × 100
```

BOM là nguồn dữ liệu chuẩn để tự động sinh yêu cầu NVL cho kế hoạch và lệnh sản xuất.

---

## 6. Kế hoạch sản xuất

### Luồng từ Kho

```text
Kho phát hiện thành phẩm thiếu/hết tồn
   ↓
Tạo kế hoạch sản xuất
   ↓
Người dùng tự chọn thành phẩm cần sản xuất
   ↓
Duyệt kế hoạch
   ↓
Kế hoạch chuyển sang phân hệ Sản xuất
```

Lưu ý:

- Hệ thống chỉ gợi ý thành phẩm thiếu/hết hàng.
- Không tự tick thành phẩm khi mở form.
- Kế hoạch phía Sản xuất không được sửa nội dung kế hoạch đã được Kho phê duyệt.

### Phía Sản xuất

Sau khi kế hoạch được duyệt:

```text
Sản xuất xem kế hoạch
   ↓
Nạp BOM của từng thành phẩm
   ↓
Điều chỉnh NVL thực tế nếu cần
   ↓
Bổ sung nguyên liệu ngoài BOM nếu có
   ↓
Chọn công đoạn / gia công
   ↓
Lập phiếu yêu cầu NVL
```

Việc điều chỉnh nguyên liệu trong kế hoạch **không tự sửa BOM chuẩn**.

---

## 7. Lệnh sản xuất

Luồng chuẩn của LSX:

```text
Tạo Lệnh sản xuất
   ↓
Duyệt LSX
   ↓
Lập / liên kết yêu cầu NVL theo BOM
   ↓
Kho duyệt và xuất NVL
   ↓
Bắt đầu sản xuất
   ↓
Thực hiện các công đoạn
   ↓
QC thành phẩm
   ↓
Hoàn thành LSX
   ↓
Nhập kho thành phẩm
```

### Quy tắc quan trọng

- LSX chưa duyệt mới được xóa.
- LSX đã duyệt hoặc đã bắt đầu sản xuất không được xóa.
- Không tự trừ NVL lần thứ hai khi bắt đầu công đoạn.
- NVL được trừ tại thời điểm Kho thực hiện xuất NVL.
- Nếu thành phẩm có BOM, phiếu yêu cầu NVL sẽ tự lấy BOM × số lượng LSX.
- Mọi LSX đều có màn xem chi tiết.

### QC trong LSX

Có thể nhập:

```text
Số lượng đạt
Số lượng không đạt
Ghi chú QC
```

Điều kiện:

```text
Số đạt + Số không đạt = Số lượng cần QC
```

Chỉ số lượng đạt mới được nhập kho thành phẩm.

---

## 8. Bán hàng / CRM

Luồng đơn hàng bán:

```text
Tạo đơn hàng
   ↓
Chờ duyệt
   ↓
Duyệt đơn
   ↓
Giữ chỗ tồn kho thành phẩm
   ↓
Kho xác nhận xuất
   ↓
Giảm tồn thực tế
```

Nếu thiếu tồn thành phẩm:

```text
Đơn bán
   ↓
Thiếu tồn
   ↓
Tạo Lệnh sản xuất
   ↓
BOM / NVL / Sản xuất
```

Rule:

- Đơn chưa duyệt mới được xóa.
- Đơn đã duyệt không được xóa.
- Dữ liệu CRM/Bán hàng được lưu ở các bảng KIO riêng.

Các bảng:

```text
lenam_customers
lenam_sales_orders
lenam_crm_opportunities
lenam_customer_care_logs
lenam_crm_complaints
lenam_crm_activities
```

---

## 9. QC / QA

Các luồng QC hiện có:

- QC nguyên liệu đầu vào
- Kiểm tra lô nhập
- Đạt → cộng tồn
- Không đạt → trả nhà cung cấp
- QC thành phẩm trong Lệnh sản xuất
- Lịch sử QC được liên kết với lô/chứng từ tương ứng

Người kiểm tra QC mặc định lấy theo người dùng đang đăng nhập.

---

## 10. Nhà hàng & Cửa hàng

Các màn đã triển khai:

```text
Tổng quan
POS bán hàng
Tablet Ordering
QR Ordering
Menu / Combo
Recipe / BOM món
Đơn hàng
Chi nhánh
Xuất kho nguyên liệu
Doanh thu
Báo cáo cửa hàng
```

### POS / Tablet / QR

- Chọn chi nhánh
- Chọn món
- Nhập số lượng
- Tạo đơn
- Thanh toán
- Khi thanh toán, hệ thống kiểm tra Recipe/BOM món và tồn kho cửa hàng
- Trừ nguyên liệu theo định lượng Recipe

### Recipe / BOM món

Mỗi món có:

```text
Mã món
Tên món
Nhóm món
Giá bán
Đơn vị
Nguyên liệu
Định lượng
Trạng thái bán
```

Món đã phát sinh đơn không được xóa; chuyển sang trạng thái ngừng bán để giữ lịch sử.

### Persistence hiện tại

Dữ liệu Nhà hàng & Cửa hàng đang được lưu tạm bằng:

```text
localStorage: lenam_restaurant_v1
```

Kho nguyên liệu bị trừ qua InventoryAPI để đảm bảo số liệu tồn kho được cập nhật.

---

## 11. Quy tắc CRUD chung

Nguyên tắc UI hiện tại:

> Màn hình có dữ liệu phải có thao tác **Xem chi tiết**.

CRUD được mở tùy theo trạng thái nghiệp vụ.

Ví dụ:

- Master data: có thể Tạo / Xem / Sửa / Xóa.
- Đơn hàng chưa duyệt: được sửa/xóa.
- Đơn hàng đã duyệt: không được xóa.
- LSX chưa duyệt: được xóa.
- LSX đã duyệt/đang sản xuất: không được xóa.
- Chứng từ đã phát sinh tồn kho: không xóa trực tiếp nếu việc xóa làm sai lịch sử kho.
- Giao dịch ledger/audit luôn ưu tiên giữ lịch sử.

Không chỉ ẩn nút ở UI; action nghiệp vụ cũng phải kiểm tra trạng thái trước khi thực hiện.

---

## 12. Quy tắc ngày

Các form nghiệp vụ có ngày sử dụng ngày hiện tại của trình duyệt.

Nguyên tắc:

```text
Ngày tạo mới >= ngày hiện tại
```

Không cho chọn ngày quá khứ đối với các form tạo nghiệp vụ mới.

Các màn xem lịch sử/bộ lọc báo cáo vẫn có thể sử dụng khoảng ngày quá khứ.

---

## 13. Bảng KIO chính

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
```

### CRM / Sales

```text
lenam_customers
lenam_sales_orders
lenam_crm_opportunities
lenam_customer_care_logs
lenam_crm_complaints
lenam_crm_activities
```

### System / Authorization

```text
lenam_users
lenam_roles
lenam_permissions
lenam_role_permissions
lenam_audit_logs
```

Tên bảng KIO được tập trung trong:

```text
js/api/kio-config.js
```

Không khai báo table name rải rác trong module nghiệp vụ.

---

## 14. Cơ chế payload KIO

Adapter hiện sử dụng cấu trúc tối thiểu:

```text
id       → khóa kỹ thuật trên server
payload  → JSON nghiệp vụ
```

Nếu payload lớn hơn giới hạn của server, `kio-api.js` có cơ chế chia nhỏ dữ liệu khi ghi và ghép lại khi đọc.

Không nên tự xử lý chunk trong module nghiệp vụ.

---

## 15. Cache và hiệu năng

Các API chính ưu tiên:

```text
Cache local
   ↓
Render giao diện nhanh
   ↓
Refresh KIO ở background
   ↓
Cập nhật DB.*
   ↓
Render lại khi cần
```

Một số nguyên tắc để tránh hệ thống chậm:

- Không gọi KIO khi chỉ mở modal.
- Không sync toàn bộ collection nếu chỉ một record thay đổi.
- Không seed state lớn khi boot nếu không cần.
- Không gọi refresh cùng một dữ liệu từ nhiều API cùng lúc.
- Không lưu BOM lặp lại ở nhiều nguồn dữ liệu.
- Production persistence được tách nhỏ để tránh tạo hàng trăm request khi khởi động.

Nếu Network xuất hiện hàng trăm request sau khi chỉ mở một màn hình, cần kiểm tra lại bootstrap/sync thay vì tăng debounce ở UI.

---

## 16. Cache key chính

Một số cache key hiện tại:

```text
lenam:kio:purchase-cache:v2
lenam:kio:inventory-cache:v2
lenam:kio:crm-cache:v1
lenam:kio:system-cache:v1
lenam:auth:session:v1
lenam_restaurant_v1
```

Để reset cache Purchase/Inventory trong môi trường test:

```javascript
localStorage.removeItem('lenam:kio:purchase-cache:v2');
localStorage.removeItem('lenam:kio:inventory-cache:v2');
location.reload();
```

Các lệnh trên chỉ xóa cache trình duyệt, không xóa dữ liệu KIO server.

---

## 17. Phân quyền

Quyền được đọc từ:

```text
DB.users
   ↓
roleId
   ↓
DB.roles
   ↓
permissions
```

Các nghiệp vụ quan trọng như duyệt mua, duyệt đơn hàng, duyệt PO và các thao tác quản trị phải kiểm tra permission trước khi thực hiện.

Phân quyền frontend giúp kiểm soát UI và action, nhưng nếu KIO/backend hỗ trợ authorization thì vẫn nên kiểm tra thêm phía server để đảm bảo bảo mật thực sự.

---

## 18. Quy tắc khi phát triển tiếp

Để source không quay lại tình trạng chồng chéo:

1. Không gọi `getKrudList`, `sendFormDataKRUD`, `krud` trực tiếp trong module nghiệp vụ.
2. Không khai báo tên bảng `lenam_*` trực tiếp trong `app.js` hoặc `mod-*.js`.
3. Không dùng `data.js` như database runtime.
4. Không tự động DELETE record server trong hàm sync tổng quát.
5. Không tạo thêm một nguồn BOM thứ hai nếu BOM đã nằm trong master thành phẩm.
6. Mọi dòng dữ liệu mới phải có **Xem chi tiết**.
7. CRUD phải tuân theo trạng thái nghiệp vụ.
8. Chứng từ đã ảnh hưởng tồn kho không được xóa tùy ý.
9. Khi thêm module mới, tách rõ business logic và persistence.
10. Không thay đổi logic module khác nếu yêu cầu chỉ liên quan một phân hệ.

---

## 19. Checklist test nhanh

Sau mỗi lần sửa source nên kiểm tra:

1. Login / Logout hoạt động bình thường.
2. Console không có lỗi JavaScript từ source ERP.
3. Không có 404 file JS/CSS local.
4. Network không phát sinh hàng trăm request bất thường lúc mở màn hình.
5. Purchase đọc được dữ liệu.
6. Inventory đọc được dữ liệu.
7. CRM/Bán hàng đọc được dữ liệu.
8. Tồn kho khớp sau nhập/xuất/chuyển kho.
9. PR → Báo giá → PO → Nhập → QC chạy đúng.
10. Kế hoạch SX → BOM → Yêu cầu NVL → Kho xuất chạy đúng.
11. LSX → Công đoạn → QC → Nhập kho TP chạy đúng.
12. Đơn hàng bán duyệt/xuất kho đúng trạng thái.
13. POS/Restaurant trừ NVL đúng Recipe.
14. F5 không làm mất các dữ liệu đã persistence.
15. Các dòng dữ liệu đều mở được màn chi tiết.

---

## 20. Ghi chú về lỗi trình duyệt

Nếu Console xuất hiện lỗi từ file như:

```text
gads-scrapper.js
```

nhưng file đó không tồn tại trong source project, đây thường là script do extension trình duyệt inject vào trang. Nên thử mở Incognito hoặc tắt extension trước khi kết luận đó là lỗi của ERP.

---

## 21. Phiên bản tài liệu

README này được cập nhật theo source **lenam16** ngày **14/09/2026**.

Các nội dung chính đã phản ánh:

- Mua hàng
- Kho
- BOM / Định mức
- Kế hoạch sản xuất
- Yêu cầu NVL
- Lệnh sản xuất
- QC thành phẩm
- Nhập kho thành phẩm
- Bán hàng / CRM
- Nhà hàng & Cửa hàng
- Phân quyền
- KIO persistence
- Cache và tối ưu request
