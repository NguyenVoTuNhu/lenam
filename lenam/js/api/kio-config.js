/* ============================================================================
 * KIO CONFIG
 * ----------------------------------------------------------------------------
 * Chỉ chứa cấu hình persistence. Không chứa business logic.
 * Mọi tên bảng KIO của dự án Lê Nam được tập trung tại đây để tránh khai báo
 * rải rác ở nhiều module.
 * ========================================================================== */
const KIO_CONFIG = Object.freeze({
  demoVersion: '20260910-refactor1',

  purchaseTables: Object.freeze({
    suppliers: 'lenam_suppliers',
    purchases: 'lenam_purchase_requests',
    supplierQuotations: 'lenam_supplier_quotations',
    purchaseOrders: 'lenam_purchase_orders',
    goodsReceipts: 'lenam_goods_receipts',
    supplierPayments: 'lenam_supplier_payments',
    purchasePriceHistory: 'lenam_purchase_price_history',
    supplierEvaluations: 'lenam_supplier_evaluations',
  }),

  inventoryTables: Object.freeze({
    warehouses: 'lenam_warehouses',
    warehouseLocations: 'lenam_warehouse_locations',
    inventoryLots: 'lenam_inventory_lots',
    inventory: 'lenam_inventory_balances',
    stockTransfers: 'lenam_stock_transfers',
    inventoryCounts: 'lenam_inventory_counts',
    inventoryTransactions: 'lenam_inventory_transactions',
    goodsIssues: 'lenam_goods_issues',
    stockMoves: 'lenam_stock_moves',
    inventoryAuditLogs: 'lenam_inventory_audit_logs',
    materialReturnRequests: 'lenam_material_return_requests',
    materialReturnHistory: 'lenam_material_return_history',
    materialInspections: 'lenam_material_inspections',
    itemCategories: 'lenam_item_categories',
    materials: 'lenam_materials',
    semiFinishedProducts: 'lenam_semi_finished_products',
    products: 'lenam_finished_products',
  }),


  // CRM – Bán hàng dùng bảng riêng trên KIO server.
  // Giữ prefix lenam_ để không lẫn với các dự án khác trên cùng server.
  crmTables: Object.freeze({
    customers: 'lenam_customers',
    orders: 'lenam_sales_orders',
    crmOpportunities: 'lenam_crm_opportunities',
    customerCareLogs: 'lenam_customer_care_logs',
    crmTickets: 'lenam_crm_complaints',
    crmActivities: 'lenam_crm_activities',
  }),



  // AUTH / PHÂN QUYỀN / AUDIT — chỉ những actor thực sự thao tác ERP mới có tài khoản.
  systemTables: Object.freeze({
    users: 'lenam_users',
    roles: 'lenam_roles',
    permissions: 'lenam_permissions',
    rolePermissions: 'lenam_role_permissions',
    auditLogs: 'lenam_audit_logs',
  }),

  inventorySettingsTable: 'lenam_inventory_settings',

  storageKeys: Object.freeze({
    purchaseCache: 'lenam:kio:purchase-cache:v2',
    inventoryCache: 'lenam:kio:inventory-cache:v2',
    purchaseDemoSeed: 'lenam:kio:purchase-demo-seeded:20260910-refactor1',
    inventoryDemoSeed: 'lenam:kio:inventory-demo-seeded:20260910-refactor1',
    crmCache: 'lenam:kio:crm-cache:v1',
    crmDemoSeed: 'lenam:kio:crm-demo-seeded:20260911-crm-tables-v1',
    systemCache: 'lenam:kio:system-cache:v1',
    authSession: 'lenam:auth:session:v1',
  }),
});
