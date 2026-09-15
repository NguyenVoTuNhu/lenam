/* ============================================================================
 * MODULE: VẬT TƯ — TỒN KHO — MUA SẮM
 * ==========================================================================*/

function inventoryMasterItem(id) {
  return Q.material(id) || (DB.semiFinishedProducts || []).find((x) => x.id === id) || Q.product(id);
}
function inventoryItemCategory(item, type) {
  if (!item) return '';
  if (type === 'RAW_MATERIAL') return item.group || item.category || '';
  return item.category || (type === 'SEMI_FINISHED' ? 'Bán thành phẩm' : 'Thành phẩm');
}
function inventoryCategories(type) {
  const configured = (DB.itemCategories || []).filter((c) => c.type === type && c.status !== 'inactive').map((c) => c.name);
  const derived = type === 'RAW_MATERIAL'
    ? (DB.materials || []).map((x) => x.group)
    : type === 'SEMI_FINISHED'
      ? (DB.semiFinishedProducts || []).map((x) => x.category)
      : (DB.products || []).map((x) => x.category);
  return [...new Set([...configured, ...derived].filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'vi'));
}

/* ------------------------------------------------------------ VẬT TƯ (LEGACY ROUTE)
 * Màn Quản lý vật tư cũ đã được hợp nhất vào Views.inventory().
 * Giữ alias này để route/code cũ không bị gãy; không còn UI trùng lặp.
 * -------------------------------------------------------------------------- */
Views.materials = () => Views.inventory();

function openMaterialModal(id) {
  const m = Q.material(id);
  if (!m) return;
  const moves = DB.stockMoves.filter((x) => x.materialId === id);
  const usedIn = DB.products.filter((p) => (p.bom || []).some(([mid]) => mid === id));
  const stockRows = (DB.inventory || []).filter((r) => r.productId === id && Number(r.qtyOnHand || 0) !== 0);

  Modal.open({
    title: `${esc(m.name)}`,
    sub: `${m.id} · ${esc(m.group || 'Chưa phân loại')}`,
    size: 'md',
    body: `
      <div class="grid g-auto-sm" style="margin-bottom:16px">
        ${mkpi('Tồn kho hiện tại', fmtDec(Number(m.stock||0), 2) + ' ' + m.unit, 'fa-boxes-stacked', Number(m.stock||0) <= 0 ? 'red' : Number(m.stock||0) < Number(m.minStock||0) ? 'orange' : 'green')}
        ${mkpi('Tồn tối thiểu', fmtDec(Number(m.minStock||0), 2) + ' ' + m.unit, 'fa-arrow-down-short-wide', 'slate')}
        ${mkpi('Đơn giá tham chiếu', fmtVND(Number(m.price||0)), 'fa-tag', 'blue')}
        ${mkpi('Giá trị tồn', fmtShort(Number(m.value||0)), 'fa-sack-dollar', 'teal')}
      </div>
      <div class="form-sec-title"><i class="fa-solid fa-circle-info"></i>Thông tin master</div>
      <div class="info-grid" style="margin-bottom:18px">
        ${infoItem('Danh mục', esc(m.group || '—'))}
        ${infoItem('Đơn vị tính', esc(m.unit || '—'))}
        ${infoItem('Tình trạng', badge(m.status))}
        ${infoItem('Dùng cho', usedIn.length ? usedIn.map((p) => esc(p.name)).join(', ') : '<span class="muted">Chưa gắn định mức</span>')}
      </div>
      <div class="form-sec-title"><i class="fa-solid fa-location-dot"></i>Vị trí tồn thực tế</div>
      ${tableShell([{t:'Kho'},{t:'Vị trí'},{t:'Lô'},{t:'Số lượng',cls:'right'}], stockRows.map(r=>`<tr><td>${esc(Q.warehouseName(r.warehouseId))}</td><td>${esc(Q.locationName(r.locationId)||'—')}</td><td><span class="code">${esc(Q.lot(r.lotId)?.lotNumber||r.lotId||'—')}</span></td><td class="right num">${fmtN(Number(r.qtyOnHand||0))} ${esc(r.unit||m.unit)}</td></tr>`), {emptyTitle:'Chưa có tồn kho',emptyDesc:'Vị trí chỉ được xác định khi hàng được nhập kho.'})}
      <div class="form-sec-title" style="margin-top:18px"><i class="fa-solid fa-right-left"></i>Lịch sử nhập xuất gần đây</div>
      ${tableShell(
        [{ t: 'Chứng từ' }, { t: 'Loại' }, { t: 'Ngày' }, { t: 'Số lượng', cls: 'right' }, { t: 'Tham chiếu' }],
        moves.map((x) => `<tr>
          <td><span class="code">${x.id}</span></td>
          <td>${x.type === 'in' ? '<span class="badge green">Nhập kho</span>' : '<span class="badge orange">Xuất kho</span>'}</td>
          <td class="num">${fmtDate(x.date)}</td>
          <td class="right strong num" style="color:${x.type === 'in' ? 'var(--green)' : 'var(--orange)'}">${x.type === 'in' ? '+' : '−'}${fmtN(x.qty)}</td>
          <td class="muted">${esc(x.ref)}</td></tr>`),
        { emptyTitle: 'Chưa có giao dịch', emptyDesc: 'Vật tư này chưa phát sinh nhập xuất trong kỳ.' })}`,
    foot: `<button class="btn" data-act="modal-close">Đóng</button>
           <button class="btn" data-act="inventory-item-edit" data-type="RAW_MATERIAL" data-id="${m.id}"><i class="fa-solid fa-pen"></i>Sửa</button>
           <button class="btn" data-act="stock-move" data-id="${m.id}"><i class="fa-solid fa-right-left"></i>Nhập / xuất kho</button>
           ${Number(m.stock||0) < Number(m.minStock||0) ? `<button class="btn btn-primary" data-act="material-request" data-id="${m.id}"><i class="fa-solid fa-cart-plus"></i>Tạo yêu cầu mua</button>` : ''}`,
  });
}


function inventoryCategoryCodePrefix(type, categoryName) {
  const cat = (DB.itemCategories || []).find((c) => c.type === type && String(c.name) === String(categoryName));
  if (cat?.codePrefix) return String(cat.codePrefix).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const normalized = String(categoryName || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, ' ')
    .trim();
  const words = normalized.split(/\s+/).filter(Boolean);
  if (!words.length) return type === 'RAW_MATERIAL' ? 'NVL' : type === 'SEMI_FINISHED' ? 'BTP' : 'TP';
  const prefix = words.length === 1 ? words[0].slice(0, 3) : words.map((w) => w[0]).join('').slice(0, 6);
  return prefix || (type === 'RAW_MATERIAL' ? 'NVL' : type === 'SEMI_FINISHED' ? 'BTP' : 'TP');
}

function nextInventoryMasterCode(type, categoryName) {
  const prefix = inventoryCategoryCodePrefix(type, categoryName);
  const all = [
    ...(DB.materials || []),
    ...(DB.semiFinishedProducts || []),
    ...(DB.products || []),
  ];
  let max = 0;
  const rx = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}-(\\d+)$`, 'i');
  all.forEach((x) => {
    const m = String(x.id || '').match(rx);
    if (m) max = Math.max(max, Number(m[1]) || 0);
  });
  return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}

function supplierMatchesCategory(supplier, categoryName) {
  if (!supplier || !categoryName) return false;
  const groups = Array.isArray(supplier.groups) ? supplier.groups : [supplier.group];
  return groups.filter(Boolean).some((g) => String(g).trim().toLowerCase() === String(categoryName).trim().toLowerCase());
}

function inventorySuppliersForCategory(categoryName) {
  return (DB.suppliers || []).filter((supplier) => supplierMatchesCategory(supplier, categoryName));
}

function locationZoneLabel(location) {
  if (!location) return '';
  if (location.zone) return String(location.zone);
  if (location.parentLocation) {
    const parent = (DB.warehouseLocations || []).find((x) => x.id === location.parentLocation);
    if (parent) return parent.name || parent.code || parent.id;
  }
  const code = String(location.code || '');
  const m = code.match(/-([A-Z]+)\d*$/i);
  if (m) return `Khu ${m[1].toUpperCase()}`;
  const name = String(location.name || '');
  const n = name.match(/Kệ\s+([A-Z]+)/i);
  return n ? `Khu ${n[1].toUpperCase()}` : 'Khu chung';
}

function inventoryZonesOf(warehouseId) {
  return [...new Set((Q.locationsOf(warehouseId) || []).map(locationZoneLabel).filter(Boolean))];
}

function inventoryShelfOptions(warehouseId, zone, selectedLocationId = '') {
  return (Q.locationsOf(warehouseId) || [])
    .filter((l) => !zone || locationZoneLabel(l) === zone)
    .map((l) => `<option value="${esc(l.id)}" ${String(selectedLocationId) === String(l.id) ? 'selected' : ''}>${esc(l.name)} · ${esc(l.code || '')}</option>`)
    .join('');
}

function openInventoryItemForm(type = 'RAW_MATERIAL', id = '') {
  const isRaw = type === 'RAW_MATERIAL';
  const isSemi = type === 'SEMI_FINISHED';
  const source = isRaw ? DB.materials : isSemi ? [...(DB.semiFinishedProducts || []), ...(DB.products || [])] : DB.products;
  const item = id ? source.find((x) => x.id === id) : null;
  const typeLabel = isRaw ? 'nguyên liệu' : isSemi ? 'bán thành phẩm' : 'thành phẩm';
  const cats = inventoryCategories(type);
  const category = inventoryItemCategory(item, type);
  const generatedCode = item?.id || (category ? nextInventoryMasterCode(type, category) : 'Chọn danh mục để sinh mã');

  Modal.open({
    title: item ? `Sửa ${typeLabel}` : `Thêm ${typeLabel}`,
    sub: item ? `${item.id} · Cập nhật thông tin master` : `Chỉ khai báo master hàng hóa; tồn kho chỉ phát sinh khi nhập kho thực tế`,
    size: 'md',
    body: `<div class="form-grid">
      <div class="field"><label>Mã ${typeLabel}</label><input class="inp code" id="invItemId" value="${esc(generatedCode)}" disabled><div class="cell-sub" style="margin-top:5px">Mã tự sinh theo mã viết tắt của danh mục, ví dụ BB-0001, NLC-0001.</div></div>
      <div class="field"><label>Tên ${typeLabel} <span class="req">*</span></label><input class="inp" id="invItemName" value="${esc(item?.name || '')}" placeholder="Ví dụ: Ly nhựa 500ml"></div>
      <div class="field"><label>Danh mục <span class="req">*</span></label><select class="inp" id="invItemCategory"><option value="">-- Chọn danh mục --</option>${cats.map(c=>`<option value="${esc(c)}" ${category===c?'selected':''}>${esc(c)}</option>`).join('')}</select><div class="cell-sub" style="margin-top:6px">Chưa có danh mục? Đóng form và chọn nút <b>Danh mục nguyên liệu</b> trên màn hình Quản lý vật tư.</div></div>
      <div class="field"><label>Đơn vị tính <span class="req">*</span></label><input class="inp" id="invItemUnit" value="${esc(item?.unit || '')}" placeholder="Kg / Cái / Hộp..."></div>
      <div class="field"><label>Đơn giá tham chiếu</label><input class="inp right num" id="invItemPrice" type="text" inputmode="numeric" autocomplete="off" value="${item ? fmtN(Number(item?.price || 0)) : ''}" placeholder="Ví dụ: 12.000"><div class="cell-sub" style="margin-top:5px">Nhập 12000, hệ thống sẽ hiển thị 12.000. Giá mua thực tế lấy theo báo giá/PO.</div></div>
      <div class="field"><label>Tồn kho tối thiểu</label><input class="inp right num" id="invItemMinStock" type="number" min="0" value="${item ? Number(isRaw ? item?.minStock || 0 : type==='FINISHED_GOODS' ? DB.finishedMinStock?.[item?.id] || 0 : item?.minStock || 0) : ''}" placeholder="0"></div>
      ${!item && (isRaw || type === 'FINISHED_GOODS') ? `<div class="field"><label>Số lượng ban đầu</label><input class="inp right num" id="invItemOpeningQty" type="number" min="0" step="any" value="" placeholder="0"><div class="cell-sub" style="margin-top:5px">Nếu nhập &gt; 0, hệ thống ghi nhận là <b>tồn đầu kỳ</b>. ${type === 'FINISHED_GOODS' ? 'Thành phẩm được đưa vào Kho thành phẩm và tạo lô mở đầu để có thể theo dõi/xuất bán.' : 'Không tạo PR/PO hay phiếu nhập mua hàng.'}</div></div>` : ''}
      ${!isRaw ? `<div class="field" style="grid-column:1/-1"><label>Quy cách / mô tả</label><input class="inp" id="invItemSpec" value="${esc(item?.spec || '')}" placeholder="Quy cách sản phẩm"></div>` : ''}
    </div>
    <div class="alert info" style="margin-top:12px"><i class="fa-solid fa-circle-info"></i><span>${item ? 'Sửa master không tự thay đổi số lượng tồn kho.' : `Nếu không nhập số lượng ban đầu thì ${typeLabel} mới có tồn = 0. Nguyên liệu và thành phẩm có thể khai báo tồn đầu kỳ khi tạo mới; các luồng mua hàng/sản xuất hiện tại vẫn giữ nguyên.`}</span></div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="inventory-item-save" data-type="${type}" data-id="${esc(item?.id || '')}"><i class="fa-solid fa-floppy-disk"></i>Lưu ${typeLabel}</button>`
  });
}

function openInventoryMasterDetail(type, id) {
  if (type === 'RAW_MATERIAL') return openMaterialModal(id);
  const item = inventoryMasterItem(id); if (!item) return;
  const rows = DB.inventory.filter((r)=>r.productId===id);
  const qty = rows.reduce((sum,r)=>sum+Number(r.qtyOnHand||0),0);
  const typeLabel = type === 'SEMI_FINISHED' ? 'Bán thành phẩm' : 'Thành phẩm';
  Modal.open({
    title: esc(item.name || id), sub: `${id} · ${typeLabel} · ${esc(inventoryItemCategory(item,type)||'Chưa phân loại')}`, size:'md',
    body:`<div class="info-grid">${infoItem('Mã hàng',`<span class="code">${esc(id)}</span>`)}${infoItem('Danh mục',esc(inventoryItemCategory(item,type)||'—'))}${infoItem('Đơn vị tính',esc(item.unit||'—'))}${infoItem('Đơn giá',fmtVND(Number(item.price||0)))}${infoItem('Tổng tồn',`<b class="num">${fmtN(qty)} ${esc(item.unit||'')}</b>`)}${infoItem('Quy cách',esc(item.spec||'—'))}</div>
      <div class="form-sec-title"><i class="fa-solid fa-warehouse"></i>Tồn theo kho/lô</div>${tableShell([{t:'Kho'},{t:'Lô'},{t:'Số lượng',cls:'right'}],rows.map(r=>`<tr><td>${esc(Q.warehouseName(r.warehouseId))}</td><td><span class="code">${esc(Q.lot(r.lotId)?.lotNumber||'—')}</span></td><td class="right num">${fmtN(r.qtyOnHand)} ${esc(r.unit||item.unit||'')}</td></tr>`),{emptyTitle:'Chưa phát sinh tồn kho'})}`,
    foot:`<button class="btn" data-act="modal-close">Đóng</button><button class="btn btn-primary" data-act="inventory-item-edit" data-type="${type}" data-id="${esc(id)}"><i class="fa-solid fa-pen"></i>Sửa</button>`
  });
}

function openItemCategoryManager(type='RAW_MATERIAL') {
  const labels={RAW_MATERIAL:'Danh mục nguyên liệu',SEMI_FINISHED:'Danh mục bán thành phẩm',FINISHED_GOODS:'Danh mục thành phẩm'};
  // [DATA CONSISTENCY] Mỗi tên danh mục chỉ hiển thị một lần trong master.
  // InventoryAPI cũng dọn record trùng trên KIO, nhưng UI vẫn tự bảo vệ để cache
  // cũ không làm xuất hiện 2 dòng Bao bì / Phụ gia trong lúc server refresh.
  const seenCategoryNames = new Set();
  const cats=(DB.itemCategories||[])
    .filter(c=>c.type===type && c.status!=='inactive')
    .sort((a,b)=>String(a.id||'').localeCompare(String(b.id||''),'vi',{numeric:true}))
    .filter(c=>{ const key=String(c.name||'').trim().toLocaleLowerCase('vi'); if(!key||seenCategoryNames.has(key)) return false; seenCategoryNames.add(key); return true; });
  Modal.open({title:labels[type]||'Danh mục hàng hóa',sub:'Tạo danh mục trước, sau đó hệ thống dùng mã viết tắt để tự sinh mã hàng.',size:'lg',body:`
    <div data-category-manager-type="${type}"></div>
    <div class="form-grid" style="align-items:end;margin-bottom:14px">
      <div class="field"><label>Tên danh mục</label><input class="inp" id="newItemCategoryName" placeholder="Ví dụ: Bao bì"></div>
      <div class="field"><label>Mã viết tắt</label><input class="inp" id="newItemCategoryPrefix" maxlength="8" placeholder="Ví dụ: BB"><div class="cell-sub" style="margin-top:5px">Có thể để trống để hệ thống tự gợi ý.</div></div>
      <div class="field"><button type="button" class="btn btn-primary" data-act="item-category-add" data-type="${type}"><i class="fa-solid fa-plus"></i>Thêm danh mục</button></div>
    </div>
    ${tableShell([{t:'Mã danh mục'},{t:'Tên danh mục'},{t:'Mã viết tắt'},{t:'Ví dụ mã hàng'},{t:'',cls:'right'}],cats.map(c=>{const prefix=inventoryCategoryCodePrefix(type,c.name);return `<tr><td><span class="code">${esc(c.id)}</span></td><td class="strong">${esc(c.name)}</td><td><input class="inp category-prefix-input" data-id="${esc(c.id)}" value="${esc(prefix)}" maxlength="8" style="width:100px;text-transform:uppercase"></td><td><span class="code">${esc(prefix)}-0001</span></td><td class="right">${rowActions([{act:'item-category-prefix-save',data:`data-id="${esc(c.id)}"`,icon:'fa-floppy-disk',title:'Lưu mã viết tắt'},{act:'item-category-delete',data:`data-id="${esc(c.id)}"`,icon:'fa-trash',title:'Xóa danh mục'}])}</td></tr>`}),{emptyTitle:'Chưa có danh mục'})}`,
    foot:'<button class="btn" data-act="modal-close">Đóng</button>'});
}

/** Phiếu nhập / xuất kho thủ công. Giữ nguyên nghiệp vụ cũ; chỉ khôi phục hàm
 * đã bị comment để action stock-move không trỏ tới function undefined. */
function openStockMoveModal(id) {
  const m = Q.material(id);
  if (!m) return;
  Modal.open({
    title: 'Phiếu nhập / xuất kho',
    sub: `${m.id} · ${esc(m.name)} · Tồn hiện tại ${fmtDec(m.stock, 2)} ${esc(m.unit)}`,
    body: `<div class="form-grid">
        <div class="field"><label>Loại phiếu</label>
          <select class="inp" id="smType"><option value="in">Nhập kho</option><option value="out">Xuất kho</option></select></div>
        <div class="field"><label>Số lượng (${esc(m.unit)}) <span class="req">*</span></label>
          <input class="inp num" type="number" id="smQty" min="0" step="0.01" value="" placeholder="0" /></div>
        <div class="field"><label>Ngày chứng từ</label><input class="inp" type="date" id="smDate" value="${currentDateYMD()}" min="${currentDateYMD()}" /></div>
        <div class="field"><label>Tham chiếu</label><input class="inp" id="smRef" placeholder="LSX-2026-0048 / YCM-2026-0046" /></div>
      </div>
      <div class="field"><label>Diễn giải</label><textarea class="inp" id="smNote" rows="2" placeholder="Xuất vật tư cho lệnh sản xuất…"></textarea></div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button>
           <button class="btn btn-primary" data-act="stock-move-save" data-id="${m.id}"><i class="fa-solid fa-floppy-disk"></i>Ghi phiếu</button>`,
  });
}

/* ------------------------------------------------------------ TỒN KHO */
// [FILTER THỜI GIAN KHO] Chỉ lọc dữ liệu hiển thị theo ngày chứng từ/cập nhật.
// Không thay đổi tồn kho, lô, phiếu hay bất kỳ logic InventoryService nào.
function inventoryInDateRange(dateValue, fromValue, toValue) {
  const d = String(dateValue || '').slice(0, 10);
  if (!d) return !(fromValue || toValue);
  if (fromValue && d < fromValue) return false;
  if (toValue && d > toValue) return false;
  return true;
}
function inventoryDateRangeInputs(key, f, fromField = 'dateFrom', toField = 'dateTo') {
  return `<label style="display:flex;align-items:center;gap:5px"><span class="muted" style="font-size:11px;white-space:nowrap">Từ ngày</span><input class="inp" type="date" data-f="${key}.${fromField}" value="${esc(f[fromField] || '')}" style="width:140px" /></label>
    <label style="display:flex;align-items:center;gap:5px"><span class="muted" style="font-size:11px;white-space:nowrap">Đến ngày</span><input class="inp" type="date" data-f="${key}.${toField}" value="${esc(f[toField] || '')}" style="width:140px" /></label>`;
}

Views.inventory = function () {
  const f = F('inventory', { q: '', stockTab: 'raw', warehouse: '', category: '', stockStatus: '', expandedProductId: '', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const stockTab = f.stockTab || 'raw';
  const stockTabConfig = {
    raw: { label: 'Kho nguyên liệu', type: 'RAW_MATERIAL', icon: 'fa-seedling', itemLabel: 'Nguyên liệu' },
    semi: { label: 'Kho bán thành phẩm', type: 'SEMI_FINISHED', icon: 'fa-cubes-stacked', itemLabel: 'Bán thành phẩm' },
    finished: { label: 'Kho thành phẩm', type: 'FINISHED_GOODS', icon: 'fa-box', itemLabel: 'Thành phẩm' },
  };
  const cfg = stockTabConfig[stockTab] || stockTabConfig.raw;
  const finishedMinStock = DB.finishedMinStock || {};
  // Chỉ đổi nhãn hiển thị trong Tồn kho: Kho = địa điểm vật lý, Kệ = Khu + Kệ.
  // Không thay đổi warehouseId/locationId hay logic nghiệp vụ đang dùng ở các màn khác.
  const inventoryWarehouseLabel = (warehouseId) => {
    const wh = Q.warehouse(warehouseId);
    if (!wh) return '—';
    const place = String(wh.name || '')
      .replace(/^Kho\s+Nguyên liệu\s*-\s*/i, '')
      .replace(/^Kho\s+Bán thành phẩm\s*-\s*/i, '')
      .replace(/^Kho\s+Thành phẩm\s*-\s*/i, '')
      .trim();
    return place ? `Kho ${place}` : (wh.name || '—');
  };
  const inventoryLocationLabel = (locationId) => {
    const raw = String(Q.locationName(locationId) || '—');
    const m = raw.match(/^Kệ\s+([^\s]+)\s*-\s*(.+)$/i);
    if (!m) return raw;
    const shelf = m[1];
    let area = m[2].trim();
    area = area
      .replace(/^Nguyên liệu\s+/i, '')
      .replace(/^BTP\s+/i, '')
      .replace(/^Thành phẩm\s+/i, '');
    return `Khu ${area.charAt(0).toLowerCase()}${area.slice(1)} - Kệ ${shelf}`;
  };
  const warehouseIds = new Set(DB.warehouses.filter(w => w.type === cfg.type).map(w => w.id));
  const rowsSource = (DB.inventory || []).filter(row => warehouseIds.has(row.warehouseId));

  // Tồn kho là màn hình trạng thái của TOÀN BỘ master hàng hóa, không chỉ các mã đã phát sinh tồn.
  // Vì vậy nguyên liệu/BTP/TP vừa tạo vẫn phải xuất hiện với số lượng 0 sau khi refresh.
  const masterSource = cfg.type === 'RAW_MATERIAL'
    ? (DB.materials || [])
    : cfg.type === 'SEMI_FINISHED'
      ? (DB.semiFinishedProducts || [])
      : (DB.products || []);

  const masterIds = new Set(masterSource.map(item => item.id));

  const validRowsSource = rowsSource.filter(row =>
    masterIds.has(row.productId)
  );

  const groupMap = new Map();
  masterSource.forEach(item => {
    if (f.category && inventoryItemCategory(item, cfg.type) !== f.category) return;
    if (q && ![item.id, item.name, inventoryItemCategory(item, cfg.type), item.unit].some(v => String(v || '').toLowerCase().includes(q))) return;
    groupMap.set(item.id, { productId: item.id, qtyOnHand: 0, qtyPending: 0, qtyRejected: 0, qtyReserved: 0, rows: [] });
  });

  // Bổ sung các lô/tồn thực tế. Nếu tìm theo lô/PO/kho/kệ thì vẫn đưa đúng mã hàng vào kết quả.
  validRowsSource.forEach(row => {

      // Tồn kho chỉ được gắn vào master hàng hóa đang tồn tại.
      // Inventory cũ không còn master sẽ không tự tạo thêm dòng trên UI.
      if (!groupMap.has(row.productId)) return;

      const item = inventoryMasterItem(row.productId);
      const lot = Q.lot(row.lotId);

      const receipt = (DB.goodsReceipts || []).find(r =>
        (r.items || []).some(i =>
          i.lotId === row.lotId ||
          i.lotNumber === lot?.lotNumber
        )
      );

      if (f.warehouse && row.warehouseId !== f.warehouse) return;

      if (
        f.category &&
        inventoryItemCategory(item, cfg.type) !== f.category
      ) return;

      const rowMatchesQ = !q || [
        row.productId,
        item?.name,
        lot?.lotNumber,
        lot?.supplierLot,
        receipt?.poId,
        Q.warehouseName(row.warehouseId),
        Q.locationName(row.locationId)
      ].some(v =>
        String(v || '').toLowerCase().includes(q)
      );

      const masterMatchesQ = !q || [
        row.productId,
        item?.name,
        inventoryItemCategory(item, cfg.type),
        item?.unit
      ].some(v =>
        String(v || '').toLowerCase().includes(q)
      );

      if (!rowMatchesQ && !masterMatchesQ) return;

      const g = groupMap.get(row.productId);

      g.qtyOnHand += Number(row.qtyOnHand || 0);
      g.qtyPending += Number(row.qtyPending || 0);
      g.qtyRejected += Number(row.qtyRejected || 0);
      g.qtyReserved += Number(row.qtyReserved || 0);

      g.rows.push(row);
  });
  // [UI ONLY] Trạng thái tồn được tính từ số lượng thực tế, không thay đổi nghiệp vụ kho.
  // Hết hàng phải tách riêng khỏi Sắp hết: qty <= 0 => OUT; 0 < qty < min => LOW.
  const inventoryStockState = (group) => {
    const item = inventoryMasterItem(group.productId);
    const minimumStock = stockTab === 'raw'
      ? Number(item?.minStock || 0)
      : (stockTab === 'finished' ? Number(finishedMinStock[group.productId] || 0) : Number(item?.minStock || 0));
    const qty = Number(group.qtyOnHand || 0);
    if (qty <= 0) return 'OUT';
    if (minimumStock > 0 && qty < minimumStock) return 'LOW';
    return 'IN';
  };

  const dashboardGroups = [...groupMap.values()].sort((a,b) => {
    const ai = inventoryMasterItem(a.productId);
    const bi = inventoryMasterItem(b.productId);
    return String(ai?.name || a.productId).localeCompare(String(bi?.name || b.productId), 'vi', { sensitivity:'base', numeric:true });
  });

  // Nếu lọc thời gian, chỉ giữ mặt hàng có bản ghi tồn được cập nhật trong khoảng đã chọn.
  // Không có lọc thời gian thì vẫn hiển thị toàn bộ master như trước.
  const dashboardScopeGroups = dashboardGroups.filter((group) => {
    if (!f.dateFrom && !f.dateTo) return true;
    return group.rows.some((row) => inventoryInDateRange(row.lastUpdated, f.dateFrom, f.dateTo));
  });

  // Lọc trạng thái chỉ tác động danh sách hiển thị; master và tồn kho gốc không bị thay đổi.
  const groups = dashboardScopeGroups.filter(group => !f.stockStatus || inventoryStockState(group) === f.stockStatus);
  const pg = paged(groups, 'inventory');

  // [SALES TRACE] Tìm các đơn bán đang giữ chỗ đúng theo product + lot.
  // Click vào dòng giữ chỗ sẽ mở thẳng chi tiết đơn hàng tương ứng.
  const salesReservationsFor = (productId, lotId = '') => (DB.goodsIssues || [])
    .filter(gi => gi.type === 'SALES_ISSUE' && gi.status === 'PENDING_CONFIRMATION' && (gi.orderId || gi.refDoc))
    .flatMap(gi => (gi.items || [])
      .filter(it => String(it.productId || '') === String(productId || '') && (!lotId || String(it.lotId || '') === String(lotId || '')))
      .map(it => ({ orderId: gi.orderId || gi.refDoc, issueId: gi.id, qty: Number(it.qty || 0) })));

  const reservationLinks = (productId, lotId, unit) => {
    const rows = salesReservationsFor(productId, lotId);
    if (!rows.length) return '';
    const byOrder = new Map();
    rows.forEach(r => byOrder.set(r.orderId, Number(byOrder.get(r.orderId) || 0) + r.qty));
    return [...byOrder.entries()].map(([orderId, qty]) =>
      `<button type="button" class="btn btn-link btn-sm" style="padding:0;color:var(--blue);font-size:11px" data-act="open-order" data-id="${esc(orderId)}" title="Mở đơn hàng ${esc(orderId)}"><i class="fa-solid fa-cart-flatbed"></i> Giữ chỗ: ${fmtN(qty)} ${esc(unit || '')} · ${esc(orderId)}</button>`
    ).join('<br>');
  };

  const rows = pg.items.map(group => {
    const item = inventoryMasterItem(group.productId);
    const expanded = f.expandedProductId === group.productId;
    const lotRows = [...group.rows].sort((a,b) => {
      const al = Q.lot(a.lotId), bl = Q.lot(b.lotId);
      return String(al?.lotNumber || '').localeCompare(String(bl?.lotNumber || ''), 'vi', { numeric:true });
    });
    const minimumStock = stockTab === 'raw'
      ? Number(item?.minStock || 0)
      : (stockTab === 'finished' ? Number(finishedMinStock[group.productId] || 0) : 0);
    const qtyOnHand = Number(group.qtyOnHand || 0);
    const outOfStock = qtyOnHand <= 0;
    const lowStock = !outOfStock && minimumStock > 0 && qtyOnHand < minimumStock;
    const stockBadge = outOfStock
      ? ` · <span class="badge red"><i class="fa-solid fa-circle-xmark"></i> Hết hàng</span>`
      : lowStock
        ? ` · <span class="badge orange"><i class="fa-solid fa-triangle-exclamation"></i> Sắp hết hàng</span>`
        : ` · <span class="badge green"><i class="fa-solid fa-circle-check"></i> Còn hàng</span>`;
    const parent = `<tr class="clickable ${expanded ? 'inventory-group-selected' : ''} ${lowStock ? 'inventory-low-stock' : ''}" data-act="inv-stock-product-toggle" data-productid="${group.productId}" style="${expanded ? 'background:var(--teal-soft);box-shadow:inset 5px 0 0 var(--teal)' : ''}">
      <td>${cell2(esc(item?.name || group.productId), `${esc(group.productId)}${stockBadge}${Number(group.qtyPending||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--orange)"><i class="fa-solid fa-flask-vial"></i> Đang chờ kiểm tra chất lượng</div>` : ''}${Number(group.qtyRejected||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--red)"><i class="fa-solid fa-triangle-exclamation"></i> Có ${fmtN(group.qtyRejected)} ${esc(item?.unit || '')} không đạt QC · chờ xuất trả NCC</div>` : ''}${Number(group.qtyReserved||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--blue)">${reservationLinks(group.productId, '', item?.unit || '') || `<i class="fa-solid fa-cart-flatbed"></i> ${fmtN(group.qtyReserved)} ${esc(item?.unit || '')} đang chờ xác nhận xuất bán`}</div>` : ''}`)}</td>
      <td class="right strong num">${fmtN(group.qtyOnHand)} ${esc(item?.unit || lotRows[0]?.unit || '')}${Number(group.qtyPending||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--orange)">Chờ QC: ${fmtN(group.qtyPending)} ${esc(item?.unit || lotRows[0]?.unit || '')} · chưa tính vào tồn</div>` : ''}${Number(group.qtyReserved||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--blue)">${reservationLinks(group.productId, '', item?.unit || lotRows[0]?.unit || '') || `Giữ chỗ bán: ${fmtN(group.qtyReserved)} ${esc(item?.unit || lotRows[0]?.unit || '')} · chưa trừ tồn thật`}</div>` : ''}${minimumStock > 0 ? `<div class="cell-sub">Tối thiểu: ${fmtN(minimumStock)}</div>` : ''}</td>
      <td class="center"><span class="chip"><i class="fa-solid fa-layer-group"></i> ${lotRows.length} lô</span></td>
      <td>${esc([...new Set(lotRows.map(r=>inventoryWarehouseLabel(r.warehouseId)).filter(Boolean))].join(', '))}</td>
      <td class="right" style="white-space:nowrap">${rowActions([
        { act:'inventory-item-view', data:`data-type="${cfg.type}" data-id="${group.productId}"`, icon:'fa-eye', title:`Xem ${cfg.itemLabel.toLowerCase()}` },
        { act:'inventory-item-edit', data:`data-type="${cfg.type}" data-id="${group.productId}"`, icon:'fa-pen', title:'Sửa master' },
        { act:'inventory-item-delete', data:`data-type="${cfg.type}" data-id="${group.productId}"`, icon:'fa-trash', title:'Xóa master' },
      ])}<button class="btn btn-sm" data-act="inv-stock-product-toggle" data-productid="${group.productId}"><i class="fa-solid ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>${expanded ? 'Thu gọn' : 'Xem lô'}</button></td>
    </tr>`;
    if (!expanded) return parent;
    const child = `<tr class="inventory-lot-child"><td colspan="5" style="padding:0 14px 14px 28px;background:var(--surface-2)">
      <div style="border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-top:10px">
      ${tableShell(
        [{t:'Lô hệ thống'},{t:'Lô sản phẩm'},{t:'Số lượng',cls:'right'},{t:'Ngày nhập'},{t:'Hạn sử dụng'},{t:stockTab==='raw'?'Tham chiếu PO':'Tham chiếu'},{t:'Kho'},{t:'Kệ / vị trí'},{t:'',cls:'right',w:'70px'}],
        lotRows.map(row => {
          const lot = Q.lot(row.lotId);
          const receipt = (DB.goodsReceipts || []).find(r => (r.items || []).some(i => i.lotId === row.lotId || i.lotNumber === lot?.lotNumber));
          const receiptDate = receipt?.date || String(row.lastUpdated||'').slice(0,10);
          return `<tr class="clickable" data-act="inv-stock-lot-view" data-productid="${row.productId}" data-lotid="${row.lotId}">
            <td><span class="code">${esc(lot?.lotNumber || '—')}</span></td>
            <td>${esc(lot?.supplierLot || '—')}</td>
            <td class="right strong num">${fmtN(Number(row.qtyPending||0)>0 && Number(row.qtyOnHand||0)<=0 ? Number(row.qtyPending||0) : Number(row.qtyOnHand||0))} ${esc(row.unit || item?.unit || '')}${Number(row.qtyPending||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--orange)">${Number(row.qtyOnHand||0)>0 ? `Chờ QC: ${fmtN(row.qtyPending)} ${esc(row.unit || item?.unit || '')} · chưa tính vào tồn` : 'Đang chờ kiểm tra chất lượng · chưa tính vào tồn'}</div>` : ''}${Number(row.qtyRejected||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--red)">Lô nhập ${fmtN(Number(row.receivedQty||0) || (Number(row.qtyOnHand||0)+Number(row.qtyRejected||0)))} ${esc(row.unit || item?.unit || '')} có ${fmtN(row.qtyRejected)} không đạt · chờ trả NCC</div>` : ''}${Number(row.qtyReserved||0)>0 ? `<div class="cell-sub" style="margin-top:4px;color:var(--blue)">${reservationLinks(row.productId, row.lotId, row.unit || item?.unit || '') || `${fmtN(row.qtyReserved)} ${esc(row.unit || item?.unit || '')} đang giữ chỗ · chờ xác nhận xuất bán`}</div>` : ''}</td>
            <td class="num">${fmtDate(receiptDate)}</td>
            <td class="num">${lot?.expiryDate ? fmtDate(lot.expiryDate) : '—'}</td>
            <td>${receipt?.poId ? `<span class="code" style="color:var(--primary)">${esc(receipt.poId)}</span>` : `<span class="muted">${esc(lot?.productionOrderId || '—')}</span>`}</td>
            <td>${esc(inventoryWarehouseLabel(row.warehouseId))}</td>
            <td>${esc(inventoryLocationLabel(row.locationId))}</td>
            <td>${rowActions([{ act:'inv-stock-lot-view', data:`data-productid="${row.productId}" data-lotid="${row.lotId}"`, icon:'fa-eye', title:'Xem chi tiết' }])}</td>
          </tr>`;
        }), { emptyTitle:'Không có lô tồn kho' })}
      </div></td></tr>`;
    return parent + child;
  });

  return `
  ${pageHead('Tồn kho', 'Theo dõi tồn kho tổng hợp theo mặt hàng; click để xem chi tiết từng lô ngay bên dưới', `
    <button class="btn" data-act="inv-export-stock"><i class="fa-solid fa-file-export"></i>Export</button>
    <button class="btn" data-act="item-category-manager" data-type="${cfg.type}"><i class="fa-solid fa-tags"></i>Danh mục</button>
    <button class="btn btn-primary" data-act="inventory-item-add" data-type="${cfg.type}"><i class="fa-solid fa-plus"></i>Thêm ${cfg.itemLabel.toLowerCase()}</button>
  `)}
  <div class="tabs" style="margin-bottom:14px">
    <button class="tab ${stockTab === 'raw' ? 'active' : ''}" data-act="inventory-stock-tab" data-tab="raw"><i class="fa-solid fa-seedling"></i>Kho nguyên liệu</button>
    <button class="tab ${stockTab === 'semi' ? 'active' : ''}" data-act="inventory-stock-tab" data-tab="semi"><i class="fa-solid fa-cubes-stacked"></i>Kho bán thành phẩm</button>
    <button class="tab ${stockTab === 'finished' ? 'active' : ''}" data-act="inventory-stock-tab" data-tab="finished"><i class="fa-solid fa-box"></i>Kho thành phẩm</button>
  </div>
  <!-- Dashboard riêng của subtab tồn kho hiện tại. Chỉ tổng hợp dữ liệu, không thay đổi nghiệp vụ. -->
  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi(`Tổng ${cfg.itemLabel.toLowerCase()}`, dashboardScopeGroups.length, 'fa-box', 'blue', 'inventory-dashboard-all')}
    ${mkpi('Còn hàng', dashboardScopeGroups.filter(g => inventoryStockState(g) === 'IN').length, 'fa-circle-check', 'green', 'inventory-dashboard-in')}
    ${mkpi('Sắp hết hàng', dashboardScopeGroups.filter(g => inventoryStockState(g) === 'LOW').length, 'fa-triangle-exclamation', 'orange', 'inventory-dashboard-low')}
    ${mkpi('Hết hàng', dashboardScopeGroups.filter(g => inventoryStockState(g) === 'OUT').length, 'fa-circle-xmark', 'red', 'inventory-dashboard-out')}
    ${mkpi('Tổng số lượng tồn', fmtN(dashboardScopeGroups.reduce((sum,g)=>sum+Number(g.qtyOnHand||0),0)), 'fa-boxes-stacked', 'teal', 'inventory-dashboard-all')}
  </div>
  <div class="card">
    <div class="toolbar">
      ${searchBox('inventory', `Tìm ${cfg.itemLabel.toLowerCase()}, lô, khu, kệ…`)}
      ${selectFilter('inventory','category',inventoryCategories(cfg.type).map(c=>[c,c]),'Tất cả danh mục')}
      ${selectFilter('inventory','stockStatus',[['IN','Còn hàng'],['LOW','Sắp hết hàng'],['OUT','Hết hàng']],'Tất cả trạng thái')}
      ${selectFilter('inventory','warehouse',DB.warehouses.filter(w=>w.type===cfg.type).map(w=>[w.id,w.name]),'Tất cả kho')}
      ${inventoryDateRangeInputs('inventory', f)}
      ${(f.q || f.category || f.stockStatus || f.warehouse || f.dateFrom || f.dateTo) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="inventory"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}
      <span class="spacer"></span><span class="chip"><i class="fa-solid fa-list"></i> ${fmtN(groups.length)} ${cfg.itemLabel.toLowerCase()}</span>
    </div>
    ${tableShell(
      [{t:cfg.itemLabel},{t:'Tổng số lượng',cls:'right'},{t:'Số lô',cls:'center'},{t:'Kho đang lưu'},{t:'Thao tác',cls:'right',w:'110px'}],
      rows, { emptyTitle: `Chưa có ${cfg.itemLabel.toLowerCase()} trong kho` })}
    ${pagiHTML('inventory', pg, cfg.itemLabel.toLowerCase())}
  </div>`;
};

function openInventoryStockLotDetail(productId, lotId) {
  const row = DB.inventory.find(r => r.productId === productId && r.lotId === lotId);
  if (!row) return;
  const material = Q.material(productId);
  const product = Q.product(productId);
  const item = material || product;
  const lot = Q.lot(lotId);
  const receipts = (DB.goodsReceipts || []).filter(r => (r.items || []).some(i => i.lotId === lotId || i.lotNumber === lot?.lotNumber));

  // Tìm người đã kiểm tra đúng lô này. Ưu tiên materialInspections vì đây là dấu vết QC chi tiết.
  const inspections = (DB.materialInspections || [])
    .filter(ins => (ins.items || []).some(i => i.lotId === lotId && i.materialId === productId))
    .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
  const latestInspection = inspections[0] || null;
  const receiptInspection = receipts.find(r => r.inspectedBy) || null;
  const inspectorId = latestInspection?.inspectorId || receiptInspection?.inspectedBy || '';

  // Lịch sử trả NCC của đúng lô. Phiếu RETURN_OUT là chứng từ xuất trả thực tế.
  const returnIssues = (DB.goodsIssues || [])
    .filter(g => g.type === 'RETURN_OUT' && (g.items || []).some(i => i.productId === productId && i.lotId === lotId))
    .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));

  // Lịch sử xuất/sử dụng của lô, không bao gồm trả NCC vì đã hiển thị thành bảng riêng phía trên.
  const usageIssues = (DB.goodsIssues || [])
    .filter(g => g.type !== 'RETURN_OUT' && (g.items || []).some(i => i.productId === productId && i.lotId === lotId))
    .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));

  const issuePurpose = type => ({
    PRODUCTION_ISSUE:'Xuất sản xuất', SALES_ISSUE:'Xuất bán hàng', ADJUSTMENT_OUT:'Xuất điều chỉnh',
    TRANSFER_OUT:'Xuất chuyển kho', SUBCONTRACT_ISSUE:'Xuất gia công', RETURN_OUT:'Xuất trả NCC'
  }[type] || type || 'Xuất kho');

  Modal.open({
    title: `${item?.name || productId}`,
    sub: `${productId} · Lô ${lot?.lotNumber || lotId}`,
    size: 'lg',
    body: `
      <div class="info-grid" style="margin-bottom:16px">
        ${infoItem('Số lượng tồn', `<b class="num">${fmtDec(row.qtyOnHand,3)} ${esc(row.unit || item?.unit || '')}</b>`)}
        ${infoItem('Lô hệ thống', `<span class="code">${esc(lot?.lotNumber || '—')}</span>`)}
        ${infoItem('Lô sản phẩm', esc(lot?.supplierLot || '—'))}
        ${infoItem('Ngày sản xuất', lot?.mfgDate ? fmtDate(lot.mfgDate) : '—')}
        ${infoItem('Hạn sử dụng', lot?.expiryDate ? fmtDate(lot.expiryDate) : '—')}
        ${infoItem('Khu', esc(Q.warehouseName(row.warehouseId)))}
        ${infoItem('Vị trí', esc(Q.locationName(row.locationId)))}
        ${infoItem('PO tham chiếu', receipts[0]?.poId ? `<span class="code">${esc(receipts[0].poId)}</span>` : '—')}
        ${infoItem('Ngày nhập gần nhất', receipts[0]?.date ? fmtDate(receipts[0].date) : fmtDate(String(row.lastUpdated||'').slice(0,10)))}
        ${infoItem('Người kiểm tra QC', inspectorId ? esc(Q.employeeName(inspectorId)) : 'Chưa kiểm tra / không áp dụng')}
        ${infoItem('Kết quả QC', latestInspection?.status ? statusLabel(latestInspection.status) : (lot?.qcStatus ? statusLabel(lot.qcStatus) : '—'))}
      </div>
      <div class="form-sec-title"><i class="fa-solid fa-clock-rotate-left"></i>Lịch sử nhập của lô</div>
      ${tableShell([{t:'Phiếu nhập'},{t:'Ngày'},{t:'PO'},{t:'Số lượng',cls:'right'}], receipts.flatMap(r => (r.items||[]).filter(i => i.lotId===lotId || i.lotNumber===lot?.lotNumber).map(i => `<tr><td><span class="code">${r.id}</span></td><td>${fmtDate(r.date)}</td><td>${esc(r.poId||'—')}</td><td class="right num">${fmtDec(i.qty,3)} ${esc(i.unit||'')}</td></tr>`)), {emptyTitle:'Chưa có lịch sử phiếu nhập cho lô này'})}

      <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-rotate-left"></i>Lịch sử trả nhà cung cấp</div>
      ${tableShell(
        [{t:'Phiếu trả'},{t:'Ngày'},{t:'Tham chiếu'},{t:'Số lượng trả',cls:'right'},{t:'Người lập'},{t:'Trạng thái'}],
        returnIssues.flatMap(g => (g.items||[]).filter(i=>i.productId===productId && i.lotId===lotId).map(i => `<tr><td><span class="code">${esc(g.id)}</span></td><td>${fmtDate(g.date)}</td><td>${esc(g.refDoc||g.poId||g.returnRequestId||'—')}</td><td class="right num strong">${fmtDec(i.qty,3)} ${esc(i.unit||row.unit||'')}</td><td>${esc(Q.employeeName(g.createdBy))}</td><td>${badge(g.status)}</td></tr>`)),
        {emptyTitle:'Lô này chưa phát sinh trả nhà cung cấp'}
      )}

      <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-arrow-up-from-bracket"></i>Lịch sử xuất / sử dụng của lô</div>
      ${tableShell(
        [{t:'Phiếu xuất'},{t:'Ngày'},{t:'Mục đích sử dụng'},{t:'Chứng từ tham chiếu'},{t:'Số lượng',cls:'right'},{t:'Người lập'}],
        usageIssues.flatMap(g => (g.items||[]).filter(i=>i.productId===productId && i.lotId===lotId).map(i => `<tr><td><span class="code">${esc(g.id)}</span></td><td>${fmtDate(g.date)}</td><td>${esc(issuePurpose(g.type))}</td><td>${g.refDoc ? `<span class="code">${esc(g.refDoc)}</span>` : '—'}</td><td class="right num strong">${fmtDec(i.qty,3)} ${esc(i.unit||row.unit||'')}</td><td>${esc(Q.employeeName(g.createdBy))}</td></tr>`)),
        {emptyTitle:'Lô này chưa phát sinh xuất kho / sử dụng'}
      )}`,
    foot: '<button class="btn" data-act="modal-close">Đóng</button>'
  });
}

Views.warehouse = function () {
  const tab = State.tab || 'dashboard';
  switch (tab) {

    case 'dashboard':
      return Views['inv-overview']
        ? Views['inv-overview']()
        : '';

    case 'inventory':
      return Views.inventory
        ? Views.inventory()
        : '';

    case 'receipts':
      return Views['inv-receipts']
        ? Views['inv-receipts']()
        : '';

    case 'issues':
      return Views['inv-issues']
        ? Views['inv-issues']()
        : '';

    case 'transfers':
      return Views['inv-transfers']
        ? Views['inv-transfers']()
        : '';

    case 'stocktake':
      return Views['inv-counts']
        ? Views['inv-counts']()
        : '';

    case 'batches':
      return Views['inv-lots']
        ? Views['inv-lots']()
        : '';

    case 'defects':
      return Views['inv-defects']
        ? Views['inv-defects']()
        : '';

    case 'locations':
      return Views['inv-warehouses']
        ? Views['inv-warehouses']()
        : '';

    case 'alerts':
      return Views['inv-alerts']
        ? Views['inv-alerts']()
        : '';

    default:
      return '';
  }
};

/** Modal Xem Chi tiết Đơn đặt hàng PO */

/** Modal Nhập kho nguyên vật liệu từ PO (Hỗ trợ Nhập kho từng phần - Partial Receipt) */

/** Modal Ghi nhận Thanh toán Công nợ Nhà cung cấp */

/* ============================================================================
 * MODULE: PHÂN HỆ KHO (INVENTORY)
 * inv-overview | inv-receipts | inv-issues | inv-transfers | inv-counts | inv-lots
 * ==========================================================================*/

/* ------------- Màn 1: TỔNG QUAN TỒN KHO --------------------------------- */
Views['inv-overview'] = function () {
  const f = F('inv-overview', { q: '', warehouseId: '', status: '', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const today = new Date(DB.today + 'T00:00:00');
  const nearDays = DB.inventoryAlertConfig.nearExpiryDays;

  // [DASHBOARD CONSISTENCY] KPI lấy cùng nguồn DB.inventory đang dùng để
  // render bảng tồn thực tế. Không dùng material.stock/value cache vì có thể lệch
  // sau nhập kho/QC/chuyển kho hoặc khi vừa refresh từ server.
  const inventoryRows = DB.inventory || [];
  const inventoryRowsScope = inventoryRows.filter((row) => inventoryInDateRange(row.lastUpdated, f.dateFrom, f.dateTo));
  const totalSKU = new Set(inventoryRowsScope.filter(i => Number(i.qtyOnHand || 0) !== 0).map((i) => i.productId)).size;
  const totalOnHand = inventoryRowsScope.reduce((s, i) => s + Number(i.qtyOnHand || 0), 0);
  const inventoryVal = inventoryRowsScope.reduce((sum, row) => {
    const master = (DB.materials || []).find(m => m.id === row.productId) || (DB.products || []).find(p => p.id === row.productId);
    return sum + Number(row.qtyOnHand || 0) * Number(master?.price || 0);
  }, 0);
  const scopeProductIds = new Set(inventoryRowsScope.map((row) => row.productId));
  const scopeLotIds = new Set(inventoryRowsScope.map((row) => row.lotId).filter(Boolean));
  const lowStockCnt = Q.lowStockAlerts().filter((x) => !f.dateFrom && !f.dateTo ? true : scopeProductIds.has(x.material?.id)).length;
  const nearExpiryCnt = Q.nearExpiryLots().filter((lot) => !f.dateFrom && !f.dateTo ? true : scopeLotIds.has(lot.id)).length;
  const expiredCnt = Q.expiredLots().filter((lot) => !f.dateFrom && !f.dateTo ? true : scopeLotIds.has(lot.id)).length;

  // Lọc danh sách tồn kho
  const list = DB.inventory.filter((inv) => {
    if (f.warehouseId && inv.warehouseId !== f.warehouseId) return false;
    if (!inventoryInDateRange(inv.lastUpdated, f.dateFrom, f.dateTo)) return false;
    const lot = DB.inventoryLots.find((l) => l.id === inv.lotId);
    const mat = DB.materials.find((m) => m.id === inv.productId) || DB.products.find((p) => p.id === inv.productId);
    if (q && ![(mat ? mat.name : ''), inv.productId, inv.warehouseId, inv.locationId].some((v) => String(v).toLowerCase().includes(q))) return false;
    const exp = lot ? new Date(lot.expiryDate + 'T00:00:00') : null;
    if (f.status === 'near_expiry') return exp && exp >= today && (exp - today) / 86400000 <= nearDays;
    if (f.status === 'expired') return exp && exp < today;
    if (f.status === 'low_stock') {
      const m = DB.materials.find((x) => x.id === inv.productId);
      const actual = inventoryRows.filter(r => r.productId === inv.productId).reduce((sum,r)=>sum+Number(r.qtyOnHand||0),0);
      return m && actual < Number(m.minStock || 0);
    }
    return true;
  });
  const pg = paged(list, 'inv-overview');

  const warehouses = DB.warehouses.map((w) => [w.id, w.name]);

  const rows = pg.items.map((inv) => {
    const lot = DB.inventoryLots.find((l) => l.id === inv.lotId);
    const mat = DB.materials.find((m) => m.id === inv.productId) || DB.products.find((p) => p.id === inv.productId);
    const wh = DB.warehouses.find((w) => w.id === inv.warehouseId);
    const loc = DB.warehouseLocations.find((l) => l.id === inv.locationId);
    const exp = lot ? new Date(lot.expiryDate + 'T00:00:00') : null;
    const daysLeft = exp ? Math.round((exp - today) / 86400000) : null;
    let expBadge = '';
    if (exp) {
      if (daysLeft < 0) expBadge = `<span class="badge red">Hết hạn ${Math.abs(daysLeft)} ngày</span>`;
      else if (daysLeft <= nearDays) expBadge = `<span class="badge orange">Còn ${daysLeft} ngày</span>`;
      else expBadge = `<span class="badge green">Còn ${daysLeft} ngày</span>`;
    }
    return `<tr class="clickable" data-act="inv-lot-detail" data-lotid="${inv.lotId}">
      <td><span class="code">${inv.productId}</span></td>
      <td>${cell2(esc(mat ? mat.name : inv.productId), '')}</td>
      <td><span class="chip">${esc(wh ? wh.name : inv.warehouseId)}</span></td>
      <td class="muted" style="font-size:12px">${esc(loc ? loc.name : inv.locationId)}</td>
      <td>${lot ? `<span class="code" style="font-size:11px">${lot.lotNumber}</span>` : '—'}</td>
      <td>${lot ? `<span class="code" style="font-size:11px">${esc(lot.supplierLot || '—')}</span>` : '—'}</td>
      <td class="num">${lot ? fmtDate(lot.mfgDate) : '—'}</td>
      <td>${expBadge || (lot ? fmtDate(lot.expiryDate) : '—')}</td>
      <td class="right strong num">${fmtDec(inv.qtyOnHand, 2)} ${esc(inv.unit)}</td>
      <td class="right num muted">${fmtDec(inv.qtyReserved, 2)}</td>
      <td class="right strong num" style="color:${inv.qtyAvailable <= 0 ? 'var(--red)' : 'var(--green)'}">${fmtDec(inv.qtyAvailable, 2)}</td>
    </tr>`;
  });

  return `
  ${pageHead('Tổng quan tồn kho', `${totalSKU} SKU · Tổng tồn ${fmtShort(inventoryVal)}`, `
    <button class="btn" data-act="inv-export-stock"><i class="fa-solid fa-file-export"></i>Xuất Excel</button>
    <button class="btn btn-primary" data-act="inv-new-receipt"><i class="fa-solid fa-plus"></i>Lập phiếu nhập</button>
  `)}
  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi('Tổng SKU', totalSKU, 'fa-boxes-stacked', 'blue', 'warehouse-dashboard-open-inventory')}
    ${mkpi('Tồn kho thực tế', fmtN(totalOnHand), 'fa-warehouse', 'teal', 'warehouse-dashboard-open-inventory')}
    ${mkpi('Giá trị tồn kho', fmtShort(inventoryVal), 'fa-sack-dollar', 'indigo', 'warehouse-dashboard-open-inventory')}
    ${mkpi('Dưới tồn tối thiểu', lowStockCnt, 'fa-triangle-exclamation', 'orange', 'warehouse-dashboard-open-low')}
    ${mkpi('Lô cận hạn ≤' + nearDays + ' ngày', nearExpiryCnt, 'fa-calendar-minus', 'orange', 'warehouse-dashboard-open-near-expiry')}
    ${mkpi('Lô đã hết hạn', expiredCnt, 'fa-circle-xmark', 'red', 'warehouse-dashboard-open-expired')}
  </div>

  ${expiredCnt > 0 ? `
  <div class="alert-item" style="border-color:var(--red);background:var(--red-soft);margin-bottom:14px">
    <span class="alert-ico t-red"><i class="fa-solid fa-circle-xmark"></i></span>
    <span style="min-width:0">
      <span class="alert-title" style="color:var(--red)">CÓ ${expiredCnt} LÔ ĐÃ HẾT HẠN SỬ DỤNG</span>
      <div class="alert-sub">Cần xử lý ngay — chuyển sang kho hàng lỗi hoặc tiêu hủy theo quy trình</div>
    </span>
    <button class="btn btn-sm" data-act="inv-tab" data-tab="lots" style="flex-shrink:0">Xem lô hết hạn</button>
  </div>` : ''}

  <div class="card">
    <div class="toolbar">
      ${searchBox('inv-overview', 'Tìm mã hàng, tên hàng, kho…')}
      ${selectFilter('inv-overview', 'warehouseId', warehouses, 'Tất cả kho')}
      ${selectFilter('inv-overview', 'status', [['near_expiry', '⚠ Cận hạn'], ['expired', '❌ Hết hạn'], ['low_stock', '⬇ Dưới tồn min']], 'Tất cả tình trạng')}
      ${inventoryDateRangeInputs('inv-overview', f)}
      ${(f.q || f.warehouseId || f.status || f.dateFrom || f.dateTo) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="inv-overview"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}
      <span class="spacer"></span>
      <span class="chip"><i class="fa-solid fa-list"></i> ${fmtN(list.length)} bản ghi</span>
    </div>
    ${tableShell(
      [{ t: 'Mã hàng', w: '90px' }, { t: 'Tên hàng' }, { t: 'Kho' }, { t: 'Vị trí', cls: 'hide-sm' },
       { t: 'Lô hệ thống', cls: 'hide-sm' }, { t: 'Lô NCC', cls: 'hide-sm' }, { t: 'NSX' }, { t: 'HSD / Còn lại' },
       { t: 'On Hand', cls: 'right' }, { t: 'Reserved', cls: 'right hide-sm' }, { t: 'Available', cls: 'right' }],
      rows, { emptyTitle: 'Không có dữ liệu tồn kho', emptyDesc: 'Hãy nhập kho để bắt đầu theo dõi tồn kho.' })}
    ${pagiHTML('inv-overview', pg, 'bản ghi')}
  </div>`;
};

/* ------------- Màn 2: NHẬP KHO ------------------------------------------ */
Views['inv-receipts'] = function () {
  const f = F('inv-receipts', { q: '', status: '', supplier: '', receiptTab: 'raw', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const receiptTab = f.receiptTab || 'raw';
  const cfgs = {
    raw: { label:'Kho nguyên liệu', type:'RAW_MATERIAL', icon:'fa-seedling' },
    semi:{ label:'Kho bán thành phẩm', type:'SEMI_FINISHED', icon:'fa-cubes-stacked' },
    finished:{ label:'Kho thành phẩm', type:'FINISHED_GOODS', icon:'fa-box' }
  };
  const cfg = cfgs[receiptTab] || cfgs.raw;
  const whIds = new Set(DB.warehouses.filter(w=>w.type===cfg.type).map(w=>w.id));
  let rowsData = [];
  if (receiptTab === 'raw') {
    rowsData = DB.purchaseOrders.filter(po => ['SHIPPING','PARTIAL_RECEIVED','RECEIVED'].includes(po.status)).map(po => {
      const receipts = Q.receiptsOfPo(po.id).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
      const ordered = (po.items||[]).reduce((n,i)=>n+Number(i.qty||0),0);
      const received = (po.items||[]).reduce((n,i)=>n+Number(i.receivedQty||0),0);
      const defectReceipts = receipts.filter(r=>['FAILED','PARTIAL_FAILED'].includes(r.inspectionStatus));
      const defectNote = defectReceipts.some(r=>r.defectType==='FULL_LOT') ? 'Lỗi nguyên lô' : defectReceipts.length ? 'Lỗi 1 phần' : '';
      return { kind:'po', id:po.id, po, receipts, ordered, received, defectNote, date:receipts[0]?.date || po.expectedDate || po.date };
    });
  } else {
    rowsData = (DB.goodsReceipts||[]).filter(r=>whIds.has(r.warehouseId)).map(r=>({kind:'receipt',id:r.id,r,date:r.date}));
    // Hàng gia công sau QC được chuyển cho Kho nhập, tương tự thành phẩm sản xuất.
    if (receiptTab === 'finished' && typeof subcontractV3Orders === 'function') {
      subcontractV3Orders().forEach(o => {
        const receipts = typeof subcontractV3Receipts === 'function' ? subcontractV3Receipts(o) : (o.receipts||[]);
        receipts.filter(r=>r.qcStatus==='DONE' && !r.warehoused).forEach(r=>rowsData.push({kind:'subcontract_receipt',id:r.id,o,r,date:r.qcAt?String(r.qcAt).slice(0,10):(r.date||DB.today)}));
      });
    }
  }
  rowsData = rowsData.filter(x=>{
    if (!inventoryInDateRange(x.date, f.dateFrom, f.dateTo)) return false;
    const text = x.kind==='po'
      ? [x.po.id,x.po.prId,Q.supplierName(x.po.supplierId),x.defectNote].join(' ')
      : x.kind==='subcontract_receipt'
        ? [x.r.id,x.o.id,x.o.partner,Q.product(x.o.productId)?.name,'gia công','chờ nhập kho'].join(' ')
        : [x.r.id,x.r.poId,x.r.note,Q.warehouseName(x.r.warehouseId)].join(' ');
    if (q && !text.toLowerCase().includes(q)) return false;
    if (receiptTab === 'raw' && x.kind === 'po') {
      if (f.status && x.po.status !== f.status) return false;
      if (f.supplier && x.po.supplierId !== f.supplier) return false;
    }
    return true;
  }).sort((a,b)=>{
    const hasFilter = Boolean(q || f.status || f.supplier);
    // Mặc định: giữ thứ tự cố định theo mã PO / mã phiếu, không bị thay đổi sau khi nhập kho.
    if (!hasFilter) return String(b.id||'').localeCompare(String(a.id||''), 'vi', { numeric:true, sensitivity:'base' });
    // Khi người dùng lọc/tìm kiếm, ưu tiên bản ghi có hoạt động mới hơn trong tập kết quả.
    const byDate = String(b.date||'').localeCompare(String(a.date||''));
    if (byDate) return byDate;
    return String(a.id||'').localeCompare(String(b.id||''), 'vi', { numeric:true, sensitivity:'base' });
  });
  const pg = paged(rowsData,'inv-receipts');
  const rows = pg.items.map(x=>{
    if (x.kind==='po') {
      const po=x.po; const canReceipt=['SHIPPING','PARTIAL_RECEIVED'].includes(po.status) && x.received < x.ordered;
      return `<tr>
        <td><span class="code">${po.id}</span><div class="cell-sub">${esc(po.prId||'')}</div></td>
        <td>${cell2(esc(Q.supplierName(po.supplierId)),esc((po.items||[]).map(i=>i.name).join(', ')))}</td>
        <td class="right num">${fmtN(x.received)} / ${fmtN(x.ordered)}</td>
        <td>${badge(po.status)}${x.defectNote?`<div style="margin-top:5px"><span class="badge red">${x.defectNote}</span></div>`:''}</td>
        <td class="num">${x.receipts[0]?fmtDate(x.receipts[0].date):'—'}</td>
        <td class="center">${x.receipts.length}</td>
        <td class="right">${rowActions([
          {act:'inv-po-receipt-history',data:`data-id="${po.id}"`,icon:'fa-eye',title:'Xem chi tiết'},
          ...(canReceipt?[{act:'inv-new-receipt',data:`data-poid="${po.id}"`,icon:'fa-file-circle-plus',title:'Lập phiếu nhập'}]:[])
        ])}</td>
      </tr>`;
    }
    if (x.kind==='subcontract_receipt') {
      const r=x.r,o=x.o,p=Q.product(o.productId);
      return `<tr class="clickable" data-act="subcontracting-open" data-id="${esc(o.id)}"><td>${cell2(`<span class="code">${esc(r.id)}</span>`,`<span class="code">${esc(o.id)}</span> · Gia công`)}</td><td>${fmtDate(x.date)}</td><td>${cell2('Kho thành phẩm','Chờ Kho xác nhận nhập')}</td><td>${cell2(esc(p?.name||o.productId),`QC đạt ${fmtN(r.goodQty||0)} · lỗi ${fmtN(r.defectQty||0)} ${esc(p?.unit||'')}`)}</td><td>QC/QA</td><td><span class="badge orange">Chờ nhập kho</span></td><td class="right">${rowActions([{act:'subcontracting-warehouse',data:`data-id="${esc(o.id)}" data-receipt="${esc(r.id)}"`,icon:'fa-warehouse',title:'Nhập kho hàng gia công'}])}</td></tr>`;
    }
    const r=x.r;
    return `<tr><td><span class="code">${r.id}</span></td><td>${fmtDate(r.date)}</td><td>${cell2(esc(Q.warehouseName(r.warehouseId)),esc(Q.locationName(r.locationId)))}</td><td>${esc((r.items||[]).map(i=>`${i.name||i.materialId}: ${fmtN(i.qty)} ${i.unit||''}`).join(', '))}</td><td>${esc(Q.employeeName(r.receivedBy))}</td><td>${badge(r.status)}</td><td></td></tr>`;
  });
  return `${pageHead('Nhập kho','Danh sách nhập kho theo từng loại kho; thao tác được thực hiện trực tiếp tại từng dòng',`
    <button class="btn" data-act="inv-export-receipts"><i class="fa-solid fa-file-export"></i>Xuất Excel</button>
    <button class="btn btn-primary" data-act="inv-new-receipt" data-tab="${receiptTab}"><i class="fa-solid fa-plus"></i>${receiptTab==='raw'?'Phiếu nhập kho nguyên liệu':receiptTab==='semi'?'Phiếu nhập kho bán thành phẩm':'Phiếu nhập kho thành phẩm'}</button>`)}
    <div class="tabs" style="margin-bottom:14px">
      <button class="tab ${receiptTab==='raw'?'active':''}" data-act="inventory-receipt-tab" data-tab="raw"><i class="fa-solid fa-seedling"></i>Kho nguyên liệu</button>
      <button class="tab ${receiptTab==='semi'?'active':''}" data-act="inventory-receipt-tab" data-tab="semi"><i class="fa-solid fa-cubes-stacked"></i>Kho bán thành phẩm</button>
      <button class="tab ${receiptTab==='finished'?'active':''}" data-act="inventory-receipt-tab" data-tab="finished"><i class="fa-solid fa-box"></i>Kho thành phẩm</button>
    </div>
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Chứng từ / PO', rowsData.length, 'fa-file-arrow-down', 'blue', 'inventory-receipts-all')}
      ${mkpi('Đã nhận đủ', receiptTab==='raw' ? rowsData.filter(x=>x.kind==='po' && x.po.status==='RECEIVED').length : rowsData.filter(x=>x.kind==='receipt').length, 'fa-circle-check', 'green', 'inventory-receipts-received')}
      ${mkpi(receiptTab==='finished'?'Chờ nhập kho':'Nhận một phần', receiptTab==='finished' ? rowsData.filter(x=>x.kind==='subcontract_receipt').length : (receiptTab==='raw' ? rowsData.filter(x=>x.kind==='po' && x.po.status==='PARTIAL_RECEIVED').length : 0), 'fa-box-open', 'orange', 'inventory-receipts-partial')}
      ${mkpi('Tổng SL đã nhập', fmtN(rowsData.reduce((sum,x)=>sum+(x.kind==='po'?Number(x.received||0):x.kind==='subcontract_receipt'?0:(x.r.items||[]).reduce((n,i)=>n+Number(i.qty||0),0)),0)), 'fa-boxes-stacked', 'teal')}
    </div>
    <div class="card"><div class="toolbar">${searchBox('inv-receipts','Tìm PO, phiếu nhập, NCC, khu…')}
      ${receiptTab==='raw' ? `${selectFilter('inv-receipts','status',[['SHIPPING','Đang giao hàng'],['PARTIAL_RECEIVED','Nhận một phần'],['RECEIVED','Đã nhận đủ']],'Tất cả trạng thái')}${selectFilter('inv-receipts','supplier',DB.suppliers.map(s=>[s.id,s.name]),'Tất cả NCC')}` : ''}
      ${inventoryDateRangeInputs('inv-receipts', f)}
      ${(f.q||f.status||f.supplier||f.dateFrom||f.dateTo)?'<button class="btn btn-sm" data-act="clear-filter" data-key="inv-receipts"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>':''}
      <span class="spacer"></span><span class="chip">${fmtN(rowsData.length)} dòng</span></div>
    ${receiptTab==='raw' ? tableShell([{t:'Mã PO'},{t:'NCC / Nguyên liệu'},{t:'Đã nhập / Đặt',cls:'right'},{t:'Trạng thái / QC'},{t:'Nhập gần nhất'},{t:'Số đợt',cls:'center'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:'Chưa có đơn hàng nhập kho'}) : tableShell([{t:'Phiếu nhập'},{t:'Ngày'},{t:'Khu / Kệ'},{t:'Nội dung'},{t:'Người nhập'},{t:'Trạng thái'},{t:'Thao tác'}],rows,{emptyTitle:`Chưa có dữ liệu ${cfg.label.toLowerCase()}`})}
    ${pagiHTML('inv-receipts',pg,'dòng')}</div>`;
};

/* ------------- Màn 3: XUẤT KHO ------------------------------------------ */
Views['inv-issues'] = function () {
  const f = F('inv-issues', { q:'', type:'', kind:'', issueTab:'raw', dateFrom:'', dateTo:'' });
  const q=(f.q||'').toLowerCase().trim();
  const issueTab=(f.issueTab==='production_requests'?'raw':(f.issueTab||'raw'));
  if(f.issueTab==='production_requests') f.issueTab='raw';
  const cfgs={raw:{label:'Kho nguyên liệu',type:'RAW_MATERIAL',icon:'fa-seedling'},semi:{label:'Kho bán thành phẩm',type:'SEMI_FINISHED',icon:'fa-cubes-stacked'},finished:{label:'Kho thành phẩm',type:'FINISHED_GOODS',icon:'fa-box'}};
  const cfg=cfgs[issueTab]||cfgs.raw;
  const whIds=new Set(DB.warehouses.filter(w=>w.type===cfg.type).map(w=>w.id));
  const ISSUE_TYPES={PRODUCTION_ISSUE:'Xuất sản xuất',SUBCONTRACT_ISSUE:'Xuất gia công',SALES_ISSUE:'Xuất bán hàng',ADJUSTMENT_OUT:'Xuất điều chỉnh',TRANSFER_OUT:'Xuất chuyển kho',DEFECTIVE_ISSUE:'Xuất hàng lỗi',RETURN_OUT:'Xuất trả NCC'};
  let entries=(DB.goodsIssues||[]).filter(gi=>whIds.has(gi.warehouseId)).map(gi=>({kind:'issue',date:gi.date,id:gi.id,gi}));
  if(issueTab==='raw') {
    entries.push(...(DB.materialReturnRequests||[]).filter(r=>r.status==='PENDING_WAREHOUSE').map(r=>({kind:'return',date:r.requestedDate,id:r.id,r})));
    // Yêu cầu NVL sản xuất là một nguồn yêu cầu xuất của Kho nguyên liệu,
    // nên hiển thị ngay trong tab này thay vì tách thành một màn riêng.
    entries.push(...(DB.productionMaterialRequests||[]).map(r=>({kind:'production_request',date:r.date||String(r.createdAt||'').slice(0,10),id:r.id,r})));
    // Đơn gia công đã duyệt trở thành yêu cầu xuất NVL của Kho nguyên liệu.
    // Sau khi đã xuất nhưng chưa giao đối tác, dòng vẫn ở đây để Kho xác nhận giao.
    if(typeof subcontractV3Orders==='function') {
      entries.push(...subcontractV3Orders()
        .filter(o=>['APPROVED','MATERIAL_ISSUED'].includes(o.status))
        .map(o=>({kind:'subcontract_request',date:o.issueDate||String(o.approvedAt||'').slice(0,10)||DB.today,id:o.id,o})));
    }
  }
  entries=entries.filter(x=>{
    if(!inventoryInDateRange(x.date, f.dateFrom, f.dateTo)) return false;
    if(f.kind && x.kind !== f.kind) return false;
    if(f.type && x.kind==='issue' && x.gi.type!==f.type) return false;
    if(f.type && x.kind==='return' && f.type!=='RETURN_OUT') return false;
    if(f.type && x.kind==='production_request' && f.type!=='PRODUCTION_ISSUE') return false;
    if(f.type && x.kind==='subcontract_request' && f.type!=='SUBCONTRACT_ISSUE') return false;
    const text=x.kind==='issue'
      ? [x.gi.id,x.gi.refDoc,x.gi.note,ISSUE_TYPES[x.gi.type]].join(' ')
      : x.kind==='production_request'
        ? [x.r.id,x.r.planId,x.r.productionOrderId,x.r.note,'Yêu cầu NVL sản xuất',...(x.r.items||[]).map(i=>`${i.materialId} ${Q.material(i.materialId)?.name||''}`)].join(' ')
        : x.kind==='subcontract_request'
          ? [x.o.id,x.o.partner,Q.product(x.o.productId)?.name,'Yêu cầu xuất NVL gia công'].join(' ')
          : [x.r.id,x.r.poId,Q.supplierName(x.r.supplierId),x.r.reason].join(' ');
    return !q||text.toLowerCase().includes(q);
  }).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const pg=paged(entries,'inv-issues');
  const rows=pg.items.map(x=>{
    if(x.kind==='subcontract_request'){
      const o=x.o;
      const lines=typeof subcontractBomLines==='function' ? subcontractBomLines(o) : [];
      const acts=[{act:'subcontracting-open',data:`data-id="${esc(o.id)}"`,icon:'fa-eye',title:'Xem chi tiết đơn gia công'}];
      if(o.status==='APPROVED') acts.push({act:'subcontracting-issue',data:`data-id="${esc(o.id)}"`,icon:'fa-arrow-up-from-bracket',title:'Xuất NVL gia công'});
      if(o.status==='MATERIAL_ISSUED') acts.push({act:'subcontracting-handover',data:`data-id="${esc(o.id)}"`,icon:'fa-handshake',title:'Xác nhận giao đối tác'});
      const materials=lines.map(i=>`${i.materialId} (${fmtDec(i.qty,3)} ${Q.material(i.materialId)?.unit||''})`).join(', ');
      return `<tr><td><span class="code">${esc(o.id)}</span><div class="cell-sub">Yêu cầu NVL gia công</div></td><td><span class="badge indigo">Xuất gia công</span></td><td>${fmtDate(x.date)}</td><td>Kho nguyên liệu</td><td>${esc(o.partner||'—')}</td><td>${esc(materials||'Theo BOM')}</td><td class="right num">—</td><td>${o.status==='APPROVED'?'<span class="badge orange">Chờ xuất NVL</span>':'<span class="badge blue">Đã xuất · chờ giao đối tác</span>'}</td><td class="right">${rowActions(acts)}</td></tr>`;
    }
    if(x.kind==='production_request'){
      const r=x.r;
      const total=(r.items||[]).reduce((n,i)=>n+Number(i.qty||0),0);
      const source=r.productionOrderId ? `LSX ${r.productionOrderId}` : `Kế hoạch ${r.planId||'—'}`;
      const acts=[{act:'pf-mr-view',data:`data-id="${esc(r.id)}"`,icon:'fa-eye',title:'Xem chi tiết yêu cầu NVL'}];
      if(r.status==='WAITING_WAREHOUSE_APPROVAL') acts.push({act:'pf-mr-approve',data:`data-id="${esc(r.id)}"`,icon:'fa-check',title:'Duyệt yêu cầu NVL'});
      if(r.status==='APPROVED') acts.push({act:'pf-mr-issue',data:`data-id="${esc(r.id)}"`,icon:'fa-arrow-up-from-bracket',title:'Xuất NVL cho sản xuất'});
      return `<tr><td><span class="code">${esc(r.id)}</span><div class="cell-sub">Yêu cầu NVL sản xuất</div></td><td><span class="badge blue">Xuất sản xuất</span></td><td>${fmtDate(r.date)}</td><td>Kho nguyên liệu</td><td><span class="code">${esc(source)}</span></td><td>${esc((r.items||[]).map(i=>`${i.materialId} (${fmtDec(i.qty,3)})`).join(', '))}</td><td class="right num">${fmtDec(total,3)}</td><td>${pfRequestStatus(r.status)}</td><td class="right">${rowActions(acts)}</td></tr>`;
    }
    if(x.kind==='return'){
      const r=x.r;const lot=Q.lot(r.lotId);
      return `<tr><td><span class="code">${esc(r.id)}</span><div class="cell-sub">Yêu cầu trả</div></td><td><span class="badge red">Chờ xuất trả NCC</span></td><td>${fmtDate(r.requestedDate)}</td><td>${esc(Q.warehouseName(r.warehouseId))}</td><td><span class="code">${esc(r.poId)}</span></td><td>${cell2(esc(Q.material(r.materialId)?.name||r.materialId),`Lô HT: ${esc(lot?.lotNumber||'—')} · Lô NCC: ${esc(r.supplierLot||'—')}`)}</td><td class="right strong num">${fmtN(r.qty)} ${esc(r.unit||'')}</td><td><span class="badge orange">Chờ kho xác nhận</span></td><td class="right">${rowActions([{act:'open-po',data:`data-id="${r.poId}"`,icon:'fa-eye',title:'Xem chi tiết đơn hàng'},{act:'inv-return-confirm-issue',data:`data-id="${r.id}"`,icon:'fa-arrow-right-from-bracket',title:'Xác nhận xuất trả'}])}</td></tr>`;
    }
    const gi=x.gi;const total=(gi.items||[]).reduce((n,i)=>n+Number(i.qty||0),0);
    const pendingSales = gi.type==='SALES_ISSUE' && gi.status==='PENDING_CONFIRMATION';
    const statusHtml = pendingSales ? '<span class="badge orange">Chờ xác nhận xuất</span>' : badge(gi.status);
    const acts=[{act:'inv-issue-view',data:`data-id="${gi.id}"`,icon:'fa-eye',title:'Xem chi tiết'}];
    if(pendingSales) acts.push({act:'inv-sales-issue-confirm',data:`data-id="${gi.id}"`,icon:'fa-circle-check',title:'Xác nhận xuất kho'});
    return `<tr><td><span class="code">${esc(gi.id)}</span>${pendingSales?'<div class="cell-sub">Yêu cầu từ đơn bán</div>':''}</td><td><span class="badge blue">${esc(ISSUE_TYPES[gi.type]||gi.type)}</span></td><td>${fmtDate(gi.date)}</td><td>${esc(Q.warehouseName(gi.warehouseId))}</td><td><span class="code">${esc(gi.refDoc||'—')}</span></td><td>${esc((gi.items||[]).map(i=>`${i.productId} (${fmtDec(i.qty,3)})`).join(', '))}</td><td class="right num">${fmtDec(total,3)}</td><td>${statusHtml}</td><td class="right">${rowActions(acts)}</td></tr>`;
  });
  return `${pageHead('Xuất kho','Danh sách phiếu và yêu cầu xuất được quản lý chung theo từng loại kho',`
    <button class="btn" data-act="inv-export-issues"><i class="fa-solid fa-file-export"></i>Xuất Excel</button>
    <button class="btn btn-primary" data-act="inv-new-issue" data-tab="${issueTab}"><i class="fa-solid fa-plus"></i>Lập phiếu xuất ${cfg.label.toLowerCase()}</button>`)}
    <div class="tabs" style="margin-bottom:14px">
      <button class="tab ${issueTab==='raw'?'active':''}" data-act="inventory-issue-tab" data-tab="raw"><i class="fa-solid fa-seedling"></i>Kho nguyên liệu</button>
      <button class="tab ${issueTab==='semi'?'active':''}" data-act="inventory-issue-tab" data-tab="semi"><i class="fa-solid fa-cubes-stacked"></i>Kho bán thành phẩm</button>
      <button class="tab ${issueTab==='finished'?'active':''}" data-act="inventory-issue-tab" data-tab="finished"><i class="fa-solid fa-box"></i>Kho thành phẩm</button>
    </div>
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Tổng chứng từ', entries.length, 'fa-file-arrow-up', 'blue', 'inventory-issues-all')}
      ${issueTab==='finished' ? mkpi('Chờ xác nhận xuất', entries.filter(x=>x.kind==='issue' && x.gi.type==='SALES_ISSUE' && x.gi.status==='PENDING_CONFIRMATION').length, 'fa-hourglass-half', 'orange') : mkpi('Chờ trả NCC', entries.filter(x=>x.kind==='return').length, 'fa-rotate-left', 'orange', 'inventory-issues-return')}
      ${mkpi('Đã hoàn tất xuất', entries.filter(x=>x.kind==='issue' && x.gi.status==='COMPLETED').length, 'fa-circle-check', 'green', 'inventory-issues-posted')}
      ${mkpi('Tổng SL xuất', fmtDec(entries.reduce((sum,x)=>{ if(x.kind==='return') return sum+Number(x.r?.qty||0); if(x.kind==='production_request') return sum+(x.r?.items||[]).reduce((n,i)=>n+Number(i.qty||0),0); if(x.kind==='subcontract_request') return sum; return sum+(x.gi?.items||[]).reduce((n,i)=>n+Number(i.qty||0),0); },0),3), 'fa-boxes-stacked', 'teal')}
    </div>
    <div class="card"><div class="toolbar">${searchBox('inv-issues','Tìm phiếu, PO, chứng từ tham chiếu…')}${selectFilter('inv-issues','kind',[['production_request','Yêu cầu NVL sản xuất'],['subcontract_request','Yêu cầu NVL gia công'],['issue','Đã lập phiếu xuất'],['return','Chờ xuất trả NCC']],'Tất cả chứng từ')}${selectFilter('inv-issues','type',Object.entries(ISSUE_TYPES).map(([k,v])=>[k,v]),'Tất cả loại xuất')}${inventoryDateRangeInputs('inv-issues', f)}${(f.q||f.kind||f.type||f.dateFrom||f.dateTo)?'<button class="btn btn-sm" data-act="clear-filter" data-key="inv-issues"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>':''}<span class="spacer"></span><span class="chip">${fmtN(entries.length)} dòng</span></div>
    ${tableShell([{t:'Phiếu / Yêu cầu'},{t:'Loại'},{t:'Ngày'},{t:'Khu xuất'},{t:'Tham chiếu'},{t:'Hàng hóa / Lô'},{t:'Số lượng',cls:'right'},{t:'Trạng thái'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:`Chưa có dữ liệu xuất tại ${cfg.label.toLowerCase()}`})}
    ${pagiHTML('inv-issues',pg,'dòng')}</div>`;
};

/* ------------- Màn 4: CHUYỂN KHO ----------------------------------------- */
Views['inv-transfers'] = function () {
  const TYPE_META = {
    RAW_MATERIAL: { label: 'Chuyển kho nguyên liệu', short: 'Nguyên liệu', icon: 'fa-seedling' },
    SEMI_FINISHED: { label: 'Chuyển kho bán thành phẩm', short: 'Bán thành phẩm', icon: 'fa-layer-group' },
    FINISHED_GOODS: { label: 'Chuyển kho thành phẩm', short: 'Thành phẩm', icon: 'fa-box' },
  };
  State.invTransferType = State.invTransferType || 'RAW_MATERIAL';
  const activeType = State.invTransferType;
  const meta = TYPE_META[activeType];
  const f = F('inv-transfers', { q: '', status: '', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const inferType = (t) => t.transferType || (Q.warehouse(t.fromWarehouseId)?.type || 'RAW_MATERIAL');
  const typedTransfers = DB.stockTransfers.filter((t) => inferType(t) === activeType);
  const list = [...typedTransfers].filter((t) => {
    if (f.status && t.status !== f.status) return false;
    if (!inventoryInDateRange(t.date, f.dateFrom, f.dateTo)) return false;
    const fromWh = Q.warehouse(t.fromWarehouseId);
    const toWh = Q.warehouse(t.toWarehouseId);
    if (q && ![t.id, t.note, fromWh?.name, toWh?.name].some((v) => String(v || '').toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const pg = paged(list, 'inv-transfers');

  const rows = pg.items.map((t) => {
    const fromWh = Q.warehouse(t.fromWarehouseId);
    const toWh = Q.warehouse(t.toWarehouseId);
    const totalQty = (t.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
    return `<tr>
      <td><span class="code">${esc(t.id)}</span></td>
      <td class="num">${fmtDate(t.date)}</td>
      <td>${cell2(esc(fromWh?.name || t.fromWarehouseId), esc(fromWh?.address || ''))}</td>
      <td>${cell2(esc(toWh?.name || t.toWarehouseId), esc(toWh?.address || ''))}</td>
      <td class="center num strong">${fmtN((t.items || []).length)}</td>
      <td class="right num strong">${fmtN(totalQty)}</td>
      <td>${badge(t.status)}</td>
      <td class="muted">${esc(t.note || '')}</td>
      <td>${rowActions([{ act: 'inv-transfer-view', data: `data-id="${t.id}"`, icon: 'fa-eye', title: 'Xem phiếu chuyển kho' }])}</td>
    </tr>`;
  });

  const tabs = Object.entries(TYPE_META).map(([type, m]) => `
    <button class="tab ${activeType === type ? 'active' : ''}" data-act="inv-transfer-tab" data-type="${type}">
      <i class="fa-solid ${m.icon}"></i>${m.label}
    </button>`).join('');

  return `
  ${pageHead('Chuyển kho nội bộ', 'Điều phối hàng giữa các kho vật lý cùng loại tại các địa điểm khác nhau', '')}
  <div class="tabs" style="margin-bottom:14px">${tabs}</div>
  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi('Tổng phiếu', list.length, 'fa-right-left', 'blue', 'inventory-transfers-all')}
    ${mkpi('Nháp', list.filter(t=>t.status==='DRAFT').length, 'fa-file', 'slate', 'inventory-transfers-draft')}
    ${mkpi('Đang vận chuyển', list.filter(t=>t.status==='IN_TRANSIT').length, 'fa-truck', 'orange', 'inventory-transfers-transit')}
    ${mkpi('Đã nhận', list.filter(t=>t.status==='RECEIVED').length, 'fa-circle-check', 'green', 'inventory-transfers-received')}
  </div>

  <div class="card">
    <div class="toolbar">
      ${searchBox('inv-transfers', 'Tìm số phiếu, kho nguồn, kho đích…')}
      ${selectFilter('inv-transfers', 'status', [['DRAFT', 'Nháp'], ['IN_TRANSIT', 'Đang đi đường'], ['RECEIVED', 'Đã nhận']], 'Tất cả trạng thái')}
      ${inventoryDateRangeInputs('inv-transfers', f)}
      ${(f.q || f.status || f.dateFrom || f.dateTo) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="inv-transfers"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}
      <span class="spacer"></span>
      <button class="btn btn-primary" data-act="inv-new-transfer" data-type="${activeType}"><i class="fa-solid fa-plus"></i>Lập phiếu ${meta.short.toLowerCase()}</button>
    </div>
    ${tableShell(
      [{ t: 'Số phiếu', w: '125px' }, { t: 'Ngày' }, { t: 'Kho nguồn' }, { t: 'Kho đích' }, { t: 'Số dòng', cls: 'center' },
       { t: 'Tổng SL', cls: 'right' }, { t: 'Trạng thái', w: '125px' }, { t: 'Ghi chú' }, { t: '', cls: 'right', w: '70px' }],
      rows, { emptyTitle: `Chưa có phiếu ${meta.label.toLowerCase()}` })}
    ${pagiHTML('inv-transfers', pg, 'phiếu')}
  </div>`;
};

/* ------------- Màn 5: KIỂM KÊ -------------------------------------------- */
Views['inv-counts'] = function () {
  const f = F('inv-counts', { q: '', warehouseId: '', status: '', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const list = [...DB.inventoryCounts].filter((c) => {
    if (f.warehouseId && c.warehouseId !== f.warehouseId) return false;
    if (f.status && c.status !== f.status) return false;
    if (!inventoryInDateRange(c.date, f.dateFrom, f.dateTo)) return false;
    if (q && ![c.id, c.note].some((v) => String(v).toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));
  const pg = paged(list, 'inv-counts');
  const warehouses = DB.warehouses.map((w) => [w.id, w.name]);

  const rows = pg.items.map((c) => {
    const wh = DB.warehouses.find((w) => w.id === c.warehouseId);
    const totalDiff = c.items.reduce((s, i) => s + i.difference, 0);
    return `<tr>
      <td><span class="code">${c.id}</span></td>
      <td class="num">${fmtDate(c.date)}</td>
      <td><span class="chip">${esc(wh ? wh.name : c.warehouseId)}</span></td>
      <td class="center num">${c.items.length}</td>
      <td class="right strong num" style="color:${totalDiff < 0 ? 'var(--red)' : totalDiff > 0 ? 'var(--green)' : 'var(--text-3)'}">
        ${totalDiff > 0 ? '+' : ''}${fmtN(totalDiff)}
      </td>
      <td>${badge(c.status)}</td>
      <td class="muted">${esc(c.note || '')}</td>
      <td>${rowActions([
        { act: 'inv-count-view', data: `data-id="${c.id}"`, icon: 'fa-eye', title: 'Xem chi tiết kiểm kê' },
        ...(c.status !== 'COMPLETED' ? [{ act: 'inv-count-complete', data: `data-id="${c.id}"`, icon: 'fa-check-double', title: 'Xác nhận & điều chỉnh tồn' }] : []),
      ])}</td>
    </tr>`;
  });

  return `
  ${pageHead('Kiểm kê kho', 'Tạo phiếu kiểm kê, đối chiếu và điều chỉnh tồn kho thực tế', `
    <button class="btn btn-primary" data-act="inv-new-count"><i class="fa-solid fa-plus"></i>Tạo phiếu kiểm kê</button>
  `)}

  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi('Tổng phiếu kiểm kê', list.length, 'fa-clipboard-list', 'blue', 'inventory-counts-all')}
    ${mkpi('Đã hoàn tất', list.filter((c) => c.status === 'COMPLETED').length, 'fa-circle-check', 'green', 'inventory-counts-completed')}
    ${mkpi('Đang kiểm kê', list.filter((c) => c.status !== 'COMPLETED').length, 'fa-spinner', 'orange', 'inventory-counts-open')}
  </div>

  <div class="card">
    <div class="toolbar">
      ${searchBox('inv-counts', 'Tìm số phiếu, kho kiểm kê…')}
      ${selectFilter('inv-counts', 'warehouseId', warehouses, 'Tất cả kho')}
      ${selectFilter('inv-counts', 'status', [['DRAFT','Đang kiểm kê'],['COMPLETED','Đã hoàn tất']], 'Tất cả trạng thái')}
      ${inventoryDateRangeInputs('inv-counts', f)}
      ${(f.q || f.warehouseId || f.status || f.dateFrom || f.dateTo) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="inv-counts"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}
      <span class="spacer"></span>
      <span class="chip"><i class="fa-solid fa-list"></i> ${fmtN(list.length)} phiếu</span>
    </div>
    ${tableShell(
      [{ t: 'Số phiếu KK', w: '120px' }, { t: 'Ngày KK' }, { t: 'Kho' }, { t: 'Số dòng', cls: 'center' },
       { t: 'Chênh lệch', cls: 'right' }, { t: 'Trạng thái', w: '120px' }, { t: 'Ghi chú' }, { t: '', cls: 'right', w: '90px' }],
      rows, { emptyTitle: 'Chưa có phiếu kiểm kê nào' })}
    ${pagiHTML('inv-counts', pg, 'phiếu')}
  </div>`;
};

/* ------------- Màn 6: LÔ & HẠN SỬ DỤNG ---------------------------------- */
Views['inv-lots'] = function () {
  const f = F('inv-lots', { q: '', qcStatus: '', expStatus: '', dateFrom: '', dateTo: '' });
  const q = (f.q || '').toLowerCase().trim();
  const today = new Date(DB.today + 'T00:00:00');
  const nearDays = DB.inventoryAlertConfig.nearExpiryDays;

  const list = DB.inventoryLots.filter((lot) => {
    if (f.qcStatus && lot.qcStatus !== f.qcStatus) return false;
    if (!inventoryInDateRange(lot.mfgDate, f.dateFrom, f.dateTo)) return false;
    const exp = new Date(lot.expiryDate + 'T00:00:00');
    const daysLeft = Math.round((exp - today) / 86400000);
    if (f.expStatus === 'expired' && daysLeft >= 0) return false;
    if (f.expStatus === 'near_expiry' && (daysLeft < 0 || daysLeft > nearDays)) return false;
    if (f.expStatus === 'normal' && daysLeft <= nearDays) return false;
    if (q && ![lot.lotNumber, lot.productId, lot.supplierId].some((v) => String(v).toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
  const pg = paged(list, 'inv-lots');

  const expiredLots = Q.expiredLots();
  const nearExpiryLots = Q.nearExpiryLots();

  const rows = pg.items.map((lot) => {
    const mat = DB.materials.find((m) => m.id === lot.productId) || DB.products.find((p) => p.id === lot.productId);
    const exp = new Date(lot.expiryDate + 'T00:00:00');
    const daysLeft = Math.round((exp - today) / 86400000);
    const inv = DB.inventory.find((i) => i.lotId === lot.id);
    let expBadge = '';
    if (daysLeft < 0) expBadge = `<span class="badge red">HẾT HẠN ${Math.abs(daysLeft)} ngày</span>`;
    else if (daysLeft <= nearDays) expBadge = `<span class="badge orange">Cận hạn: còn ${daysLeft} ngày</span>`;
    else expBadge = `<span class="badge green">Còn ${daysLeft} ngày</span>`;
    return `<tr>
      <td><span class="code" style="font-size:11px">${lot.lotNumber}</span></td>
      <td>${cell2(esc(mat ? mat.name : lot.productId), esc(lot.productId))}</td>
      <td class="num">${fmtDate(lot.mfgDate)}</td>
      <td>${expBadge}</td>
      <td class="right strong num">${inv ? fmtDec(inv.qtyOnHand, 2) + ' ' + esc(inv.unit) : '<span class="muted">—</span>'}</td>
      <td class="right num muted">${inv ? fmtDec(inv.qtyAvailable, 2) : '—'}</td>
      <td>${badge(lot.qcStatus)}</td>
      <td>${esc(Q.supplierName(lot.supplierId) || '—')}</td>
      <td>${rowActions([
        { act: 'inv-lot-detail', data: `data-lotid="${lot.id}"`, icon: 'fa-eye', title: 'Xem chi tiết lô' },
        ...(daysLeft < 0 || lot.qcStatus === 'FAILED' ? [{ act: 'inv-lot-quarantine', data: `data-lotid="${lot.id}"`, icon: 'fa-ban', title: 'Chuyển sang kho hàng lỗi' }] : []),
      ])}</td>
    </tr>`;
  });

  return `
  ${pageHead('Quản lý Lô & Hạn sử dụng', `Theo dõi lô hàng, HSD và trạng thái QC cho từng lô đậu hủ`, `
    <button class="btn" data-act="inv-lot-config"><i class="fa-solid fa-sliders"></i>Cấu hình cảnh báo</button>
  `)}

  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi('Tổng số lô', list.length, 'fa-barcode', 'blue', 'inventory-lots-all')}
    ${mkpi(`Cận hạn ≤${nearDays} ngày`, list.filter(l => { const d=Math.round((new Date(l.expiryDate+'T00:00:00')-today)/86400000); return d>=0 && d<=nearDays; }).length, 'fa-calendar-minus', 'orange', 'inventory-lots-near')}
    ${mkpi('Đã hết hạn', list.filter(l => new Date(l.expiryDate+'T00:00:00') < today).length, 'fa-circle-xmark', 'red', 'inventory-lots-expired')}
    ${mkpi('Đạt QC', list.filter((l) => l.qcStatus === 'PASSED').length, 'fa-circle-check', 'green', 'inventory-lots-passed')}
    ${mkpi('Cách ly / Lỗi', list.filter((l) => ['FAILED', 'QUARANTINE'].includes(l.qcStatus)).length, 'fa-triangle-exclamation', 'red', 'inventory-lots-failed')}
  </div>

  ${expiredLots.length > 0 ? `
  <div class="card" style="margin-bottom:14px;border-left:3px solid var(--red)">
    <div class="card-head"><span class="mkpi-ico t-red"><i class="fa-solid fa-circle-xmark"></i></span>
      <div><h3>Lô đã hết hạn sử dụng — cần xử lý ngay</h3><p>Các lô bên dưới đã hết HSD, không được xuất bán. Cần chuyển sang kho hàng lỗi hoặc tiêu hủy.</p></div></div>
    <div class="card-body" style="display:flex;flex-wrap:wrap;gap:8px">
      ${expiredLots.map((lot) => {
        const mat = DB.materials.find((m) => m.id === lot.productId) || {};
        const daysExpired = Math.abs(Math.round((new Date(lot.expiryDate) - today) / 86400000));
        return `<div class="alert-item" style="flex:1 1 240px;border-color:var(--red)">
          <span class="alert-ico t-red"><i class="fa-solid fa-calendar-xmark"></i></span>
          <span><span class="alert-title" style="color:var(--red)">${lot.lotNumber}</span>
          <div class="alert-sub">${esc(mat.name || lot.productId)} · Hết hạn ${fmtDate(lot.expiryDate)} (${daysExpired} ngày trước)</div></span>
          <button class="btn btn-sm" data-act="inv-lot-quarantine" data-lotid="${lot.id}" style="flex-shrink:0">Chuyển kho lỗi</button>
        </div>`;
      }).join('')}
    </div>
  </div>` : ''}

  <div class="card">
    <div class="toolbar">
      ${searchBox('inv-lots', 'Tìm số lô, mã hàng, nhà cung cấp…')}
      ${selectFilter('inv-lots', 'qcStatus', [['PASSED', 'Đạt QC'], ['QC_PENDING', 'Chờ QC'], ['FAILED', 'Không đạt'], ['QUARANTINE', 'Cách ly']], 'Tất cả QC')}
      ${selectFilter('inv-lots', 'expStatus', [['near_expiry', '⚠ Cận hạn'], ['expired', '❌ Hết hạn'], ['normal', '✅ Còn xa']], 'Tất cả HSD')}
      ${inventoryDateRangeInputs('inv-lots', f)}
      ${(f.q || f.qcStatus || f.expStatus || f.dateFrom || f.dateTo) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="inv-lots"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}
      <span class="spacer"></span>
      <span class="chip"><i class="fa-solid fa-list"></i> ${fmtN(list.length)} lô</span>
    </div>
    ${tableShell(
      [{ t: 'Số lô' }, { t: 'Tên hàng' }, { t: 'NSX' }, { t: 'HSD / Còn lại' },
       { t: 'On Hand', cls: 'right' }, { t: 'Available', cls: 'right' }, { t: 'QC', w: '100px' }, { t: 'Nhà cung cấp', cls: 'hide-sm' }, { t: '', cls: 'right', w: '80px' }],
      rows, { emptyTitle: 'Không tìm thấy lô hàng nào' })}
    ${pagiHTML('inv-lots', pg, 'lô')}
  </div>`;
};

/* ---- Modal cấu hình cảnh báo kho ---- */
function openInventoryAlertConfig() {
  Modal.open({
    title: 'Cấu hình cảnh báo tồn kho',
    sub: 'Điều chỉnh ngưỡng cảnh báo hạn sử dụng và hàng chậm luân chuyển',
    body: `<div class="form-grid">
      <div class="field"><label>Số ngày cảnh báo cận hạn <span class="req">*</span></label>
        <select class="inp" id="alertNearExpiry">
          ${[1, 3, 7, 15, 30].map((d) => `<option value="${d}" ${DB.inventoryAlertConfig.nearExpiryDays === d ? 'selected' : ''}>${d} ngày</option>`).join('')}
        </select></div>
      <div class="field"><label>Hàng chậm luân chuyển sau (ngày)</label>
        <select class="inp" id="alertSlowMoving">
          ${[30, 60, 90, 180].map((d) => `<option value="${d}" ${DB.inventoryAlertConfig.slowMovingDays === d ? 'selected' : ''}>${d} ngày</option>`).join('')}
        </select></div>
    </div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button>
           <button class="btn btn-primary" data-act="inv-save-alert-config"><i class="fa-solid fa-floppy-disk"></i>Lưu cấu hình</button>`,
  });
}

/* ---- Modal tạo phiếu nhập kho ---- */
function receiptLotCode(poId, materialId, date, roundNo) {
  const compactPo = String(poId || 'PO').replace(/-/g, '');
  const compactMat = String(materialId || 'SP').replace(/-/g, '');
  const ymd = String(date || DB.today).replace(/-/g, '').slice(2);
  return `${compactPo}-${compactMat}-${ymd}-${String(roundNo || 1).padStart(2, '0')}`;
}

function receiptRoundOfPo(poId) {
  return (DB.goodsReceipts || []).filter(r => r.poId === poId).length + 1;
}

function receiptPoDetailHtml(po, date) {
  if (!po) return '<div class="empty-mini">Chọn đơn hàng để hiển thị chi tiết.</div>';
  const roundNo = receiptRoundOfPo(po.id);
  return `
    <div class="card" style="margin-bottom:14px;background:var(--surface-2)">
      <div class="card-body">
        <div class="info-grid">
          ${infoItem('Mã đơn hàng', `<span class="code">${esc(po.id)}</span>`)}
          ${infoItem('Đề nghị mua', `<span class="code">${esc(po.prId || '—')}</span>`)}
          ${infoItem('Nhà cung cấp', esc(Q.supplierName(po.supplierId)))}
          ${infoItem('Ngày đặt', fmtDate(po.date))}
          ${infoItem('Giao dự kiến', fmtDate(po.expectedDate))}
          ${infoItem('Trạng thái', badge(po.status))}${po.qualityNote ? infoItem('Ghi chú chất lượng', `<span class="badge red">${esc(po.qualityNote)}</span>`) : ''}
        </div>
      </div>
    </div>
    <div class="form-sec-title"><i class="fa-solid fa-boxes-packing"></i>Nguyên liệu nhập kho</div>
    <div class="tbl-wrap" style="border:1px solid var(--border);border-radius:var(--r)">
      <table class="line-tbl">
        <thead><tr><th>Nguyên liệu</th><th class="right">SL đặt</th><th class="right">Đã nhập</th><th class="right">Nhập lần này</th><th>Lô hệ thống</th><th>Lô sản phẩm / NCC <span class="req">*</span></th><th>NSX</th><th>HSD</th></tr></thead>
        <tbody>
          ${(po.items || []).map((it) => {
            const remain = Math.max(0, Number(it.qty || 0) - Number(it.receivedQty || 0));
            const lotNo = receiptLotCode(po.id, it.materialId, date, roundNo);
            return `<tr>
              <td><div class="strong">${esc(it.name)}</div><div class="cell-sub">${esc(it.materialId)} · ${esc(it.unit)}</div></td>
              <td class="right num">${fmtN(it.qty)}</td>
              <td class="right num muted">${fmtN(it.receivedQty || 0)}</td>
              <td class="right"><input class="inp right num po-gr-qty" data-mid="${esc(it.materialId)}" type="number" min="0" max="${remain}" value="${remain}" style="width:100px" ${remain <= 0 ? 'disabled' : ''}></td>
              <td><input class="inp po-gr-lot" data-mid="${esc(it.materialId)}" value="${esc(lotNo)}" style="min-width:190px;background:var(--surface-2)" readonly title="Lô hệ thống tự sinh, không được chỉnh sửa"></td>
              <td><input class="inp po-gr-supplier-lot" data-mid="${esc(it.materialId)}" value="" placeholder="Bắt buộc · VD: NCC-LOT-0907" required style="min-width:165px" title="Nhập lô thực tế in trên bao bì/chứng từ NCC; có thể trùng giữa nhiều đợt nhập"></td>
              <td><input class="inp po-gr-mfg" data-mid="${esc(it.materialId)}" type="date" value="${date}" style="width:135px"></td>
              <td><input class="inp po-gr-exp" data-mid="${esc(it.materialId)}" type="date" value="${addDays(date, 365)}" style="width:135px"></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="muted" style="font-size:11.8px;margin-top:8px"><i class="fa-solid fa-circle-info"></i> <b>Lô hệ thống</b> tự sinh theo Mã PO - Mã SP - YYMMDD - Đợt và bị khóa. <b>Lô sản phẩm / NCC</b> bắt buộc nhập. Mã lô NCC có thể giống nhau giữa các sản phẩm khác nhau. Chỉ xem là trùng thật khi cùng tên sản phẩm, cùng danh mục, cùng NSX và HSD.</div>`;
}

function openNewReceiptModal(preselectedPoId = '') {
  const eligiblePos = DB.purchaseOrders.filter((po) => ['SHIPPING', 'PARTIAL_RECEIVED'].includes(po.status));
  const selectedId = preselectedPoId && eligiblePos.some(p => p.id === preselectedPoId) ? preselectedPoId : '';
  const po = Q.purchaseOrder(selectedId);
  const warehouse = DB.warehouses.find(w => w.type === 'RAW_MATERIAL') || DB.warehouses[0];
  const locations = warehouse ? Q.locationsOf(warehouse.id) : [];
  Modal.open({
    title: 'Lập phiếu nhập kho từ đơn đặt hàng',
    sub: 'Chỉ các PO đang giao hoặc đã nhận một phần mới được phép lập phiếu nhập',
    size: 'lg',
    body: `
      ${eligiblePos.length ? '' : '<div class="alert-item" style="margin-bottom:14px"><i class="fa-solid fa-circle-info"></i><div><b>Chưa có PO chờ nhập kho</b><div class="muted">Hãy xác nhận giao hàng ở Đơn đặt hàng trước.</div></div></div>'}
      <div class="form-grid">
        <div class="field"><label>Đơn đặt hàng <span class="req">*</span></label>
          <select class="inp" id="poGrPo">
            <option value="">-- Chọn đơn đặt hàng --</option>${eligiblePos.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.id} · ${esc(Q.supplierName(p.supplierId))} · ${statusLabel(p.status)}</option>`).join('')}
          </select></div>
        <div class="field"><label>Kho nhận hàng <span class="req">*</span></label>
          <select class="inp" id="poGrWarehouse">
            ${DB.warehouses.filter(w => w.type === 'RAW_MATERIAL').map(w => `<option value="${w.id}" ${warehouse && w.id === warehouse.id ? 'selected' : ''}>${esc(w.name)}</option>`).join('')}
          </select></div>
        <div class="field"><label>Kệ / vị trí lưu trữ <span class="req">*</span></label>
          <select class="inp" id="poGrLocation">
            ${locations.map(l => `<option value="${l.id}">${esc(l.name)} · ${esc(l.code)}</option>`).join('')}
          </select></div>
        <div class="field"><label>Người nhập kho</label>
          <input class="inp" value="${esc(DB.currentUser?.name || '—')}" readonly title="Người nhập kho được lấy từ tài khoản đang đăng nhập">
          <div class="cell-sub" style="margin-top:5px">Tự động lấy theo tài khoản đang đăng nhập, không được chọn người khác.</div>
        </div>
        <div class="field"><label>Ngày nhập</label><input class="inp" id="poGrDate" type="date" value="${currentDateYMD()}" min="${currentDateYMD()}"></div>
      </div>
      <div class="field"><label>Ghi chú</label><textarea class="inp" id="poGrNote" rows="2" placeholder="Ghi chú nhận hàng / tình trạng hàng…">${po ? `Nhập kho theo đơn ${po.id}` : ''}</textarea></div>
      <div id="poGrDetail">${receiptPoDetailHtml(po, DB.today)}</div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button>
           <button class="btn btn-success" id="poGrSaveBtn" data-act="po-goods-receipt-save" ${(eligiblePos.length && selectedId) ? '' : 'disabled'}><i class="fa-solid fa-warehouse"></i>Xác nhận nhập kho</button>`,
  });
}


function openWarehouseReceiptModal(receiptTab = 'semi') {
  const cfg = receiptTab === 'finished'
    ? { label: 'thành phẩm', type: 'FINISHED_GOODS', defaultRef: 'LSX-' }
    : { label: 'bán thành phẩm', type: 'SEMI_FINISHED', defaultRef: 'LSX-' };
  const warehouses = DB.warehouses.filter(w => w.type === cfg.type);
  const warehouse = warehouses[0];
  const locations = warehouse ? Q.locationsOf(warehouse.id) : [];
  const products = DB.products || [];
  Modal.open({
    title: `Lập phiếu nhập kho ${cfg.label}`,
    sub: `Phiếu nhập nội bộ vào ${cfg.label}; chỉ hiển thị kho đúng loại`,
    size: 'lg',
    body: `
      ${receiptTab === 'finished' ? `<div class="note-box" style="margin-bottom:12px"><b>Nguồn sản phẩm:</b> danh sách bên dưới lấy từ <b>Danh mục thành phẩm (DB.products)</b>, không phải từ số lượng tồn kho. Vì vậy thành phẩm chưa có tồn vẫn xuất hiện để bạn có thể nhập kho.</div>` : ''}
      <div class="form-grid">
        <div class="field"><label>Kho nhận <span class="req">*</span></label><select class="inp" id="whGrWarehouse">${warehouses.map(w=>`<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Kệ / vị trí <span class="req">*</span></label><select class="inp" id="whGrLocation">${locations.map(l=>`<option value="${l.id}">${esc(l.name)} · ${esc(l.code)}</option>`).join('')}</select></div>
        <div class="field"><label>Ngày nhập</label><input class="inp" id="whGrDate" type="date" value="${currentDateYMD()}" min="${currentDateYMD()}"></div>
        <div class="field"><label>Người nhập</label><select class="inp" id="whGrReceiver">${DB.employees.filter(e=>e.dept==='Kho vận').map(e=>`<option value="${e.id}" ${e.id===DB.currentUser.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Sản phẩm <span class="req">*</span></label><select class="inp" id="whGrProduct"><option value="">-- Chọn sản phẩm --</option>${products.map(p=>`<option value="${p.id}">${esc(p.id)} · ${esc(p.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Số lượng <span class="req">*</span></label><input class="inp right num" id="whGrQty" type="number" min="0" value="0"></div>
        <div class="field"><label>Lô hệ thống <span class="req">*</span></label><input class="inp" id="whGrSystemLot" placeholder="VD: LSX0048-SP001-260908-01"></div>
        <div class="field"><label>Ngày sản xuất</label><input class="inp" id="whGrMfg" type="date" value="${currentDateYMD()}" min="${currentDateYMD()}"></div>
        <div class="field"><label>Hạn sử dụng</label><input class="inp" id="whGrExp" type="date" value="${addDays(currentDateYMD(), 7)}" min="${currentDateYMD()}"></div>
        <div class="field"><label>Chứng từ tham chiếu</label><input class="inp" id="whGrRef" placeholder="${cfg.defaultRef}..."></div>
      </div>
      <div class="field"><label>Ghi chú</label><textarea class="inp" id="whGrNote" rows="2" placeholder="Ghi chú nhập ${cfg.label}…"></textarea></div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-success" data-act="warehouse-receipt-save" data-tab="${receiptTab}"><i class="fa-solid fa-warehouse"></i>Xác nhận nhập kho</button>`
  });
}

function openPoReceiptHistory(poId) {
  const po = Q.purchaseOrder(poId);
  if (!po) return;
  const receipts = Q.receiptsOfPo(poId).sort((a,b) => String(b.date).localeCompare(String(a.date)));
  const returns = (DB.goodsIssues || []).filter(x => x.type === 'RETURN_OUT' && (x.refDoc === poId || x.poId === poId));
  Modal.open({
    title: `Nhập kho theo ${po.id}`,
    sub: `${esc(Q.supplierName(po.supplierId))} · ${statusLabel(po.status)}`,
    size: 'lg',
    body: `
      <div class="form-sec-title"><i class="fa-solid fa-box"></i>Chi tiết nguyên liệu</div>
      ${tableShell([{t:'Nguyên liệu'},{t:'SL đặt',cls:'right'},{t:'Đã nhập',cls:'right'}], (po.items||[]).map(i => `<tr><td>${cell2(esc(i.name), esc(i.materialId))}</td><td class="right num">${fmtN(i.qty)} ${esc(i.unit)}</td><td class="right num strong">${fmtN(i.receivedQty||0)} ${esc(i.unit)}</td></tr>`))}
      <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-clock-rotate-left"></i>Lịch sử nhập kho</div>
      ${tableShell([{t:'Phiếu nhập'},{t:'Ngày'},{t:'Người nhập'},{t:'Nguyên liệu'},{t:'Số lượng nhập',cls:'right'},{t:'Lô hệ thống'},{t:'Lô SP/NCC'},{t:'QC'}], receipts.flatMap(r => (r.items||[]).map(i => `<tr><td><span class="code">${r.id}</span></td><td class="num">${fmtDate(r.date)}</td><td>${esc(Q.employeeName(r.receivedBy))}</td><td>${esc(i.name)}</td><td class="right num strong">${fmtN(i.qty)} ${esc(i.unit)}</td><td><span class="code">${esc(i.lotNumber||'—')}</span></td><td>${esc(i.supplierLot||'—')}</td><td>${r.inspectionStatus === 'PASSED' ? '<span class="badge green">Đạt</span>' : r.inspectionStatus === 'FAILED' || r.inspectionStatus === 'PARTIAL_FAILED' ? '<span class="badge red">Có lỗi</span>' : '<span class="badge orange">Chờ kiểm</span>'}</td></tr>`)), {emptyTitle:'Chưa có lịch sử nhập kho'})}
      <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-rotate-left"></i>Lịch sử đổi trả</div>
      ${tableShell([{t:'Phiếu xuất trả'},{t:'Ngày'},{t:'Nguyên liệu'},{t:'Số lượng trả',cls:'right'},{t:'Lô hệ thống'},{t:'Lý do'}], returns.flatMap(r => (r.items||[]).map(i => `<tr><td><span class="code">${r.id}</span></td><td>${fmtDate(r.date)}</td><td>${esc(Q.material(i.productId)?.name || i.productId)}</td><td class="right num">${fmtN(i.qty)} ${esc(i.unit||'')}</td><td><span class="code">${esc(Q.lot(i.lotId)?.lotNumber || i.lotId || '—')}</span></td><td class="muted">${esc(r.note||'')}</td></tr>`)), {emptyTitle:'Chưa phát sinh đổi trả'})}`,
    foot: `<button class="btn" data-act="modal-close">Đóng</button>${po.status === 'PARTIAL_RECEIVED' ? `<button class="btn btn-primary" data-act="inv-new-receipt" data-poid="${po.id}"><i class="fa-solid fa-plus"></i>Nhập tiếp</button>` : ''}`,
  });
}

/* ---- Modal tạo phiếu xuất kho với FEFO ----- */
function openNewIssueModal(issueTab = 'raw') {
  const tabType = { raw:'RAW_MATERIAL', semi:'SEMI_FINISHED', finished:'FINISHED_GOODS' }[issueTab] || 'RAW_MATERIAL';
  const warehouses = DB.warehouses.filter(w => w.type === tabType);
  const allowedIds = new Set(warehouses.map(w=>w.id));
  const stockProducts = [...new Set(DB.inventory.filter(i=>allowedIds.has(i.warehouseId) && Number(i.qtyAvailable ?? i.qtyOnHand ?? 0) > 0).map(i=>i.productId))]
    .map(id=>Q.material(id)||Q.product(id)).filter(Boolean)
    .sort((a,b)=>String(a.name||a.id).localeCompare(String(b.name||b.id),'vi',{sensitivity:'base'}));
  const productOptions = `<option value="">-- Chọn hàng xuất kho --</option>${stockProducts.map(m=>`<option value="${m.id}">${esc(m.name)} (${m.id})</option>`).join('')}`;
  const itemLabel = issueTab === 'raw' ? 'Nguyên liệu' : issueTab === 'semi' ? 'Bán thành phẩm' : 'Thành phẩm';
  Modal.open({
    title: `Lập phiếu xuất ${itemLabel.toLowerCase()}`,
    sub: 'Có thể chọn nhiều mặt hàng trong cùng một phiếu; hệ thống lấy lô phù hợp theo FEFO trong khu đã chọn',
    size: 'lg',
    body: `
      <div class="form-sec-title"><i class="fa-solid fa-file-lines"></i>Thông tin chung</div>
      <div class="form-grid">
        <div class="field"><label>Người lập phiếu</label><input class="inp" value="${esc(Q.employeeName(DB.currentUser.id))}" disabled></div>
        <div class="field"><label>Ngày xuất</label><input class="inp" type="date" id="giNewDate" value="${currentDateYMD()}" min="${currentDateYMD()}" /></div>
        <div class="field"><label>Loại hàng</label><input class="inp" id="giItemCategory" value="${itemLabel}" disabled></div>
        <div class="field"><label>Loại xuất <span class="req">*</span></label>
          <select class="inp" id="giNewType">
            ${issueTab !== 'finished' ? '<option value="PRODUCTION_ISSUE">Xuất sản xuất</option>' : ''}
            ${issueTab === 'finished' ? '<option value="SALES_ISSUE">Xuất bán hàng</option>' : ''}
            <option value="ADJUSTMENT_OUT">Xuất điều chỉnh</option>
            <option value="TRANSFER_OUT">Xuất chuyển kho</option>
          </select></div>
        <div class="field"><label>Khu xuất <span class="req">*</span></label>
          <select class="inp" id="giNewWarehouse">${warehouses.map(w=>`<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Chứng từ tham chiếu</label><input class="inp" id="giNewRef" placeholder="LSX-2026-xxxx / DH-2026-xxxx" /></div>
      </div>
      <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-box-open"></i>Hàng xuất kho</div>
      <div style="display:grid;grid-template-columns:minmax(280px,2fr) minmax(150px,1fr) 44px;gap:10px;padding:0 2px 6px;color:var(--text-muted);font-size:12px;font-weight:700">
        <div>${itemLabel}</div><div>Số lượng xuất</div><div></div>
      </div>
      <div id="giNewItems" data-options="${encodeURIComponent(productOptions)}">
        <div class="gi-issue-line" style="display:grid;grid-template-columns:minmax(280px,2fr) minmax(150px,1fr) 44px;gap:10px;align-items:center;margin-bottom:8px">
          <select class="inp" name="product">${productOptions}</select>
          <input class="inp right num" name="qty" type="number" min="0.01" step="0.01" placeholder="Nhập số lượng" />
          <button type="button" class="btn btn-sm" data-act="inv-issue-remove-line" title="Xóa dòng" disabled><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      <button type="button" class="btn btn-sm" data-act="inv-issue-add-line" style="margin-bottom:14px"><i class="fa-solid fa-plus"></i>Thêm ${itemLabel.toLowerCase()}</button>
      <div class="field"><label>Ghi chú</label><textarea class="inp" id="giNewNote" rows="2" placeholder="Diễn giải lý do xuất kho…"></textarea></div>
      <div class="alert-item" style="border-color:var(--primary);background:var(--surface-2);margin-top:12px">
        <span class="alert-ico t-blue"><i class="fa-solid fa-circle-info"></i></span>
        <span><div class="alert-sub">Phiếu xuất mới không dùng cho trả NCC. Hàng trả NCC được xử lý riêng từ yêu cầu trả nguyên liệu ở tab Kho nguyên liệu.</div></span>
      </div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="inv-issue-save-new"><i class="fa-solid fa-floppy-disk"></i>Xác nhận xuất kho</button>`,
  });
}

function openIssueDetailModal(id) {
  const gi=(DB.goodsIssues||[]).find(x=>x.id===id); if(!gi) return;
  Modal.open({title:`Chi tiết phiếu xuất ${gi.id}`,sub:`${Q.warehouseName(gi.warehouseId)} · ${fmtDate(gi.date)}`,size:'lg',body:`
    <div class="info-grid">${infoItem('Loại xuất',esc(({PRODUCTION_ISSUE:'Xuất sản xuất',SUBCONTRACT_ISSUE:'Xuất gia công',SALES_ISSUE:'Xuất bán hàng',ADJUSTMENT_OUT:'Xuất điều chỉnh',TRANSFER_OUT:'Xuất chuyển kho',RETURN_OUT:'Xuất trả NCC'}[gi.type]||gi.type)))}${infoItem('Khu xuất',esc(Q.warehouseName(gi.warehouseId)))}${infoItem('Chứng từ tham chiếu',esc(gi.refDoc||'—'))}${infoItem('Người lập',esc(Q.employeeName(gi.createdBy)))}</div>
    <div class="form-sec-title" style="margin-top:16px"><i class="fa-solid fa-box-open"></i>Chi tiết hàng xuất</div>
    ${tableShell([{t:'Mã hàng'},{t:'Tên hàng'},{t:'Lô hệ thống'},{t:'Lô NCC'},{t:'Kệ'},{t:'Số lượng',cls:'right'}],(gi.items||[]).map(i=>{const lot=Q.lot(i.lotId);const item=Q.material(i.productId)||Q.product(i.productId);return `<tr><td><span class="code">${esc(i.productId)}</span></td><td>${esc(item?.name||i.productId)}</td><td><span class="code">${esc(lot?.lotNumber||'—')}</span></td><td>${esc(lot?.supplierLot||'—')}</td><td>${esc(Q.locationName(i.locationId)||'—')}</td><td class="right strong num">${fmtDec(i.qty,3)} ${esc(i.unit||'')}</td></tr>`; }))}
    <div class="field" style="margin-top:14px"><label>Ghi chú</label><div class="inp" style="height:auto;min-height:42px">${esc(gi.note||'—')}</div></div>`,foot:'<button class="btn" data-act="modal-close">Đóng</button>'});
}

/* ---- Modal tạo phiếu chuyển kho ----- */
function openNewTransferModal(transferType = 'RAW_MATERIAL') {
  const TYPE_META = {
    RAW_MATERIAL: { label: 'nguyên liệu', title: 'Phiếu chuyển kho nguyên liệu' },
    SEMI_FINISHED: { label: 'bán thành phẩm', title: 'Phiếu chuyển kho bán thành phẩm' },
    FINISHED_GOODS: { label: 'thành phẩm', title: 'Phiếu chuyển kho thành phẩm' },
  };
  const meta = TYPE_META[transferType] || TYPE_META.RAW_MATERIAL;
  const warehouses = DB.warehouses.filter((w) => w.type === transferType && w.status === 'active');
  Modal.open({
    title: meta.title,
    sub: `Chuyển ${meta.label} giữa các kho vật lý cùng loại`,
    size: 'lg',
    body: `
      <input type="hidden" id="ckTransferType" value="${transferType}" />
      <div class="form-sec-title"><i class="fa-solid fa-circle-info"></i>Thông tin chung</div>
      <div class="form-grid">
        <div class="field"><label>Kho nguồn <span class="req">*</span></label>
          <select class="inp" id="ckFromWh">
            <option value="">-- Chọn kho nguồn --</option>
            ${warehouses.map((w) => `<option value="${w.id}">${esc(w.name)} · ${esc(w.address)}</option>`).join('')}
          </select></div>
        <div class="field"><label>Kho đích <span class="req">*</span></label>
          <select class="inp" id="ckToWh"><option value="">-- Chọn kho đích --</option></select></div>
      </div>
      <div class="form-grid">
        <div class="field"><label>Ngày chuyển</label><input class="inp" type="date" id="ckDate" value="${currentDateYMD()}" min="${currentDateYMD()}" /></div>
        <div class="field"><label>Ghi chú</label><input class="inp" id="ckNote" placeholder="Lý do điều phối hàng giữa các kho…" /></div>
      </div>
      <div class="form-sec-title"><i class="fa-solid fa-boxes-stacked"></i>Hàng hóa chuyển kho</div>
      <div id="ckItemsArea">
        <div class="muted" style="padding:16px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">Chọn kho nguồn để thêm hàng hóa cần chuyển.</div>
      </div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button>
           <button class="btn btn-primary" data-act="inv-transfer-save-new"><i class="fa-solid fa-right-left"></i>Tạo phiếu chuyển kho</button>`,
  });

  let lineSeq = 0;
  const sourceRows = () => {
    const fromId = $('#ckFromWh')?.value || '';
    return DB.inventory
      .filter((inv) => inv.warehouseId === fromId && Number(inv.qtyAvailable ?? inv.qtyOnHand ?? 0) > 0)
      .sort((a,b) => {
        const ai = Q.material(a.productId) || Q.product(a.productId);
        const bi = Q.material(b.productId) || Q.product(b.productId);
        return String(ai?.name || a.productId).localeCompare(String(bi?.name || b.productId), 'vi', { numeric:true, sensitivity:'base' });
      });
  };
  const stockKey = (inv) => [inv.productId, inv.lotId, inv.locationId].join('|');
  const stockOptions = () => sourceRows().map((inv) => {
    const lot = Q.lot(inv.lotId);
    const item = Q.material(inv.productId) || Q.product(inv.productId);
    const available = Number(inv.qtyAvailable ?? inv.qtyOnHand ?? 0);
    return `<option value="${esc(stockKey(inv))}">${esc(item?.name || inv.productId)} · ${esc(lot?.lotNumber || '—')} · ${esc(Q.locationName(inv.locationId))} · Còn ${fmtDec(available,2)} ${esc(inv.unit||'')}</option>`;
  }).join('');

  const renderDestinationOptions = () => {
    const fromId = $('#ckFromWh')?.value || '';
    const to = $('#ckToWh');
    if (!to) return;
    const current = to.value;
    to.innerHTML = `<option value="">-- Chọn kho đích --</option>` + warehouses
      .filter(w => w.id !== fromId)
      .map(w => `<option value="${w.id}">${esc(w.name)} · ${esc(w.address)}</option>`).join('');
    if (current && current !== fromId && warehouses.some(w => w.id === current)) to.value = current;
  };

  const attachLineEvents = (row) => {
    row.querySelector('.ck-remove-line')?.addEventListener('click', () => {
      row.remove();
      const body = $('#ckTransferLines');
      if (body && !body.children.length) addLine();
    });
  };
  const addLine = () => {
    const body = $('#ckTransferLines');
    if (!body) return;
    const opts = stockOptions();
    if (!opts) return Toast.err('Không có tồn khả dụng', 'Kho nguồn hiện không có hàng để chuyển.');
    lineSeq += 1;
    const tr = document.createElement('tr');
    tr.className = 'ck-transfer-row';
    tr.innerHTML = `
      <td><select class="inp ck-stock-select"><option value="">-- Chọn ${meta.label} --</option>${opts}</select></td>
      <td class="right"><input class="inp right num ck-transfer-qty" type="number" min="0" step="0.01" value="0" style="width:130px" /></td>
      <td class="center"><button type="button" class="btn btn-sm ck-remove-line" title="Xóa dòng"><i class="fa-solid fa-trash"></i></button></td>`;
    body.appendChild(tr);
    attachLineEvents(tr);
  };
  const renderTransferItems = () => {
    const fromId = $('#ckFromWh')?.value || '';
    const area = $('#ckItemsArea');
    if (!area) return;
    if (!fromId) {
      area.innerHTML = '<div class="muted" style="padding:16px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">Chọn kho nguồn để thêm hàng hóa cần chuyển.</div>';
      return;
    }
    if (!sourceRows().length) {
      area.innerHTML = '<div class="muted" style="padding:16px;text-align:center;border:1px dashed var(--border);border-radius:var(--r)">Kho nguồn hiện không có tồn khả dụng để chuyển.</div>';
      return;
    }
    area.innerHTML = `
      <div class="tbl-wrap" style="border:1px solid var(--border);border-radius:var(--r)">
        <table class="line-tbl">
          <thead><tr><th>${meta.label.charAt(0).toUpperCase()+meta.label.slice(1)} / Lô / Vị trí nguồn</th><th class="right" style="width:150px">SL chuyển</th><th style="width:54px"></th></tr></thead>
          <tbody id="ckTransferLines"></tbody>
        </table>
      </div>
      <button type="button" class="btn btn-sm" id="ckAddLine" style="margin-top:10px"><i class="fa-solid fa-plus"></i>Thêm ${meta.label}</button>`;
    $('#ckAddLine')?.addEventListener('click', addLine);
    addLine();
  };

  $('#ckFromWh')?.addEventListener('change', () => {
    renderDestinationOptions();
    renderTransferItems();
  });
  renderDestinationOptions();
  renderTransferItems();
}
function openTransferDetailModal(id) {
  const t = DB.stockTransfers.find((x) => x.id === id);
  if (!t) return Toast.err('Không tìm thấy phiếu', id);
  const fromWh = Q.warehouse(t.fromWarehouseId);
  const toWh = Q.warehouse(t.toWarehouseId);
  Modal.open({
    title: `Phiếu chuyển kho ${t.id}`,
    sub: `${esc(fromWh?.name || t.fromWarehouseId)} → ${esc(toWh?.name || t.toWarehouseId)}`,
    size: 'lg',
    body: `
      <div class="form-grid">
        <div>${cell2('Ngày chuyển', fmtDate(t.date))}</div>
        <div>${cell2('Trạng thái', badge(t.status))}</div>
        <div>${cell2('Kho nguồn', esc(fromWh?.name || t.fromWarehouseId))}</div>
        <div>${cell2('Kho đích', esc(toWh?.name || t.toWarehouseId))}</div>
      </div>
      <div class="form-sec-title"><i class="fa-solid fa-boxes-stacked"></i>Chi tiết hàng chuyển</div>
      ${tableShell([{t:'Mã'},{t:'Hàng hóa'},{t:'Lô'},{t:'Vị trí nguồn'},{t:'Vị trí đích'},{t:'Số lượng',cls:'right'}],
        (t.items || []).map((i) => {
          const item = DB.materials.find((m) => m.id === i.productId) || DB.products.find((p) => p.id === i.productId);
          return `<tr><td><span class="code">${esc(i.productId)}</span></td><td>${esc(item?.name || i.productId)}</td><td>${esc(Q.lot(i.lotId)?.lotNumber || '—')}</td><td>${esc(Q.locationName(i.fromLocationId))}</td><td>${esc(Q.locationName(i.toLocationId))}</td><td class="right num strong">${fmtN(i.qty)} ${esc(i.unit || '')}</td></tr>`;
        }), {emptyTitle:'Không có dòng hàng'})}
      ${t.note ? `<div class="muted" style="margin-top:12px"><strong>Ghi chú:</strong> ${esc(t.note)}</div>` : ''}`,
    foot: `<button class="btn btn-primary" data-act="modal-close">Đóng</button>`,
  });
}

/* ---------------- SỔ GIAO DỊCH VÀ CẢNH BÁO THEO TÀI LIỆU ERP ---------------- */
const InventoryService = {
  apply({ productId, warehouseId = 'WH-001', locationId = '', lotId = '', quantity, type, refType = 'MANUAL', refId = '', note = '', userId = DB.currentUser.id, updateMaterial = true }) {
    const qty = Number(quantity);
    if (!productId || !Number.isFinite(qty) || qty <= 0) return { ok: false, message: 'Số lượng phải lớn hơn 0.' };
    const inbound = ['RECEIPT', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'RETURN_IN', 'PRODUCTION_RECEIPT'].includes(type);
    const delta = inbound ? qty : -qty;
    let row = DB.inventory.find((x) => x.productId === productId && x.warehouseId === warehouseId && x.locationId === locationId && x.lotId === lotId);
    if (!row) {
      if (!inbound) return { ok: false, message: 'Không tìm thấy tồn kho theo lô và vị trí đã chọn.' };
      const material = Q.material(productId); const product = Q.product(productId);
      row = { productId, warehouseId, locationId, lotId, qtyOnHand: 0, qtyReserved: 0, qtyAvailable: 0, unit: material?.unit || product?.unit || '', lastUpdated: DB.today };
      DB.inventory.push(row);
    }
    if (!inbound && qty > row.qtyAvailable) return { ok: false, message: `Không đủ tồn kho. Tồn khả dụng: ${fmtDec(row.qtyAvailable, 2)}, yêu cầu xuất: ${fmtDec(qty, 2)}.` };
    const before = row.qtyOnHand;
    row.qtyOnHand = Math.round((row.qtyOnHand + delta) * 100) / 100;
    row.qtyAvailable = Math.round((row.qtyOnHand - row.qtyReserved) * 100) / 100;
    row.lastUpdated = DB.today + ' 09:00';
    DB.inventoryTransactions.unshift({ id: nextCode('TX-', DB.inventoryTransactions), transactionNumber: refId || nextCode('TX-', DB.inventoryTransactions), type, productId, warehouseId, locationId, lotId, qty: delta, qtyBefore: before, qtyAfter: row.qtyOnHand, refType, refId, userId, date: DB.today, note });
    if (updateMaterial) { const material = Q.material(productId); if (material) material.stock = Math.round((material.stock + delta) * 100) / 100; }
    return { ok: true, row };
  },
};

Views['inv-warehouses'] = function () {
  const rows = DB.warehouses.map((warehouse) => {
    const locations = Q.locationsOf(warehouse.id);
    const stock = DB.inventory.filter((row) => row.warehouseId === warehouse.id).reduce((sum, row) => sum + row.qtyOnHand, 0);
    return `<tr><td><span class="code">${esc(warehouse.code)}</span></td><td class="strong">${esc(warehouse.name)}</td><td>${esc(warehouse.type)}</td><td>${locations.length}</td><td class="right num">${fmtDec(stock, 2)}</td><td>${warehouse.status === 'active' ? '<span class="badge green">Đang hoạt động</span>' : '<span class="badge slate">Ngừng hoạt động</span>'}</td><td class="muted">${esc(warehouse.note)}</td></tr>`;
  });
  const totalLocations = (DB.warehouseLocations || []).length;
  const totalStock = (DB.inventory || []).reduce((sum,row)=>sum+Number(row.qtyOnHand||0),0);
  return `${pageHead('Kho & vị trí lưu trữ', 'Quản lý kho nguyên liệu, sản xuất, bán thành phẩm, thành phẩm, cửa hàng, hàng lỗi và hàng trả về')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Tổng kho', DB.warehouses.length, 'fa-warehouse', 'blue')}
      ${mkpi('Đang hoạt động', DB.warehouses.filter(w=>w.status==='active').length, 'fa-circle-check', 'green')}
      ${mkpi('Tổng vị trí', totalLocations, 'fa-location-dot', 'indigo')}
      ${mkpi('Tổng lượng đang lưu', fmtN(totalStock), 'fa-boxes-stacked', 'teal')}
    </div>
    <div class="card">${tableShell([{ t: 'Mã kho' }, { t: 'Tên kho' }, { t: 'Loại kho' }, { t: 'Số vị trí' }, { t: 'Tồn hiện tại', cls: 'right' }, { t: 'Trạng thái' }, { t: 'Ghi chú' }], rows, { emptyTitle: 'Chưa có kho' })}</div>`;
};

Views['inv-transactions'] = function () {
  const rows = Q.txOf().map((tx) => `<tr><td><span class="code">${esc(tx.id)}</span><div class="cell-sub">${esc(tx.transactionNumber)}</div></td><td>${esc(tx.type)}</td><td><span class="code">${esc(tx.productId)}</span><div class="cell-sub">${esc(Q.material(tx.productId)?.name || Q.product(tx.productId)?.name || '')}</div></td><td>${esc(Q.warehouseName(tx.warehouseId))}</td><td>${esc(Q.lot(tx.lotId)?.lotNumber || '—')}</td><td class="right num" style="color:${tx.qty < 0 ? 'var(--orange)' : 'var(--green)'}">${tx.qty > 0 ? '+' : ''}${fmtDec(tx.qty, 2)}</td><td class="right num">${fmtDec(tx.qtyBefore, 2)} → ${fmtDec(tx.qtyAfter, 2)}</td><td class="num">${fmtDate(tx.date)}</td><td class="muted">${esc(tx.note || '')}</td><td class="right">${rowActions([{act:'inv-tx-view',data:`data-id="${esc(tx.id)}"`,icon:'fa-eye',title:'Xem chi tiết giao dịch'}])}</td></tr>`);
  const txs = Q.txOf();
  const totalIn = txs.filter(tx=>Number(tx.qty||0)>0).reduce((sum,tx)=>sum+Number(tx.qty||0),0);
  const totalOut = Math.abs(txs.filter(tx=>Number(tx.qty||0)<0).reduce((sum,tx)=>sum+Number(tx.qty||0),0));
  return `${pageHead('Sổ giao dịch kho', 'Ledger bất biến của mọi biến động nhập, xuất, chuyển kho, sản xuất và điều chỉnh', '<button class="btn" data-act="inv-export-transactions"><i class="fa-solid fa-file-export"></i>Xuất Excel</button>')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Tổng giao dịch', txs.length, 'fa-book', 'blue')}
      ${mkpi('Tổng nhập', fmtN(totalIn), 'fa-arrow-down', 'green')}
      ${mkpi('Tổng xuất', fmtN(totalOut), 'fa-arrow-up', 'orange')}
      ${mkpi('Giao dịch hôm nay', txs.filter(tx=>String(tx.date||'').slice(0,10)===String(DB.today||'').slice(0,10)).length, 'fa-calendar-day', 'indigo')}
    </div>
    <div class="card">${tableShell([{ t: 'Giao dịch' }, { t: 'Loại' }, { t: 'Sản phẩm' }, { t: 'Kho' }, { t: 'Lô' }, { t: 'Số lượng', cls: 'right' }, { t: 'Trước → Sau', cls: 'right' }, { t: 'Ngày' }, { t: 'Diễn giải' }, {t:'Thao tác',cls:'right'}], rows, { emptyTitle: 'Chưa có giao dịch kho' })}</div>`;
};

Views['inv-alerts'] = function () {
  const low = Q.lowStockAlerts();
  const over = DB.materials.filter((m) => m.maxStock != null && m.stock >= m.maxStock);
  const near = Q.nearExpiryLots();
  const expired = Q.expiredLots();
  const slow = Q.slowMoving();
  const rows = [
    ...low.map((x) => `<tr><td><span class="badge orange">LOW STOCK</span></td><td>${esc(x.material.id)} · ${esc(x.material.name)}</td><td class="right num">${fmtDec(x.available, 2)} / ${fmtDec(x.minimum, 2)} ${esc(x.material.unit)}</td><td>Đề nghị mua hàng</td></tr>`),
    ...over.map((m) => `<tr><td><span class="badge red">OVER STOCK</span></td><td>${esc(m.id)} · ${esc(m.name)}</td><td class="right num">${fmtDec(m.stock, 2)} / ${fmtDec(m.maxStock, 2)} ${esc(m.unit)}</td><td>Kiểm tra mức tồn tối đa</td></tr>`),
    ...near.map((lot) => `<tr><td><span class="badge orange">NEAR EXPIRY</span></td><td>${esc(lot.productId)} · ${esc(lot.lotNumber)}</td><td class="num">HSD ${fmtDate(lot.expiryDate)}</td><td>Ưu tiên FEFO</td></tr>`),
    ...expired.map((lot) => `<tr><td><span class="badge red">EXPIRED</span></td><td>${esc(lot.productId)} · ${esc(lot.lotNumber)}</td><td class="num">HSD ${fmtDate(lot.expiryDate)}</td><td>Chuyển kho lỗi / tiêu hủy</td></tr>`),
    ...slow.map((x) => `<tr><td><span class="badge slate">SLOW MOVING</span></td><td>${esc(x.material.id)} · ${esc(x.material.name)}</td><td class="num">${x.daysSinceIssue == null ? 'Chưa xuất' : x.daysSinceIssue + ' ngày không xuất'}</td><td>Rà soát kế hoạch sử dụng</td></tr>`),
  ];
  return `${pageHead('Cảnh báo tồn kho', 'Theo dõi tồn tối thiểu/tối đa, hạn sử dụng và hàng chậm luân chuyển theo cấu hình')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Tồn dưới min', low.length, 'fa-arrow-down', 'orange', 'warehouse-alert-open-low')}${mkpi('Tồn trên max', over.length, 'fa-arrow-up', 'red', 'warehouse-alert-open-inventory')}${mkpi('Lô cận hạn', near.length, 'fa-calendar-minus', 'orange', 'warehouse-dashboard-open-near-expiry')}${mkpi('Lô hết hạn', expired.length, 'fa-circle-xmark', 'red', 'warehouse-dashboard-open-expired')}${mkpi('Chậm luân chuyển', slow.length, 'fa-hourglass-half', 'slate', 'warehouse-alert-open-inventory')}</div>
    <div class="card">${tableShell([{ t: 'Loại cảnh báo' }, { t: 'Đối tượng' }, { t: 'Thông tin' }, { t: 'Khuyến nghị' }], rows, { emptyTitle: 'Không có cảnh báo' })}</div>`;
};

/* ==========================================================================
 * KHO -> HÀNG LỖI & HÀNG TRẢ VỀ
 * ========================================================================== */
Views['inv-defects'] = function () {
  const f = F('inv-defects', { subtab:'defective', q:'' });
  const subtab = f.subtab || 'defective';
  const q = String(f.q || '').toLowerCase().trim();
  const defectWhIds = new Set((DB.warehouses||[]).filter(w=>w.type==='DEFECTIVE').map(w=>w.id));
  const returnWhIds = new Set((DB.warehouses||[]).filter(w=>w.type==='RETURNED').map(w=>w.id));
  const sourceIds = subtab === 'returned' ? returnWhIds : defectWhIds;
  let rowsData = (DB.inventory||[]).filter(r=>sourceIds.has(r.warehouseId) && Number(r.qtyOnHand||0)>0);
  if (q) rowsData = rowsData.filter(r=>{
    const p=Q.product(r.productId)||Q.material(r.productId), lot=Q.lot(r.lotId), wh=(DB.warehouses||[]).find(w=>w.id===r.warehouseId);
    return [r.productId,p?.name,lot?.lotNumber,r.sourceId,r.productionOrderId,wh?.name].some(v=>String(v||'').toLowerCase().includes(q));
  });
  rowsData.sort((a,b)=>String(b.lastUpdated||'').localeCompare(String(a.lastUpdated||'')));
  const rows = rowsData.map(r=>{
    const p=Q.product(r.productId)||Q.material(r.productId), lot=Q.lot(r.lotId), wh=(DB.warehouses||[]).find(w=>w.id===r.warehouseId), loc=(DB.warehouseLocations||[]).find(l=>l.id===r.locationId);
    const ref = subtab==='returned' ? (r.sourceId||lot?.salesOrderId||'—') : (r.productionOrderId||r.sourceId||lot?.productionOrderId||'—');
    const refAct = ref && ref!=='—' ? (subtab==='returned'?'open-order':'open-production-order') : '';
    const refHtml = refAct ? `<button type="button" class="ref-link compact" data-act="${refAct}" data-id="${esc(ref)}" title="Mở ${subtab==='returned'?'đơn hàng':'lệnh sản xuất'} ${esc(ref)}"><span class="code">${esc(ref)}</span><i class="fa-solid fa-arrow-up-right-from-square"></i></button>` : '<span class="muted">—</span>';
    const typeBadge = subtab==='returned' ? '<span class="badge orange">Hàng trả về</span>' : '<span class="badge red">Hàng lỗi</span>';
    return `<tr class="clickable" data-act="inv-exception-detail" data-product="${esc(r.productId)}" data-lotid="${esc(r.lotId||'')}" data-warehouse="${esc(r.warehouseId)}">
      <td>${cell2(`<span class="code">${esc(r.productId)}</span>`,esc(p?.name||r.productId))}</td>
      <td>${typeBadge}</td><td><span class="code">${esc(lot?.lotNumber||'—')}</span></td><td>${esc(wh?.name||'—')}<div class="cell-sub">${esc(loc?.name||'')}</div></td>
      <td class="right strong num">${fmtN(r.qtyOnHand||0)} ${esc(r.unit||p?.unit||'')}</td><td>${refHtml}</td>
      <td>${fmtDate(String(r.lastUpdated||'').slice(0,10))}</td><td class="right">${rowActions([{act:'inv-exception-detail',data:`data-product="${esc(r.productId)}" data-lotid="${esc(r.lotId||'')}" data-warehouse="${esc(r.warehouseId)}"`,icon:'fa-eye',title:'Xem chi tiết'}])}</td>
    </tr>`;
  });
  const defectQty=(DB.inventory||[]).filter(r=>defectWhIds.has(r.warehouseId)).reduce((s,r)=>s+Number(r.qtyOnHand||0),0);
  const returnQty=(DB.inventory||[]).filter(r=>returnWhIds.has(r.warehouseId)).reduce((s,r)=>s+Number(r.qtyOnHand||0),0);
  const activeQty = subtab==='returned' ? returnQty : defectQty;
  const activeCount = rowsData.length;
  return `${pageHead('Hàng lỗi & hàng trả về','Quản lý tồn cách ly theo lô, vị trí và chứng từ nguồn; không tính vào tồn thành phẩm khả dụng.')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Hàng lỗi',fmtN(defectQty),'fa-triangle-exclamation','red')}${mkpi('Hàng trả về',fmtN(returnQty),'fa-rotate-left','orange')}${mkpi(subtab==='returned'?'Lô hàng trả':'Lô hàng lỗi',fmtN(activeCount),'fa-boxes-stacked','blue')}</div>
    <div class="card inventory-exception-card">
      <div class="toolbar inventory-exception-toolbar"><div class="tabs" style="margin:0"><button class="tab ${subtab==='defective'?'active':''}" data-act="inv-exception-tab" data-tab="defective"><i class="fa-solid fa-triangle-exclamation"></i> Hàng lỗi <span class="tab-count">${fmtN(defectQty)}</span></button><button class="tab ${subtab==='returned'?'active':''}" data-act="inv-exception-tab" data-tab="returned"><i class="fa-solid fa-rotate-left"></i> Hàng trả về <span class="tab-count">${fmtN(returnQty)}</span></button></div><span class="spacer"></span>${searchBox('inv-defects','Tìm mã hàng, lô, đơn hàng, LSX…')}</div>
      <div class="inventory-exception-summary"><div><span>${subtab==='returned'?'Tồn hàng trả hiện tại':'Tồn hàng lỗi hiện tại'}</span><b>${fmtN(activeQty)}</b></div><p>${subtab==='returned'?'Hàng khách trả được lưu riêng để chờ kiểm tra/xử lý.':'Thành phẩm QC không đạt được cách ly khỏi kho thành phẩm.'} Bấm mã tham chiếu để mở chứng từ nguồn.</p></div>
      ${tableShell([{t:'Thành phẩm'},{t:'Phân loại'},{t:'Lô'},{t:'Kho / vị trí'},{t:'Số lượng',cls:'right'},{t:subtab==='returned'?'Tham chiếu đơn bán':'Tham chiếu LSX'},{t:'Ngày ghi nhận'},{t:'',cls:'right'}],rows,{emptyTitle:subtab==='returned'?'Chưa có hàng khách trả':'Chưa có thành phẩm lỗi',emptyDesc:subtab==='returned'?'Hàng trả sẽ xuất hiện khi hoàn thành đơn bán và khai báo số lượng khách trả.':'Sản phẩm QC không đạt sẽ tự chuyển vào đây.'})}
    </div>`;
};

/* ==========================================================================
 * KHO -> KẾ HOẠCH SẢN XUẤT / DUYỆT YÊU CẦU NVL
 * ========================================================================== */
function pfSalesDemandGroups(){
  const excluded=new Set(['dh_cho_xu_ly','dh_hoan_thanh','dh_da_giao','dh_tu_choi','dh_da_huy']);
  const orders=(DB.orders||[])
    .filter(o=>o.approvedAt&&!excluded.has(o.status))
    .slice()
    .sort((a,b)=>String(a.dueDate||a.date||a.id).localeCompare(String(b.dueDate||b.date||b.id)));
  const remaining=new Map();
  const getAvailable=(pid)=>{
    if(!remaining.has(pid)){
      const qty=(typeof SalesCRM!=='undefined'&&SalesCRM.finishedAvailable)?Number(SalesCRM.finishedAvailable(pid)||0):Number(pfFinishedStock(pid)||0);
      remaining.set(pid,qty);
    }
    return Number(remaining.get(pid)||0);
  };
  const activePlans=(DB.productionPlans||[]).filter(p=>p.source==='SALES_ORDER'&&p.status!=='CANCELLED');
  return orders.map(o=>{
    const lines=(o.items||[]).map(it=>{
      const need=Number(it.qty||0);
      const avail=getAvailable(it.productId);
      const allocated=Math.min(need,avail);
      remaining.set(it.productId,Math.max(0,avail-allocated));
      const shortage=Math.max(0,need-allocated);
      const planned=activePlans.filter(p=>p.sourceOrderId===o.id).reduce((sum,p)=>sum+(p.items||[]).filter(x=>x.productId===it.productId).reduce((s,x)=>s+Number(x.qty||0),0),0);
      return {productId:it.productId,name:it.name||Q.product(it.productId)?.name||it.productId,unit:it.unit||Q.product(it.productId)?.unit||'',need,allocated,shortage,planned,unplanned:Math.max(0,shortage-planned)};
    });
    return {order:o,lines,shortage:lines.reduce((s,x)=>s+x.shortage,0),planned:lines.reduce((s,x)=>s+x.planned,0),unplanned:lines.reduce((s,x)=>s+x.unplanned,0)};
  });
}
Views['warehouse-production-plan'] = function () {
  const plans=(DB.productionPlans||[]).filter(p=>p.status!=='CANCELLED');
  const zero=(DB.products||[]).filter(p=>pfFinishedStock(p.id)<=0);
  const demands=pfSalesDemandGroups();
  const demandRows=demands.map(g=>{
    const o=g.order;
    const planIds=(DB.productionPlans||[]).filter(p=>p.source==='SALES_ORDER'&&p.sourceOrderId===o.id&&p.status!=='CANCELLED').map(p=>p.id);
    const status=g.shortage<=0?'<span class="badge green">Đủ tồn khả dụng</span>':g.unplanned>0?'<span class="badge orange">Thiếu · Chưa lập đủ KH</span>':'<span class="badge blue">Đã lập kế hoạch</span>';
    return `<tr><td><span class="code">${esc(o.id)}</span><div class="cell-sub">${esc(Q.customerName(o.customerId)||'')}</div></td>
      <td>${(g.lines||[]).map(x=>`${esc(x.name)}<div class="cell-sub">Đặt ${fmtN(x.need)} · khả dụng ${fmtN(x.allocated)} · thiếu ${fmtN(x.shortage)} ${esc(x.unit)}</div>`).join('<br>')}</td>
      <td>${fmtDate(o.dueDate)}</td><td>${status}${planIds.length?`<div class="cell-sub">${planIds.map(id=>esc(id)).join(', ')}</div>`:''}</td>
      <td class="right">${rowActions([{act:'open-order',data:`data-id="${esc(o.id)}"`,icon:'fa-eye',title:'Xem chi tiết đơn hàng'},...(g.unplanned>0?[{act:'pf-plan-from-sales-order',data:`data-id="${esc(o.id)}"`,icon:'fa-industry',title:'Lập kế hoạch sản xuất phần thiếu'}]:[])])}</td></tr>`;
  });
  const rows=plans.map(p=>`<tr><td><span class="code">${esc(p.id)}</span>${p.source==='SALES_ORDER'?`<div class="cell-sub">Đơn ${esc(p.sourceOrderId||'')}</div>`:''}</td><td>${fmtDate(p.date)}</td>
    <td>${(p.items||[]).map(i=>`${esc(Q.product(i.productId)?.name||i.productId)} · <b>${fmtN(i.qty)}</b>`).join('<br>')}</td>
    <td>${pfPlanStatus(p.status)}</td><td>${esc(Q.employeeName(p.createdBy)||p.createdBy||'—')}</td>
    <td class="right">${rowActions([
      {act:'pf-plan-view',data:`data-id="${esc(p.id)}"`,icon:'fa-eye',title:'Xem chi tiết kế hoạch'},
      ...(p.status==='WAITING_APPROVAL'?[...(p.source!=='SALES_ORDER'?[{act:'pf-plan-edit',data:`data-id="${esc(p.id)}"`,icon:'fa-pen',title:'Sửa kế hoạch'}]:[]),{act:'pf-plan-approve',data:`data-id="${esc(p.id)}"`,icon:'fa-check',title:'Duyệt kế hoạch'},{act:'pf-plan-delete',data:`data-id="${esc(p.id)}"`,icon:'fa-trash',title:'Xóa kế hoạch'}]:[])
    ])}</td></tr>`);
  return `${pageHead('Kế hoạch sản xuất','Kho theo dõi đơn bán đã duyệt, kiểm tra tồn thành phẩm và lập kế hoạch cho phần thiếu trước khi chuyển sang Sản xuất.',
    '<button class="btn btn-primary" data-act="pf-plan-new"><i class="fa-solid fa-plus"></i>Lập kế hoạch nội bộ</button>')}
    ${zero.length?`<div class="card" style="margin-bottom:14px;border-left:3px solid var(--orange)"><div class="card-head"><span class="mkpi-ico t-orange"><i class="fa-solid fa-triangle-exclamation"></i></span><div><h3>${zero.length} thành phẩm đang hết tồn</h3><p>${zero.map(p=>esc(p.name)).join(' · ')}</p></div></div></div>`:''}
    <div class="card" style="margin-bottom:14px"><div class="card-head"><div><h3>Nhu cầu từ đơn bán</h3><p>Kho chỉ lập kế hoạch khi đơn đã duyệt và phần tồn khả dụng không đủ đáp ứng. Sản phẩm và số lượng thiếu được tính tự động.</p></div></div>
      ${tableShell([{t:'Đơn hàng'},{t:'Thành phẩm / Nhu cầu'},{t:'Ngày giao'},{t:'Tình trạng'},{t:'Thao tác',cls:'right'}],demandRows,{emptyTitle:'Không có đơn bán đang chờ thành phẩm'})}</div>
    <div class="card"><div class="card-head"><div><h3>Kế hoạch sản xuất</h3><p>Kế hoạch từ đơn bán hoặc kế hoạch nội bộ của Kho.</p></div></div>${tableShell([{t:'Kế hoạch'},{t:'Ngày lập'},{t:'Thành phẩm / SL'},{t:'Trạng thái'},{t:'Người lập'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:'Chưa có kế hoạch sản xuất'})}</div>`;
};

Views['warehouse-production-requests'] = function () {
  const reqs=DB.productionMaterialRequests||[];
  const rows=reqs.map(r=>`<tr><td><span class="code">${esc(r.id)}</span><div class="cell-sub">${esc(r.planId)}</div></td><td>${fmtDate(r.date)}</td>
    <td>${(r.items||[]).map(i=>`${esc(Q.material(i.materialId)?.name||i.materialId)} · <b>${fmtDec(i.qty,2)} ${esc(Q.material(i.materialId)?.unit||'')}</b>`).join('<br>')}</td>
    <td>${pfRequestStatus(r.status)}</td><td>${esc(Q.employeeName(r.createdBy)||r.createdBy||'—')}</td>
    <td class="right">${rowActions([
      {act:'pf-mr-view',data:`data-id="${esc(r.id)}"`,icon:'fa-eye',title:'Xem chi tiết'},
      ...(r.status==='WAITING_WAREHOUSE_APPROVAL'?[{act:'pf-mr-edit',data:`data-id="${esc(r.id)}"`,icon:'fa-pen',title:'Sửa phiếu'},{act:'pf-mr-approve',data:`data-id="${esc(r.id)}"`,icon:'fa-check',title:'Duyệt yêu cầu NVL'},{act:'pf-mr-delete',data:`data-id="${esc(r.id)}"`,icon:'fa-trash',title:'Xóa phiếu'}]:[]),
      ...(r.status==='APPROVED'?[{act:'pf-mr-issue',data:`data-id="${esc(r.id)}"`,icon:'fa-arrow-up-from-bracket',title:'Xuất NVL cho sản xuất'}]:[])
    ])}</td></tr>`);
  return `${pageHead('Yêu cầu NVL sản xuất','Kho duyệt phiếu yêu cầu và xuất nguyên liệu sang sản xuất')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Chờ duyệt',reqs.filter(r=>r.status==='WAITING_WAREHOUSE_APPROVAL').length,'fa-hourglass-half','orange')}
      ${mkpi('Đã duyệt',reqs.filter(r=>r.status==='APPROVED').length,'fa-circle-check','blue')}
      ${mkpi('Đã xuất',reqs.filter(r=>r.status==='ISSUED').length,'fa-truck-ramp-box','green')}
    </div><div class="card">${tableShell([{t:'Phiếu'},{t:'Ngày'},{t:'Nguyên liệu / SL'},{t:'Trạng thái'},{t:'Người yêu cầu'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:'Chưa có yêu cầu NVL sản xuất'})}</div>`;
};

const _warehouseViewBeforeProductionFlow = Views.warehouse;
Views.warehouse = function () {
  const tab=State.tab||'dashboard';
  if(tab==='production_plan') return Views['warehouse-production-plan']();
  if(tab==='production_requests'){ F('inv-issues').issueTab='raw'; return Views['inv-issues'](); }
  return _warehouseViewBeforeProductionFlow ? _warehouseViewBeforeProductionFlow(State.params) : '';
};


/* ========================================================================== 
 * UI33 — Kho: Kế hoạch sản xuất & gia công với 2 subtab ngang.
 * ======================================================================= */
Views['warehouse-production-plan'] = function () {
  const f=F('warehouse-production-plan',{planTab:'production'});
  const planTab=f.planTab==='subcontracting'?'subcontracting':'production';
  const tabs=`<div class="tabs" style="margin-bottom:14px">
    <button class="tab ${planTab==='production'?'active':''}" data-act="warehouse-plan-tab" data-tab="production"><i class="fa-solid fa-industry"></i>Kế hoạch sản xuất</button>
    <button class="tab ${planTab==='subcontracting'?'active':''}" data-act="warehouse-plan-tab" data-tab="subcontracting"><i class="fa-solid fa-screwdriver-wrench"></i>Kế hoạch gia công</button>
  </div>`;

  if(planTab==='subcontracting'){
    const all=(typeof subcontractV3Orders==='function'?subcontractV3Orders():(DB.subcontractingOrders||[]));
    // Kho chỉ nhận kế hoạch đã được bộ phận Gia công duyệt.
    const plans=all.filter(o=>o.status!=='DRAFT' && o.status!=='CANCELLED');
    const waiting=plans.filter(o=>o.status==='APPROVED').length;
    const issued=plans.filter(o=>!!o.issueId).length;
    const rows=plans.map(o=>{
      const acts=[];
      if(o.status==='APPROVED') acts.push({act:'warehouse-open-subcontract-issue',data:`data-id="${esc(o.id)}"`,icon:'fa-arrow-up-from-bracket',title:'Mở tại Xuất kho nguyên liệu'});
      return `<tr class="clickable" data-act="subcontracting-open" data-id="${esc(o.id)}"><td><span class="code">${esc(o.id)}</span></td><td>${esc(o.partner||'—')}</td><td>${esc(Q.product(o.productId)?.name||o.productId)}<div class="cell-sub">SL ${fmtDec(o.plannedQty,2)} ${esc(Q.product(o.productId)?.unit||o.unit||'')}</div></td><td>${fmtDate(o.issueDate)}</td><td>${fmtDate(o.dueDate)}</td><td>${typeof subcontractV3StatusHtml==='function'?subcontractV3StatusHtml(o.status):badge(o.status)}</td><td>${o.issueId?`<span class="code">${esc(o.issueId)}</span>`:'—'}</td><td class="right">${rowActions(acts)}</td></tr>`;
    }).join('');
    return `${pageHead('Kế hoạch sản xuất & gia công','Kho theo dõi kế hoạch nội bộ và kế hoạch gia công đã được duyệt. Xuất NVL gia công được thực hiện tại Kho → Xuất kho → Kho nguyên liệu.')}
      ${tabs}
      <div class="grid g-auto-sm" style="margin-bottom:14px">
        ${mkpi('Kế hoạch đã nhận',plans.length,'fa-clipboard-list','blue')}
        ${mkpi('Chờ xuất NVL',waiting,'fa-box-open','orange')}
        ${mkpi('Đã có phiếu xuất',issued,'fa-arrow-up-from-bracket','green')}
      </div>
      <div class="card"><div class="card-head"><div><h3>Kế hoạch gia công</h3><p>Thông tin từ phân hệ Gia công sau khi kế hoạch được duyệt. Kho theo dõi và thực hiện xuất nguyên liệu ở màn Xuất kho.</p></div></div>
        ${tableShell([{t:'Kế hoạch'},{t:'Đối tác'},{t:'Thành phẩm / SL'},{t:'Ngày giao NVL'},{t:'Hạn hoàn thành'},{t:'Trạng thái'},{t:'Phiếu xuất'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:'Chưa có kế hoạch gia công đã duyệt'})}
      </div>`;
  }

  const plans=(DB.productionPlans||[]).filter(p=>p.status!=='CANCELLED');
  const zero=(DB.products||[]).filter(p=>pfFinishedStock(p.id)<=0);
  const demands=pfSalesDemandGroups();
  const demandRows=demands.map(g=>{
    const o=g.order;
    const planIds=(DB.productionPlans||[]).filter(p=>p.source==='SALES_ORDER'&&p.sourceOrderId===o.id&&p.status!=='CANCELLED').map(p=>p.id);
    const status=g.shortage<=0?'<span class="badge green">Đủ tồn khả dụng</span>':g.unplanned>0?'<span class="badge orange">Thiếu · Chưa lập đủ KH</span>':'<span class="badge blue">Đã lập kế hoạch</span>';
    return `<tr><td><span class="code">${esc(o.id)}</span><div class="cell-sub">${esc(Q.customerName(o.customerId)||'')}</div></td><td>${(g.lines||[]).map(x=>`${esc(x.name)}<div class="cell-sub">Đặt ${fmtN(x.need)} · khả dụng ${fmtN(x.allocated)} · thiếu ${fmtN(x.shortage)} ${esc(x.unit)}</div>`).join('<br>')}</td><td>${fmtDate(o.dueDate)}</td><td>${status}${planIds.length?`<div class="cell-sub">${planIds.map(id=>esc(id)).join(', ')}</div>`:''}</td><td class="right">${rowActions([{act:'open-order',data:`data-id="${esc(o.id)}"`,icon:'fa-eye',title:'Xem chi tiết đơn hàng'},...(g.unplanned>0?[{act:'pf-plan-from-sales-order',data:`data-id="${esc(o.id)}"`,icon:'fa-industry',title:'Lập kế hoạch sản xuất phần thiếu'}]:[])])}</td></tr>`;
  }).join('');
  const rows=plans.map(p=>`<tr><td><span class="code">${esc(p.id)}</span>${p.source==='SALES_ORDER'?`<div class="cell-sub">Đơn ${esc(p.sourceOrderId||'')}</div>`:''}</td><td>${fmtDate(p.date)}</td><td>${(p.items||[]).map(i=>`${esc(Q.product(i.productId)?.name||i.productId)} · <b>${fmtN(i.qty)}</b>`).join('<br>')}</td><td>${pfPlanStatus(p.status)}</td><td>${esc(Q.employeeName(p.createdBy)||p.createdBy||'—')}</td><td class="right">${rowActions([{act:'pf-plan-view',data:`data-id="${esc(p.id)}"`,icon:'fa-eye',title:'Xem chi tiết kế hoạch'},...(p.status==='WAITING_APPROVAL'?[...(p.source!=='SALES_ORDER'?[{act:'pf-plan-edit',data:`data-id="${esc(p.id)}"`,icon:'fa-pen',title:'Sửa kế hoạch'}]:[]),{act:'pf-plan-approve',data:`data-id="${esc(p.id)}"`,icon:'fa-check',title:'Duyệt kế hoạch'},{act:'pf-plan-delete',data:`data-id="${esc(p.id)}"`,icon:'fa-trash',title:'Xóa kế hoạch'}]:[])])}</td></tr>`).join('');
  return `${pageHead('Kế hoạch sản xuất & gia công','Kho theo dõi nhu cầu thành phẩm, lập kế hoạch sản xuất và nhận thông tin kế hoạch gia công đã duyệt.',`<button class="btn btn-primary" data-act="pf-plan-new"><i class="fa-solid fa-plus"></i>Lập kế hoạch sản xuất</button>`)}
    ${tabs}
    ${zero.length?`<div class="card" style="margin-bottom:14px;border-left:3px solid var(--orange)"><div class="card-head"><span class="mkpi-ico t-orange"><i class="fa-solid fa-triangle-exclamation"></i></span><div><h3>${zero.length} thành phẩm đang hết tồn</h3><p>${zero.map(p=>esc(p.name)).join(' · ')}</p></div></div></div>`:''}
    <div class="card" style="margin-bottom:14px"><div class="card-head"><div><h3>Nhu cầu từ đơn bán</h3><p>Kho lập kế hoạch khi đơn đã duyệt và tồn khả dụng không đủ đáp ứng.</p></div></div>${tableShell([{t:'Đơn hàng'},{t:'Thành phẩm / Nhu cầu'},{t:'Ngày giao'},{t:'Tình trạng'},{t:'Thao tác',cls:'right'}],demandRows,{emptyTitle:'Không có đơn bán đang chờ thành phẩm'})}</div>
    <div class="card"><div class="card-head"><div><h3>Kế hoạch sản xuất</h3><p>Kế hoạch từ đơn bán hoặc kế hoạch nội bộ của Kho.</p></div></div>${tableShell([{t:'Kế hoạch'},{t:'Ngày lập'},{t:'Thành phẩm / SL'},{t:'Trạng thái'},{t:'Người lập'},{t:'Thao tác',cls:'right'}],rows,{emptyTitle:'Chưa có kế hoạch sản xuất'})}</div>`;
};


/* ========================================================================== 
 * UI34 — Hàng lỗi & hàng trả về: subtab ngang chuẩn, click dòng xem chi tiết.
 * ======================================================================= */
Views['inv-defects'] = function () {
  const f = F('inv-defects', { subtab:'defective', q:'' });
  const subtab = f.subtab || 'defective';
  const q = String(f.q || '').toLowerCase().trim();
  const defectWhIds = new Set((DB.warehouses||[]).filter(w=>w.type==='DEFECTIVE').map(w=>w.id));
  const returnWhIds = new Set((DB.warehouses||[]).filter(w=>w.type==='RETURNED').map(w=>w.id));
  const sourceIds = subtab === 'returned' ? returnWhIds : defectWhIds;
  let rowsData=(DB.inventory||[]).filter(r=>sourceIds.has(r.warehouseId)&&Number(r.qtyOnHand||0)>0);
  if(q) rowsData=rowsData.filter(r=>{
    const p=Q.product(r.productId)||Q.material(r.productId),lot=Q.lot(r.lotId),wh=(DB.warehouses||[]).find(w=>w.id===r.warehouseId);
    return [r.productId,p?.name,lot?.lotNumber,r.sourceId,r.productionOrderId,wh?.name].some(v=>String(v||'').toLowerCase().includes(q));
  });
  rowsData.sort((a,b)=>String(b.lastUpdated||'').localeCompare(String(a.lastUpdated||'')));
  const rows=rowsData.map(r=>{
    const p=Q.product(r.productId)||Q.material(r.productId), lot=Q.lot(r.lotId), wh=(DB.warehouses||[]).find(w=>w.id===r.warehouseId), loc=(DB.warehouseLocations||[]).find(l=>l.id===r.locationId);
    const ref=subtab==='returned'?(r.sourceId||lot?.salesOrderId||'—'):(r.productionOrderId||r.sourceId||lot?.productionOrderId||'—');
    const refAct=ref&&ref!=='—'?(subtab==='returned'?'open-order':'open-production-order'):'';
    const refHtml=refAct?`<button type="button" class="ref-link compact" data-act="${refAct}" data-id="${esc(ref)}" title="Mở ${subtab==='returned'?'đơn hàng':'lệnh sản xuất'} ${esc(ref)}"><span class="code">${esc(ref)}</span><i class="fa-solid fa-arrow-up-right-from-square"></i></button>`:'<span class="muted">—</span>';
    const typeBadge=subtab==='returned'?'<span class="badge orange">Hàng trả về</span>':'<span class="badge red">Hàng lỗi</span>';
    return `<tr class="clickable" data-act="inv-exception-detail" data-product="${esc(r.productId)}" data-lotid="${esc(r.lotId||'')}" data-warehouse="${esc(r.warehouseId)}">
      <td>${cell2(`<span class="code">${esc(r.productId)}</span>`,esc(p?.name||r.productId))}</td><td>${typeBadge}</td><td><span class="code">${esc(lot?.lotNumber||'—')}</span></td>
      <td>${esc(wh?.name||'—')}<div class="cell-sub">${esc(loc?.name||'')}</div></td><td class="right strong num">${fmtN(r.qtyOnHand||0)} ${esc(r.unit||p?.unit||'')}</td>
      <td>${refHtml}</td><td>${fmtDate(String(r.lastUpdated||'').slice(0,10))}</td></tr>`;
  }).join('');
  const defectQty=(DB.inventory||[]).filter(r=>defectWhIds.has(r.warehouseId)).reduce((s,r)=>s+Number(r.qtyOnHand||0),0);
  const returnQty=(DB.inventory||[]).filter(r=>returnWhIds.has(r.warehouseId)).reduce((s,r)=>s+Number(r.qtyOnHand||0),0);
  const activeCount=rowsData.length;
  const tabs=`<div class="tabs" style="margin-bottom:14px"><button class="tab ${subtab==='defective'?'active':''}" data-act="inv-exception-tab" data-tab="defective"><i class="fa-solid fa-triangle-exclamation"></i>Hàng lỗi</button><button class="tab ${subtab==='returned'?'active':''}" data-act="inv-exception-tab" data-tab="returned"><i class="fa-solid fa-rotate-left"></i>Hàng trả về</button></div>`;
  return `${pageHead('Hàng lỗi & hàng trả về','Quản lý tồn cách ly theo lô, vị trí và chứng từ nguồn; không tính vào tồn thành phẩm khả dụng.')}
    ${tabs}
    <div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Hàng lỗi',fmtN(defectQty),'fa-triangle-exclamation','red')}${mkpi('Hàng trả về',fmtN(returnQty),'fa-rotate-left','orange')}${mkpi(subtab==='returned'?'Lô hàng trả':'Lô hàng lỗi',fmtN(activeCount),'fa-boxes-stacked','blue')}</div>
    <div class="card"><div class="card-head"><div><h3>${subtab==='returned'?'Hàng trả về':'Hàng lỗi'}</h3><p>Click vào dòng để xem chi tiết. Mã tham chiếu có thể bấm để mở chứng từ nguồn.</p></div><div>${searchBox('inv-defects','Tìm mã hàng, lô, đơn hàng, LSX…')}</div></div>
      ${tableShell([{t:'Thành phẩm'},{t:'Phân loại'},{t:'Lô'},{t:'Kho / vị trí'},{t:'Số lượng',cls:'right'},{t:subtab==='returned'?'Tham chiếu đơn bán':'Tham chiếu LSX'},{t:'Ngày ghi nhận'}],rows,{emptyTitle:subtab==='returned'?'Chưa có hàng khách trả':'Chưa có thành phẩm lỗi',emptyDesc:subtab==='returned'?'Hàng trả sẽ xuất hiện khi hoàn thành đơn bán và khai báo số lượng khách trả.':'Sản phẩm QC không đạt sẽ tự chuyển vào đây.'})}
    </div>`;
};
