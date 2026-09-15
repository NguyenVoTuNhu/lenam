/* ============================================================================
 * MODULE: CÁC PHÂN HỆ DOANH NGHIỆP LÊ NAM
 * Bảng điều hành nhẹ cho các phân hệ chưa có backend riêng trong bản SPA demo.
 * ==========================================================================*/

const ENTERPRISE_MODULES = {
  subcontracting: {
    title: 'Quản lý gia công',
    sub: 'Theo dõi nguyên liệu gửi đối tác, tiến độ, hao hụt, lỗi và công nợ gia công',
    icon: 'fa-industry',
    columns: ['Mã lệnh', 'Đối tác', 'Sản phẩm', 'SL giao', 'Tiến độ', 'Tỷ lệ lỗi', 'Trạng thái'],
    rows: [
      ['GC-2026-001', 'Cơ sở Đậu Hủ Tân Phúc', 'Đậu hủ cứng đóng khuôn', '500 Kg', '80%', '1,2%', 'Đang thực hiện'],
      ['GC-2026-002', 'Xưởng Đóng Gói An Bình', 'Đậu hủ chiên giòn', '2.000 Gói', '100%', '0,5%', 'Chờ QC'],
    ],
  },
  restaurant: {
    title: 'Nhà hàng & POS',
    sub: 'Theo dõi doanh thu cửa hàng, ca bán hàng, định lượng món và chi phí nguyên liệu',
    icon: 'fa-utensils',
    columns: ['Cửa hàng', 'Doanh thu hôm nay', 'Đơn hàng', 'Food Cost', 'Ca hiện tại', 'Trạng thái'],
    rows: [
      ['Cửa hàng Lê Văn Việt', '18.450.000đ', '126', '32,4%', 'Ca sáng', 'Đang bán'],
      ['Quầy Bún Đậu Thủ Đức', '12.680.000đ', '94', '30,8%', 'Ca trưa', 'Đang bán'],
    ],
  },
  accounting: {
    title: 'Kế toán & tài chính',
    sub: 'Tổng hợp doanh thu, công nợ, dòng tiền và giá vốn liên thông từ bán hàng, mua hàng và kho',
    icon: 'fa-file-invoice-dollar',
    columns: ['Chỉ tiêu', 'Tháng này', 'Tháng trước', 'Biến động', 'Nguồn dữ liệu'],
    rows: [
      ['Doanh thu thuần', '486.000.000đ', '455.000.000đ', '+6,8%', 'Đơn hàng'],
      ['Giá vốn hàng bán', '298.000.000đ', '281.000.000đ', '+6,0%', 'Kho & sản xuất'],
      ['Công nợ phải thu', '128.000.000đ', '121.000.000đ', '+5,8%', 'Bán hàng'],
      ['Công nợ phải trả', '76.500.000đ', '82.000.000đ', '-6,7%', 'Mua hàng'],
    ],
  },
  quality: {
    title: 'QC / QA & truy xuất nguồn gốc',
    sub: 'Kiểm tra nguyên liệu, bán thành phẩm, thành phẩm và truy xuất từ lô đến nhà cung cấp',
    icon: 'fa-clipboard-check',
    columns: ['Mã kiểm tra', 'Đối tượng', 'Lô', 'Kết quả', 'Người kiểm', 'Trạng thái'],
    rows: [
      ['QC-2026-018', 'Đậu hủ non', 'LOT-DHN-260827', 'Đạt', 'Ngô Thị Lan', 'PASSED'],
      ['QC-2026-017', 'Đậu nành nguyên hạt', 'LOT-DN-260810', 'Đạt', 'Trịnh Văn Kiểm', 'PASSED'],
      ['QC-2026-016', 'Đậu hủ cứng', 'LOT-DHC-260826', 'Chờ kiểm', 'Trịnh Văn Kiểm', 'QC_PENDING'],
    ],
  },
  maintenance: {
    title: 'Bảo trì thiết bị',
    sub: 'Lịch bảo trì máy xay, nồi nấu, máy ép, máy đóng gói và kho lạnh',
    icon: 'fa-screwdriver-wrench',
    columns: ['Thiết bị', 'Khu vực', 'Bảo trì gần nhất', 'Lần kế tiếp', 'Downtime', 'Trạng thái'],
    rows: [
      ['Máy xay XD-200', 'Khu Xay', '2026-08-01', '2026-09-01', '2,5 giờ', 'Đúng hạn'],
      ['Kho lạnh KL-01', 'Kho thành phẩm', '2026-07-28', '2026-08-28', '0 giờ', 'Đến hạn'],
    ],
  },
  logistics: {
    title: 'Logistics & đội xe',
    sub: 'Điều phối giao đậu hủ, theo dõi tài xế, chi phí/km và tỷ lệ giao đúng hạn',
    icon: 'fa-truck-fast',
    columns: ['Mã chuyến', 'Tuyến giao', 'Xe', 'Tài xế', 'Giờ dự kiến', 'Trạng thái'],
    rows: [
      ['GH-2026-084', 'Kho lạnh → Quận 9', '51C-123.45', 'Đinh Thị Hương', '09:30', 'Đang giao'],
      ['GH-2026-085', 'Kho lạnh → Bình Dương', '51C-678.90', 'Nguyễn Văn Bình', '13:00', 'Đã lập kế hoạch'],
    ],
  },
  rnd: {
    title: 'R&D công thức sản phẩm',
    sub: 'Quản lý thử nghiệm, phiên bản công thức, chi phí và quy trình duyệt sản phẩm mới',
    icon: 'fa-flask',
    columns: ['Mã dự án', 'Sản phẩm thử nghiệm', 'Phiên bản', 'Chi phí thử', 'Người phụ trách', 'Trạng thái'],
    rows: [
      ['RND-2026-004', 'Đậu hủ rong biển', 'v0.3', '8.500.000đ', 'Ngô Thị Lan', 'Đang thử nghiệm'],
      ['RND-2026-003', 'Đậu hủ protein cao', 'v1.0', '12.200.000đ', 'Phạm Quốc Bảo', 'Chờ duyệt'],
    ],
  },
  approvals: {
    title: 'Phê duyệt nghiệp vụ',
    sub: 'Tập trung các yêu cầu mua, thanh toán, xuất kho đặc biệt, hủy hàng và điều chỉnh sản xuất',
    icon: 'fa-signature',
    columns: ['Mã yêu cầu', 'Loại', 'Người đề nghị', 'Số tiền / SL', 'Hạn duyệt', 'Trạng thái'],
    rows: [
      ['YCM-2026-0044', 'Đề nghị mua nguyên liệu', 'Võ Thị Kim Ngân', '12.400.000đ', '2026-08-28', 'Chờ duyệt'],
      ['PX-2026-0320', 'Xuất kho đặc biệt', 'Cao Văn Thắng', '120 Kg', '2026-08-28', 'Chờ quản lý'],
    ],
  },
};

function enterpriseView(key) {
  const module = ENTERPRISE_MODULES[key];
  const rowHtml = module.rows.map((row) => `<tr>${row.map((cell, index) => `<td class="${index === row.length - 1 ? '' : 'num'}">${esc(cell)}</td>`).join('')}</tr>`);
  return `${pageHead(module.title, module.sub, `<button class="btn" data-act="export-enterprise" data-key="${key}"><i class="fa-solid fa-file-export"></i>Xuất báo cáo</button><button class="btn btn-primary" data-act="enterprise-action" data-key="${key}"><i class="fa-solid fa-plus"></i>Tạo mới</button>`)}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Bản ghi đang theo dõi', module.rows.length, module.icon, 'blue')}
      ${mkpi('Cập nhật hôm nay', module.rows.length, 'fa-clock', 'teal')}
      ${mkpi('Cần xử lý', module.rows.filter((row) => /Chờ|Đến hạn|Đang/.test(row[row.length - 1])).length, 'fa-triangle-exclamation', 'orange')}
    </div>
    <div class="card"><div class="card-head"><div><h3>${esc(module.title)}</h3><p>${esc(module.sub)}</p></div></div>${tableShell(module.columns.map((t) => ({ t })), rowHtml, { emptyTitle: 'Chưa có dữ liệu phân hệ' })}</div>`;
}

// Object.keys(ENTERPRISE_MODULES).forEach((key) => { Views[key] = () => enterpriseView(key); });

/* ==========================================================================
 * NHÀ HÀNG & CỬA HÀNG
 * Dùng dữ liệu POS/cửa hàng/công thức đã có, không tạo thêm request mạng.
 * ======================================================================= */
let __restaurantHydrated = false;
function restaurantHydrate() {
  if (__restaurantHydrated) return;
  __restaurantHydrated = true;
  try {
    const raw = localStorage.getItem('lenam_restaurant_v1');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.stores)) DB.stores = saved.stores;
    if (Array.isArray(saved.recipes)) DB.restaurantRecipes = saved.recipes;
    if (Array.isArray(saved.orders)) DB.posOrders = saved.orders;
  } catch (err) { console.warn('[Restaurant] Không đọc được cache local:', err); }
}
function restaurantPersist() {
  try { localStorage.setItem('lenam_restaurant_v1', JSON.stringify({ stores:DB.stores||[], recipes:DB.restaurantRecipes||[], orders:DB.posOrders||[] })); }
  catch (err) { console.warn('[Restaurant] Không lưu được cache local:', err); }
}
function restaurantToday(){ return typeof currentDateYMD==='function' ? currentDateYMD() : (DB.today || new Date().toISOString().slice(0,10)); }
function restaurantStore(id){ return (DB.stores||[]).find(x=>x.id===id); }
function restaurantRecipe(id){ return (DB.restaurantRecipes||[]).find(x=>x.id===id); }
function restaurantOrderTotal(order){ return (order?.items||[]).reduce((s,i)=>s+Number(i.quantity||0)*Number(i.price||0),0); }
function restaurantChannelLabel(channel){ return ({POS:'POS tại quầy',TABLET:'Tablet Ordering',QR:'QR Ordering'})[channel||'POS'] || channel || 'POS tại quầy'; }
function restaurantStatus(status){
  const m={PAID:['Đã thanh toán','green'],OPEN:['Chờ xử lý','orange'],CANCELLED:['Đã hủy','gray']}; const x=m[status]||[status||'—','gray'];
  return `<span class="badge ${x[1]}">${esc(x[0])}</span>`;
}
function restaurantTabs(active){
  return moduleTabs([
    {id:'dashboard',label:'Tổng quan',route:'restaurant',tab:'dashboard'},
    {id:'pos',label:'POS bán hàng',route:'restaurant',tab:'pos'},
    {id:'tablet',label:'Tablet Ordering',route:'restaurant',tab:'tablet'},
    {id:'qr',label:'QR Ordering',route:'restaurant',tab:'qr'},
    {id:'menu',label:'Menu / Combo',route:'restaurant',tab:'menu'},
    {id:'recipe',label:'Recipe / BOM món',route:'restaurant',tab:'recipe'},
    {id:'orders',label:'Đơn hàng',route:'restaurant',tab:'orders'},
    {id:'branches',label:'Chi nhánh',route:'restaurant',tab:'branches'},
    {id:'issue',label:'Xuất kho nguyên liệu',route:'restaurant',tab:'issue'},
    {id:'revenue',label:'Doanh thu',route:'restaurant',tab:'revenue'},
    {id:'reports',label:'Báo cáo cửa hàng',route:'restaurant',tab:'reports'}
  ], active);
}
function restaurantOrderRows(list){
  return (list||[]).map(order=>{
    const store=restaurantStore(order.storeId); const total=restaurantOrderTotal(order);
    const acts=[{act:'restaurant-order-view',data:`data-id="${esc(order.id)}"`,icon:'fa-eye',title:'Xem chi tiết'}];
    if(order.status==='OPEN') acts.push({act:'restaurant-order-pay',data:`data-id="${esc(order.id)}"`,icon:'fa-credit-card',title:'Thanh toán'});
    if(order.status==='OPEN') acts.push({act:'restaurant-order-delete',data:`data-id="${esc(order.id)}"`,icon:'fa-trash',title:'Xóa đơn chưa thanh toán'});
    return `<tr><td><span class="code">${esc(order.id)}</span></td><td>${fmtDate(order.date)}</td><td>${esc(store?.name||order.storeId)}</td><td>${esc(restaurantChannelLabel(order.channel))}</td><td>${esc(order.tableNo||'—')}</td><td>${esc(order.shift||'—')}</td><td class="right num">${fmtVND(total)}</td><td>${restaurantStatus(order.status)}</td><td>${rowActions(acts)}</td></tr>`;
  }).join('');
}
function restaurantRecipeRows(mode='menu'){
  return (DB.restaurantRecipes||[]).map(r=>{
    const foodCost=(r.items||[]).reduce((s,i)=>{const m=Q.material(i.materialId);return s+Number(i.quantity||0)*Number(m?.price||0);},0);
    const detail=mode==='recipe' ? (r.items||[]).map(i=>`${esc(Q.material(i.materialId)?.name||i.materialId)}: ${fmtDec(i.quantity,3)} ${esc(i.unit||Q.material(i.materialId)?.unit||'')}`).join('<br>') : esc(r.unit||'');
    return `<tr><td><span class="code">${esc(r.id)}</span></td><td>${cell2(esc(r.name),esc(r.group||''))}</td><td class="right num">${fmtVND(r.price||0)}</td>${mode==='recipe'?`<td>${detail||'—'}</td><td class="right num">${fmtVND(foodCost)}</td>`:`<td>${detail}</td>`}<td>${r.active!==false?'<span class="badge green">Đang bán</span>':'<span class="badge gray">Ngừng bán</span>'}</td><td>${rowActions([{act:'restaurant-recipe-view',data:`data-id="${esc(r.id)}"`,icon:'fa-eye',title:'Xem chi tiết'},{act:'restaurant-recipe-edit',data:`data-id="${esc(r.id)}"`,icon:'fa-pen',title:'Sửa'},{act:'restaurant-recipe-delete',data:`data-id="${esc(r.id)}"`,icon:'fa-trash',title:'Xóa'}])}</td></tr>`;
  }).join('');
}
function restaurantStoreStockRows(){
  const storeWarehouseIds=new Set((DB.stores||[]).map(s=>s.warehouseId));
  return (DB.inventory||[]).filter(x=>storeWarehouseIds.has(x.warehouseId)).map(x=>{
    const st=(DB.stores||[]).find(s=>s.warehouseId===x.warehouseId); const m=Q.material(x.productId)||Q.product(x.productId);
    return `<tr><td>${esc(st?.name||x.warehouseId)}</td><td><span class="code">${esc(x.productId)}</span></td><td>${esc(m?.name||x.productId)}</td><td class="right num">${fmtDec(x.qtyAvailable||0,3)} ${esc(m?.unit||'')}</td><td>${esc(x.lotId||'—')}</td><td>${rowActions([{act:'inventory-transaction-detail',data:`data-id="${esc((DB.inventoryTransactions||[]).find(t=>t.productId===x.productId&&t.warehouseId===x.warehouseId)?.id||'')}"`,icon:'fa-eye',title:'Xem chi tiết giao dịch gần nhất'}])}</td></tr>`;
  }).join('');
}
function openRestaurantPos(channel='POS') {
  restaurantHydrate();
  const isRemote=channel==='TABLET'||channel==='QR';
  Modal.open({
    title: channel==='POS'?'POS bán hàng tại quầy':channel==='TABLET'?'Tạo đơn Tablet':'Tạo đơn QR',
    sub: isRemote?'Đơn được ghi nhận ở trạng thái Chờ xử lý; chỉ trừ kho khi thanh toán.':'Chọn món và số lượng; hệ thống tự lấy công thức để tính nguyên liệu tiêu thụ.', size:'md',
    body: `<input type="hidden" id="posChannel" value="${esc(channel)}"><div class="form-grid"><div class="field"><label>Cửa hàng</label><select class="inp" id="posStore">${(DB.stores||[]).filter(s=>s.status!=='inactive').map(store=>`<option value="${store.id}">${esc(store.name)}</option>`).join('')}</select></div><div class="field"><label>Ca bán hàng</label><select class="inp" id="posShift"><option>Ca sáng</option><option>Ca trưa</option><option>Ca tối</option></select></div></div>${isRemote?`<div class="field"><label>Bàn / Mã nhận đơn</label><input class="inp" id="posTable" placeholder="Ví dụ: Bàn 05"></div>`:''}<div class="field"><label>Món bán</label><select class="inp" id="posRecipe">${(DB.restaurantRecipes||[]).filter(recipe=>recipe.active!==false).map(recipe=>`<option value="${recipe.id}">${esc(recipe.name)} · ${fmtVND(recipe.price)}/${esc(recipe.unit)}</option>`).join('')}</select></div><div class="form-grid"><div class="field"><label>Số lượng</label><input class="inp num" id="posQty" type="number" min="1" value="1" /></div><div class="field"><label>Thanh toán</label><select class="inp" id="posPayment" ${isRemote?'disabled':''}><option>Tiền mặt</option><option>Chuyển khoản</option><option>Ví điện tử</option></select></div></div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="restaurant-pos-save"><i class="fa-solid ${isRemote?'fa-paper-plane':'fa-check'}"></i>${isRemote?'Gửi đơn':'Thanh toán và ghi kho'}</button>`
  });
}
function openRestaurantRecipeForm(id=''){
  const r=restaurantRecipe(id)||{id:'',name:'',group:'Món chính',price:0,unit:'Phần',active:true,items:[]};
  const line=(it={})=>`<div class="restaurant-recipe-line" style="display:grid;grid-template-columns:1fr 130px 42px;gap:8px;margin-bottom:8px"><select class="inp" name="material">${(DB.materials||[]).map(m=>`<option value="${esc(m.id)}" ${m.id===it.materialId?'selected':''}>${esc(m.id)} — ${esc(m.name)} (${esc(m.unit||'')})</option>`).join('')}</select><input class="inp right num" name="qty" type="number" min="0.0001" step="0.0001" value="${Number(it.quantity||1)}"><button class="btn btn-sm" type="button" data-act="restaurant-recipe-remove-line"><i class="fa-solid fa-trash"></i></button></div>`;
  Modal.open({title:id?`Sửa món · ${id}`:'Thêm món / công thức',size:'lg',body:`<input type="hidden" id="restaurantRecipeId" value="${esc(id)}"><div class="form-grid cols-2"><div class="field"><label>Tên món *</label><input class="inp" id="restaurantRecipeName" value="${esc(r.name)}"></div><div class="field"><label>Nhóm</label><input class="inp" id="restaurantRecipeGroup" value="${esc(r.group||'')}"></div><div class="field"><label>Đơn vị</label><input class="inp" id="restaurantRecipeUnit" value="${esc(r.unit||'Phần')}"></div><div class="field"><label>Giá bán *</label><input class="inp right num" id="restaurantRecipePrice" type="number" min="0" value="${Number(r.price||0)}"></div></div><div class="form-sec-title"><i class="fa-solid fa-list"></i>Định lượng nguyên liệu</div><div id="restaurantRecipeLines">${(r.items||[]).length?r.items.map(line).join(''):line()}</div><button class="btn btn-sm" type="button" data-act="restaurant-recipe-add-line"><i class="fa-solid fa-plus"></i>Thêm nguyên liệu</button><div class="field" style="margin-top:12px"><label><input type="checkbox" id="restaurantRecipeActive" ${r.active!==false?'checked':''}> Đang kinh doanh</label></div>`,foot:`<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="restaurant-recipe-save"><i class="fa-solid fa-floppy-disk"></i>Lưu</button>`});
}
function openRestaurantStoreForm(id=''){
  const s=restaurantStore(id)||{name:'',code:'',warehouseId:'WH-005',address:'',status:'active'};
  Modal.open({title:id?`Sửa chi nhánh · ${id}`:'Thêm chi nhánh',size:'md',body:`<input type="hidden" id="restaurantStoreId" value="${esc(id)}"><div class="form-grid cols-2"><div class="field"><label>Mã chi nhánh</label><input class="inp" id="restaurantStoreCode" value="${esc(s.code||'')}"></div><div class="field"><label>Tên chi nhánh *</label><input class="inp" id="restaurantStoreName" value="${esc(s.name||'')}"></div><div class="field"><label>Kho liên kết *</label><select class="inp" id="restaurantStoreWarehouse">${(DB.warehouses||[]).filter(w=>w.type==='STORE'||w.id===s.warehouseId).map(w=>`<option value="${esc(w.id)}" ${w.id===s.warehouseId?'selected':''}>${esc(w.name)}</option>`).join('')}</select></div><div class="field"><label>Trạng thái</label><select class="inp" id="restaurantStoreStatus"><option value="active" ${s.status!=='inactive'?'selected':''}>Hoạt động</option><option value="inactive" ${s.status==='inactive'?'selected':''}>Ngưng hoạt động</option></select></div></div><div class="field"><label>Địa chỉ</label><input class="inp" id="restaurantStoreAddress" value="${esc(s.address||'')}"></div>`,foot:`<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="restaurant-store-save"><i class="fa-solid fa-floppy-disk"></i>Lưu</button>`});
}
function openRestaurantOrderDetail(id){
  const o=(DB.posOrders||[]).find(x=>x.id===id); if(!o)return; const store=restaurantStore(o.storeId);
  const rows=(o.items||[]).map(i=>{const r=restaurantRecipe(i.recipeId);return `<tr><td><span class="code">${esc(i.recipeId)}</span></td><td>${esc(r?.name||i.recipeId)}</td><td class="right num">${fmtN(i.quantity)}</td><td class="right num">${fmtVND(i.price)}</td><td class="right num">${fmtVND(Number(i.quantity||0)*Number(i.price||0))}</td></tr>`;}).join('');
  Modal.open({title:`Chi tiết đơn · ${esc(o.id)}`,size:'lg',body:`<div class="detail-grid"><div><span>Cửa hàng</span><b>${esc(store?.name||o.storeId)}</b></div><div><span>Ngày</span><b>${fmtDate(o.date)}</b></div><div><span>Kênh</span><b>${esc(restaurantChannelLabel(o.channel))}</b></div><div><span>Bàn / Mã</span><b>${esc(o.tableNo||'—')}</b></div><div><span>Ca</span><b>${esc(o.shift||'—')}</b></div><div><span>Trạng thái</span><b>${restaurantStatus(o.status)}</b></div></div><div class="form-sec-title" style="margin-top:14px">Món đã gọi</div>${tableShell([{t:'Mã'},{t:'Món'},{t:'SL',cls:'right'},{t:'Đơn giá',cls:'right'},{t:'Thành tiền',cls:'right'}],rows)}<div class="right strong" style="font-size:18px;margin-top:12px">Tổng: ${fmtVND(restaurantOrderTotal(o))}</div>`,foot:`<button class="btn" data-act="modal-close">Đóng</button>${o.status==='OPEN'?`<button class="btn btn-primary" data-act="restaurant-order-pay" data-id="${esc(o.id)}"><i class="fa-solid fa-credit-card"></i>Thanh toán</button>`:''}`});
}
function restaurantCanFulfill(order){
  const store=restaurantStore(order.storeId); if(!store)return {ok:false,message:'Không tìm thấy cửa hàng.'};
  const needs={};
  for(const item of order.items||[]){ const recipe=restaurantRecipe(item.recipeId); if(!recipe)continue; for(const b of recipe.items||[]) needs[b.materialId]=(needs[b.materialId]||0)+Number(b.quantity||0)*Number(item.quantity||0); }
  for(const [materialId,qty] of Object.entries(needs)){
    const stocks=(DB.inventory||[]).filter(r=>r.productId===materialId&&r.warehouseId===store.warehouseId&&Number(r.qtyAvailable||0)>0);
    const total=stocks.reduce((s,r)=>s+Number(r.qtyAvailable||0),0); if(total+1e-9<qty) return {ok:false,message:`${Q.material(materialId)?.name||materialId}: cần ${fmtDec(qty,3)}, tồn ${fmtDec(total,3)}.`};
  }
  return {ok:true,store,needs};
}
function restaurantPostOrder(order){
  if(order.status==='PAID') return {ok:true}; const check=restaurantCanFulfill(order); if(!check.ok)return check;
  for(const [materialId,need] of Object.entries(check.needs)){ let remaining=need; const stocks=(DB.inventory||[]).filter(r=>r.productId===materialId&&r.warehouseId===check.store.warehouseId&&Number(r.qtyAvailable||0)>0).sort((a,b)=>String(a.expiryDate||'9999').localeCompare(String(b.expiryDate||'9999'))); for(const stock of stocks){ if(remaining<=0)break; const qty=Math.min(remaining,Number(stock.qtyAvailable||0)); const posted=InventoryService.apply({productId:materialId,warehouseId:stock.warehouseId,locationId:stock.locationId,lotId:stock.lotId,quantity:qty,type:'SALES_ISSUE',refType:'POS',refId:order.id,note:`Trừ nguyên liệu đơn ${order.id}`,updateMaterial:false}); if(!posted.ok)return posted; remaining-=qty; }}
  order.status='PAID'; order.paidAt=new Date().toISOString(); return {ok:true};
}
Views.restaurant = function () {
  restaurantHydrate();
  const tab=State.tab||'dashboard'; const today=restaurantToday(); const orders=DB.posOrders||[]; const todayOrders=orders.filter(o=>o.date===today); const revenue=todayOrders.filter(o=>o.status==='PAID').reduce((s,o)=>s+restaurantOrderTotal(o),0);
  const head=pageHead('Nhà hàng & Cửa hàng','POS, đặt món, menu, công thức, chi nhánh, tồn nguyên liệu và doanh thu liên thông kho', tab==='pos'?`<button class="btn btn-primary" data-act="restaurant-pos-open"><i class="fa-solid fa-cash-register"></i>Bán tại quầy</button>`:tab==='tablet'?`<button class="btn btn-primary" data-act="restaurant-tablet-open"><i class="fa-solid fa-tablet-screen-button"></i>Tạo đơn Tablet</button>`:tab==='qr'?`<button class="btn btn-primary" data-act="restaurant-qr-open"><i class="fa-solid fa-qrcode"></i>Tạo đơn QR</button>`:(tab==='menu'||tab==='recipe')?`<button class="btn btn-primary" data-act="restaurant-recipe-new"><i class="fa-solid fa-plus"></i>Thêm món</button>`:tab==='branches'?`<button class="btn btn-primary" data-act="restaurant-store-new"><i class="fa-solid fa-plus"></i>Thêm chi nhánh</button>`:'');
  let body='';
  if(tab==='dashboard'){
    body=`<div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Doanh thu hôm nay',fmtVND(revenue),'fa-sack-dollar','green')}${mkpi('Hóa đơn hôm nay',todayOrders.length,'fa-receipt','blue')}${mkpi('Cửa hàng',(DB.stores||[]).filter(s=>s.status!=='inactive').length,'fa-store','teal')}${mkpi('Món đang bán',(DB.restaurantRecipes||[]).filter(r=>r.active!==false).length,'fa-utensils','orange')}</div><div class="card"><div class="card-head"><div><h3>Đơn gần nhất</h3><p>Tổng hợp mọi kênh POS / Tablet / QR.</p></div></div>${tableShell([{t:'Đơn'},{t:'Ngày'},{t:'Cửa hàng'},{t:'Kênh'},{t:'Bàn'},{t:'Ca'},{t:'Doanh thu',cls:'right'},{t:'Trạng thái'},{t:'Thao tác'}],restaurantOrderRows(orders.slice(0,10)),{emptyTitle:'Chưa có đơn hàng'})}</div>`;
  } else if(['pos','tablet','qr','orders'].includes(tab)){
    const channel=tab==='pos'?'POS':tab==='tablet'?'TABLET':tab==='qr'?'QR':null; const list=channel?orders.filter(o=>(o.channel||'POS')===channel):orders;
    body=`<div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Tổng đơn',list.length,'fa-receipt','blue')}${mkpi('Chờ xử lý',list.filter(o=>o.status==='OPEN').length,'fa-clock','orange')}${mkpi('Đã thanh toán',list.filter(o=>o.status==='PAID').length,'fa-circle-check','green')}${mkpi('Doanh thu',fmtVND(list.filter(o=>o.status==='PAID').reduce((s,o)=>s+restaurantOrderTotal(o),0)),'fa-money-bill-wave','teal')}</div><div class="card">${tableShell([{t:'Đơn'},{t:'Ngày'},{t:'Cửa hàng'},{t:'Kênh'},{t:'Bàn'},{t:'Ca'},{t:'Tổng tiền',cls:'right'},{t:'Trạng thái'},{t:'Thao tác'}],restaurantOrderRows(list),{emptyTitle:'Chưa có đơn hàng'})}</div>`;
  } else if(tab==='menu'||tab==='recipe'){
    body=`<div class="card">${tableShell(tab==='recipe'?[{t:'Mã món'},{t:'Tên món'},{t:'Giá bán',cls:'right'},{t:'Định lượng nguyên liệu'},{t:'Food Cost',cls:'right'},{t:'Trạng thái'},{t:'Thao tác'}]:[{t:'Mã món'},{t:'Tên món'},{t:'Giá bán',cls:'right'},{t:'Đơn vị'},{t:'Trạng thái'},{t:'Thao tác'}],restaurantRecipeRows(tab),{emptyTitle:'Chưa có món'})}</div>`;
  } else if(tab==='branches'){
    const rows=(DB.stores||[]).map(s=>`<tr><td><span class="code">${esc(s.id)}</span></td><td>${cell2(esc(s.name),esc(s.address||''))}</td><td>${esc((DB.warehouses||[]).find(w=>w.id===s.warehouseId)?.name||s.warehouseId)}</td><td>${s.status!=='inactive'?'<span class="badge green">Hoạt động</span>':'<span class="badge gray">Ngưng</span>'}</td><td>${rowActions([{act:'restaurant-store-view',data:`data-id="${esc(s.id)}"`,icon:'fa-eye',title:'Xem chi tiết'},{act:'restaurant-store-edit',data:`data-id="${esc(s.id)}"`,icon:'fa-pen',title:'Sửa'},{act:'restaurant-store-delete',data:`data-id="${esc(s.id)}"`,icon:'fa-trash',title:'Xóa'}])}</td></tr>`).join('');
    body=`<div class="card">${tableShell([{t:'Mã'},{t:'Chi nhánh'},{t:'Kho liên kết'},{t:'Trạng thái'},{t:'Thao tác'}],rows,{emptyTitle:'Chưa có chi nhánh'})}</div>`;
  } else if(tab==='issue'){
    const storeWh=new Set((DB.stores||[]).map(s=>s.warehouseId)); const tx=(DB.inventoryTransactions||[]).filter(t=>storeWh.has(t.warehouseId)&&Number(t.qty||0)<0);
    const rows=tx.map(t=>`<tr><td><span class="code">${esc(t.transactionNumber||t.id)}</span></td><td>${fmtDate(t.date)}</td><td>${esc(restaurantStore((DB.stores||[]).find(s=>s.warehouseId===t.warehouseId)?.id)?.name||t.warehouseId)}</td><td>${esc(Q.material(t.productId)?.name||t.productId)}</td><td class="right num">${fmtDec(Math.abs(Number(t.qty||0)),3)} ${esc(Q.material(t.productId)?.unit||'')}</td><td>${esc(t.refId||'—')}</td><td>${rowActions([{act:'inventory-transaction-detail',data:`data-id="${esc(t.id)}"`,icon:'fa-eye',title:'Xem chi tiết'}])}</td></tr>`).join('');
    body=`<div class="card"><div class="card-head"><div><h3>Xuất nguyên liệu tại cửa hàng</h3><p>Các giao dịch trừ kho phát sinh từ bán hàng POS/Tablet/QR.</p></div></div>${tableShell([{t:'Chứng từ'},{t:'Ngày'},{t:'Cửa hàng'},{t:'Nguyên liệu'},{t:'SL xuất',cls:'right'},{t:'Tham chiếu'},{t:'Thao tác'}],rows,{emptyTitle:'Chưa có giao dịch xuất'})}</div>`;
  } else if(tab==='revenue'){
    const byStore=(DB.stores||[]).map(s=>{const os=orders.filter(o=>o.storeId===s.id&&o.status==='PAID');return {s,count:os.length,amount:os.reduce((n,o)=>n+restaurantOrderTotal(o),0)};});
    const rows=byStore.map(x=>`<tr><td>${esc(x.s.name)}</td><td class="right num">${x.count}</td><td class="right num">${fmtVND(x.amount)}</td><td class="right num">${fmtVND(x.count?x.amount/x.count:0)}</td><td>${rowActions([{act:'restaurant-store-view',data:`data-id="${esc(x.s.id)}"`,icon:'fa-eye',title:'Xem chi tiết chi nhánh'}])}</td></tr>`).join('');
    body=`<div class="card">${tableShell([{t:'Cửa hàng'},{t:'Số đơn',cls:'right'},{t:'Doanh thu',cls:'right'},{t:'TB/đơn',cls:'right'},{t:'Thao tác'}],rows,{emptyTitle:'Chưa có doanh thu'})}</div>`;
  } else if(tab==='reports'){
    const sales={}; for(const o of orders.filter(o=>o.status==='PAID')) for(const i of o.items||[]){ const k=i.recipeId; sales[k]=sales[k]||{qty:0,amount:0};sales[k].qty+=Number(i.quantity||0);sales[k].amount+=Number(i.quantity||0)*Number(i.price||0); }
    const rows=Object.entries(sales).sort((a,b)=>b[1].amount-a[1].amount).map(([id,x])=>`<tr><td><span class="code">${esc(id)}</span></td><td>${esc(restaurantRecipe(id)?.name||id)}</td><td class="right num">${fmtN(x.qty)}</td><td class="right num">${fmtVND(x.amount)}</td><td>${rowActions([{act:'restaurant-recipe-view',data:`data-id="${esc(id)}"`,icon:'fa-eye',title:'Xem chi tiết món'}])}</td></tr>`).join('');
    body=`<div class="grid g-auto-sm" style="margin-bottom:14px">${mkpi('Tổng doanh thu',fmtVND(orders.filter(o=>o.status==='PAID').reduce((s,o)=>s+restaurantOrderTotal(o),0)),'fa-chart-line','green')}${mkpi('Tổng hóa đơn',orders.filter(o=>o.status==='PAID').length,'fa-receipt','blue')}${mkpi('Món có doanh số',Object.keys(sales).length,'fa-utensils','orange')}</div><div class="card">${tableShell([{t:'Mã món'},{t:'Món'},{t:'SL bán',cls:'right'},{t:'Doanh thu',cls:'right'},{t:'Thao tác'}],rows,{emptyTitle:'Chưa có dữ liệu báo cáo'})}</div>`;
  } else body='<div class="empty-state">Chưa có dữ liệu.</div>';
  return `${head}${restaurantTabs(tab)}${body}`;
};

Views.suppliers = function () {
  const f = F('suppliers', { q: '', group: '' });
  const q = (f.q || '').toLowerCase().trim();
  const groups = [...new Set((DB.itemCategories || []).filter((category) =>category.type === 'RAW_MATERIAL' &&category.status !== 'inactive').map((category) => category.name).filter(Boolean)
  )
]
  .sort((a, b) => String(a).localeCompare(String(b), 'vi'))
  .map((group) => [group, group]);
  const list = DB.suppliers.filter((supplier) => {
    if (f.group && supplier.group !== f.group) return false;
    return !q || [supplier.id, supplier.name, supplier.contact, supplier.group, supplier.address].some((value) => String(value || '').toLowerCase().includes(q));
  });
  const rows = list.map((supplier) => `<tr>
    <td><span class="code">${esc(supplier.id)}</span></td>
    <td>${cell2(esc(supplier.name), esc(supplier.address || ''))}</td>
    <td>${esc(supplier.group)}</td>
    <td>${esc(supplier.contact)}<div class="cell-sub">${esc(supplier.phone)}</div></td>
    <td class="center strong" style="${supplier.ratingStatus === 'UNRATED' || !Number(supplier.rating) ? 'color:var(--text-3)' : Number(supplier.rating) < 4 ? 'color:var(--red)' : ''}">${Number(supplier.rating || 0) ? Number(supplier.rating).toFixed(1) + ' / 5' : 'Chưa đánh giá'}</td>
    <td>${esc(supplier.paymentTerm || 'Theo hợp đồng')}</td>
    <td>${rowActions([{ act: 'supplier-detail', data: `data-id="${supplier.id}"`, icon: 'fa-eye', title: 'Xem chi tiết nhà cung cấp' }, { act: 'supplier-edit', data: `data-id="${supplier.id}"`, icon: 'fa-pen', title: 'Sửa nhà cung cấp' }, { act: 'supplier-delete', data: `data-id="${supplier.id}"`, icon: 'fa-trash', title: 'Xóa nhà cung cấp' }])}</td>
  </tr>`);

  // [DASHBOARD CONSISTENCY]
  // Chỉ tính trung bình trên các nhà cung cấp đã có đánh giá > 0.
  // NCC chưa được đánh giá sẽ không bị tính là 0 điểm.
  const ratedSuppliers = (DB.suppliers || []).filter((supplier) => {
    const rating = Number(supplier.rating);
    return Number.isFinite(rating) && rating > 0;
  });

  const ratedSupplierCount = ratedSuppliers.length;
  const totalSuppliers = (DB.suppliers || []).length;

  const avgRating = ratedSupplierCount > 0
    ? ratedSuppliers.reduce(
        (sum, supplier) => sum + Number(supplier.rating),
        0
      ) / ratedSupplierCount
    : 0;
  return `${pageHead('Nhà cung cấp', 'Đối tác nguyên liệu đậu nành, phụ gia, bao bì, nước sạch, vận chuyển và dịch vụ của Lê Nam', '<button class="btn btn-primary" data-act="enterprise-action" data-key="suppliers"><i class="fa-solid fa-plus"></i>Thêm nhà cung cấp</button>')}
  <div class="grid g-auto-sm" style="margin-bottom:14px">
    ${mkpi(
      'Tổng nhà cung cấp',
      totalSuppliers,
      'fa-handshake',
      'blue'
    )}

    ${mkpi(
      'Nhóm cung ứng',
      groups.length,
      'fa-layer-group',
      'teal'
    )}

    ${mkpi(
      'Đánh giá trung bình',
      ratedSupplierCount > 0
        ? `${avgRating.toFixed(1)} / 5`
        : 'Chưa có đánh giá',
      'fa-star',
      'orange',
      null,
      ratedSupplierCount > 0
        ? `Dựa trên ${ratedSupplierCount}/${totalSuppliers} NCC đã đánh giá`
        : `${totalSuppliers} NCC chưa có dữ liệu đánh giá`
    )}
  </div>  
  <div class="card"><div class="toolbar">${searchBox('suppliers', 'Tìm mã, tên, người liên hệ, nhóm hàng…')}${selectFilter('suppliers', 'group', groups, 'Tất cả nhóm cung ứng')}${(f.q || f.group) ? '<button class="btn btn-sm" data-act="clear-filter" data-key="suppliers"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>' : ''}<span class="spacer"></span><span class="chip"><i class="fa-solid fa-list"></i> ${list.length} nhà cung cấp</span></div>${tableShell([{ t: 'Mã NCC' }, { t: 'Tên nhà cung cấp' }, { t: 'Nhóm cung ứng' }, { t: 'Liên hệ' }, { t: 'Đánh giá', cls: 'center' }, { t: 'Thanh toán' }, { t: '', cls: 'right' }], rows, { emptyTitle: 'Không tìm thấy nhà cung cấp' })}</div>`;
};

// Views['subcontracting-overview'] = function () {
//   const rows = DB.subcontractingOrders.map(order => {
//     const progress = order.plannedQty
//       ? Math.round((order.receivedQty / order.plannedQty) * 100)
//       : 0;

//     const amount = order.plannedQty * order.unitCost;

//     return `<tr>
//       <td><span class="code">${order.id}</span></td>
//       <td class="strong">${esc(order.partner)}</td>
//       <td>${esc(Q.product(order.productId)?.name || order.productId)}</td>
//       <td class="right num">${fmtDec(order.plannedQty, 2)}</td>
//       <td class="right num">${fmtDec(order.issuedQty, 2)}</td>
//       <td class="right num">
//         ${fmtDec(order.receivedQty, 2)} (${progress}%)
//       </td>
//       <td class="right num">${fmtVND(amount)}</td>
//       <td>${badge(order.status)}</td>
//       <td>
//         ${rowActions([{
//           act: 'subcontracting-issue',
//           data: `data-id="${order.id}"`,
//           icon: 'fa-arrow-right-from-bracket',
//           title: 'Xuất nguyên liệu gia công'
//         }])}
//       </td>
//     </tr>`;
//   });

//   return `${pageHead(
//     'Gia công',
//     'Quản lý kế hoạch, nguyên liệu giao đối tác, tiến độ nhận hàng, hao hụt, chất lượng và công nợ',
//     `
//       <button class="btn btn-primary" data-act="subcontracting-new">
//         <i class="fa-solid fa-plus"></i>
//         Tạo kế hoạch gia công
//       </button>
//     `
//   )}

//   <div class="grid g-auto-sm" style="margin-bottom:14px">
//     ${mkpi(
//       'Đơn gia công',
//       DB.subcontractingOrders.length,
//       'fa-industry',
//       'blue'
//     )}

//     ${mkpi(
//       'Sản lượng đã giao',
//       fmtDec(
//         DB.subcontractingOrders.reduce(
//           (sum, order) => sum + order.issuedQty,
//           0
//         ),
//         2
//       ),
//       'fa-truck-ramp-box',
//       'orange'
//     )}

//     ${mkpi(
//       'Sản lượng đã nhận',
//       fmtDec(
//         DB.subcontractingOrders.reduce(
//           (sum, order) => sum + order.receivedQty,
//           0
//         ),
//         2
//       ),
//       'fa-box-open',
//       'green'
//     )}

//     ${mkpi(
//       'Công nợ còn lại',
//       fmtVND(
//         DB.subcontractingOrders.reduce(
//           (sum, order) =>
//             sum + (order.plannedQty * order.unitCost - order.paid),
//           0
//         )
//       ),
//       'fa-file-invoice-dollar',
//       'red'
//     )}
//   </div>

//   <div class="card">
//     ${tableShell(
//       [
//         { t: 'Mã đơn' },
//         { t: 'Đối tác' },
//         { t: 'Sản phẩm' },
//         { t: 'Kế hoạch', cls: 'right' },
//         { t: 'Đã giao', cls: 'right' },
//         { t: 'Đã nhận', cls: 'right' },
//         { t: 'Giá trị', cls: 'right' },
//         { t: 'Trạng thái' },
//         { t: '', cls: 'right' }
//       ],
//       rows,
//       {
//         emptyTitle: 'Chưa có kế hoạch gia công'
//       }
//     )}
//   </div>`;
// };

Views['subcontracting-overview'] = function () {

  const orders = DB.subcontractingOrders;

  const totalPlanned = orders.reduce(
    (sum, order) => sum + (Number(order.plannedQty) || 0),
    0
  );

  const totalIssued = orders.reduce(
    (sum, order) => sum + (Number(order.issuedQty) || 0),
    0
  );

  const totalReceived = orders.reduce(
    (sum, order) => sum + (Number(order.receivedQty) || 0),
    0
  );

  const totalDebt = orders.reduce(
    (sum, order) =>
      sum +
      ((Number(order.plannedQty) || 0) *
        (Number(order.unitCost) || 0)) -
      (Number(order.paid) || 0),
    0
  );

  const inProgress = orders.filter(
    order => order.status === 'IN_PROGRESS'
  ).length;

  const completed = orders.filter(
    order => order.status === 'COMPLETED'
  ).length;

  const overdue = orders.filter(order => {
    if (!order.dueDate || order.status === 'COMPLETED') {
      return false;
    }

    return order.dueDate < DB.today;
  }).length;

  return `${pageHead(
    'Gia công',
    'Tổng quan hoạt động gia công, tiến độ, sản lượng, chất lượng và công nợ',
    `
      <button class="btn btn-primary" data-act="subcontracting-new">
        <i class="fa-solid fa-plus"></i>
        Tạo kế hoạch gia công
      </button>
    `
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Đơn gia công',
      orders.length,
      'fa-industry',
      'blue'
    )}

    ${mkpi(
      'Sản lượng kế hoạch',
      fmtDec(totalPlanned, 2),
      'fa-clipboard-list',
      'teal'
    )}

    ${mkpi(
      'Đang thực hiện',
      inProgress,
      'fa-spinner',
      'orange'
    )}

    ${mkpi(
      'Đã hoàn thành',
      completed,
      'fa-circle-check',
      'green'
    )}

    ${mkpi(
      'Công nợ còn lại',
      fmtVND(totalDebt),
      'fa-file-invoice-dollar',
      'red'
    )}

  </div>

  <div class="grid g-auto-sm">

    <div class="card">
      <div class="card-head">
        <div>
          <h3>Tình hình sản lượng</h3>
          <p>Tổng hợp sản lượng gia công hiện tại</p>
        </div>
      </div>

      <div class="grid g-auto-sm">

        ${mkpi(
          'Đã giao nguyên liệu',
          fmtDec(totalIssued, 2),
          'fa-truck-ramp-box',
          'orange'
        )}

        ${mkpi(
          'Đã nhận về',
          fmtDec(totalReceived, 2),
          'fa-box-open',
          'green'
        )}

      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <h3>Cảnh báo</h3>
          <p>Các đơn cần được theo dõi</p>
        </div>
      </div>

      <div class="grid g-auto-sm">

        ${mkpi(
          'Đơn đang thực hiện',
          inProgress,
          'fa-clock',
          'orange'
        )}

        ${mkpi(
          'Đơn quá hạn',
          overdue,
          'fa-triangle-exclamation',
          'red'
        )}

      </div>
    </div>

  </div>`;
};

Views.subcontracting = function () {
  const tab = State.tab || 'dashboard';

  switch (tab) {
    case 'dashboard':
      return Views['subcontracting-overview']
        ? Views['subcontracting-overview']()
        : '';

    case 'orders':
      return Views['subcontracting-orders']
        ? Views['subcontracting-orders']()
        : '';

    case 'issue':
      return Views['subcontracting-issue']
        ? Views['subcontracting-issue']()
        : '';

    case 'progress':
      return Views['subcontracting-progress']
        ? Views['subcontracting-progress']()
        : '';

    case 'receive':
      return Views['subcontracting-receive']
        ? Views['subcontracting-receive']()
        : '';

    case 'debt':
      return Views['subcontracting-debt']
        ? Views['subcontracting-debt']()
        : '';

    case 'partners':
      return Views['subcontracting-partners']
        ? Views['subcontracting-partners']()
        : '';

    default:
      return '';
  }
};

Views['subcontracting-orders'] = function () {

  const rows = DB.subcontractingOrders.map(order => {

    const progress = order.plannedQty
      ? Math.round(
          (order.receivedQty / order.plannedQty) * 100
        )
      : 0;

    const amount =
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0);

    return `<tr>

      <td>
        <span class="code">${esc(order.id)}</span>
      </td>

      <td class="strong">
        ${esc(order.partner)}
      </td>

      <td>
        ${esc(
          Q.product(order.productId)?.name ||
          order.productId
        )}
      </td>

      <td class="right num">
        ${fmtDec(order.plannedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(order.issuedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(order.receivedQty, 2)}
      </td>

      <td class="right num">
        ${progress}%
      </td>

      <td class="right num">
        ${fmtVND(amount)}
      </td>

      <td>
        ${badge(order.status)}
      </td>

      <td>
        ${rowActions([
          {
            act: 'subcontracting-issue',
            data: `data-id="${order.id}"`,
            icon: 'fa-arrow-right-from-bracket',
            title: 'Xuất nguyên liệu'
          }
        ])}
      </td>

    </tr>`;
  });

  return `${pageHead(
    'Đơn gia công',
    'Quản lý danh sách đơn gia công, số lượng, tiến độ và trạng thái thực hiện',
    `
      <button class="btn btn-primary"
        data-act="subcontracting-new">
        <i class="fa-solid fa-plus"></i>
        Tạo đơn gia công
      </button>
    `
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Tổng đơn',
      DB.subcontractingOrders.length,
      'fa-industry',
      'blue'
    )}

    ${mkpi(
      'Đang thực hiện',
      DB.subcontractingOrders.filter(
        order => order.status === 'IN_PROGRESS'
      ).length,
      'fa-spinner',
      'orange'
    )}

    ${mkpi(
      'Hoàn thành',
      DB.subcontractingOrders.filter(
        order => order.status === 'COMPLETED'
      ).length,
      'fa-circle-check',
      'green'
    )}

    ${mkpi(
      'Bản nháp',
      DB.subcontractingOrders.filter(
        order => order.status === 'DRAFT'
      ).length,
      'fa-file',
      'teal'
    )}

  </div>

  <div class="card">

    ${tableShell(
      [
        { t: 'Mã đơn' },
        { t: 'Đối tác' },
        { t: 'Sản phẩm' },
        { t: 'Kế hoạch', cls: 'right' },
        { t: 'Đã giao', cls: 'right' },
        { t: 'Đã nhận', cls: 'right' },
        { t: 'Tiến độ', cls: 'right' },
        { t: 'Giá trị', cls: 'right' },
        { t: 'Trạng thái' },
        { t: '', cls: 'right' }
      ],
      rows,
      {
        emptyTitle: 'Chưa có đơn gia công'
      }
    )}

  </div>`;
};

Views['subcontracting-issue'] = function () {

  const orders = DB.subcontractingOrders.filter(
    order => order.issuedQty < order.plannedQty
  );

  const rows = orders.map(order => {

    const remaining =
      Math.max(
        (Number(order.plannedQty) || 0) -
        (Number(order.issuedQty) || 0),
        0
      );

    const productName =
      Q.product(order.productId)?.name ||
      order.productId;

    return `<tr>

      <td>
        <span class="code">${esc(order.id)}</span>
      </td>

      <td class="strong">
        ${esc(order.partner)}
      </td>

      <td>
        ${esc(productName)}
      </td>

      <td class="right num">
        ${fmtDec(order.plannedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(order.issuedQty, 2)}
      </td>

      <td class="right num strong">
        ${fmtDec(remaining, 2)}
      </td>

      <td>
        ${badge(order.status)}
      </td>

      <td>
        ${rowActions([
          {
            act: 'subcontracting-issue',
            data: `data-id="${order.id}"`,
            icon: 'fa-arrow-right-from-bracket',
            title: 'Xuất nguyên liệu'
          }
        ])}
      </td>

    </tr>`;
  });

  const totalPlanned = DB.subcontractingOrders.reduce(
    (sum, order) =>
      sum + (Number(order.plannedQty) || 0),
    0
  );

  const totalIssued = DB.subcontractingOrders.reduce(
    (sum, order) =>
      sum + (Number(order.issuedQty) || 0),
    0
  );

  const totalRemaining = Math.max(
    totalPlanned - totalIssued,
    0
  );

  return `${pageHead(
    'Xuất nguyên liệu',
    'Quản lý nguyên liệu cần giao cho đối tác gia công theo từng đơn',
    ''
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Đơn cần xuất',
      orders.length,
      'fa-truck-ramp-box',
      'orange'
    )}

    ${mkpi(
      'Sản lượng kế hoạch',
      fmtDec(totalPlanned, 2),
      'fa-clipboard-list',
      'blue'
    )}

    ${mkpi(
      'Đã xuất',
      fmtDec(totalIssued, 2),
      'fa-boxes-stacked',
      'green'
    )}

    ${mkpi(
      'Còn cần xuất',
      fmtDec(totalRemaining, 2),
      'fa-arrow-right-from-bracket',
      'red'
    )}

  </div>

  <div class="card">

    <div class="card-head">
      <div>
        <h3>Danh sách xuất nguyên liệu</h3>
        <p>Các đơn chưa hoàn tất việc giao nguyên liệu cho đối tác</p>
      </div>
    </div>

    ${tableShell(
      [
        { t: 'Mã đơn' },
        { t: 'Đối tác' },
        { t: 'Sản phẩm' },
        { t: 'Kế hoạch', cls: 'right' },
        { t: 'Đã xuất', cls: 'right' },
        { t: 'Còn cần xuất', cls: 'right' },
        { t: 'Trạng thái' },
        { t: '', cls: 'right' }
      ],
      rows,
      {
        emptyTitle: 'Không có đơn cần xuất nguyên liệu'
      }
    )}

  </div>`;
};

Views['subcontracting-progress'] = function () {

  const orders = DB.subcontractingOrders;

  const rows = orders.map(order => {

    const planned =
      Number(order.plannedQty) || 0;

    const received =
      Number(order.receivedQty) || 0;

    const progress = planned
      ? Math.min(
          Math.round((received / planned) * 100),
          100
        )
      : 0;

    const isOverdue =
      order.dueDate &&
      order.dueDate < DB.today &&
      order.status !== 'COMPLETED';

    let progressStatus = '';

    if (order.status === 'COMPLETED') {
      progressStatus = badge('COMPLETED');
    } else if (isOverdue) {
      progressStatus = badge('OVERDUE');
    } else if (progress > 0) {
      progressStatus = badge('IN_PROGRESS');
    } else {
      progressStatus = badge('DRAFT');
    }

    return `<tr>

      <td>
        <span class="code">${esc(order.id)}</span>
      </td>

      <td class="strong">
        ${esc(order.partner)}
      </td>

      <td>
        ${esc(
          Q.product(order.productId)?.name ||
          order.productId
        )}
      </td>

      <td class="right num">
        ${fmtDec(planned, 2)}
      </td>

      <td class="right num">
        ${fmtDec(order.issuedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(received, 2)}
      </td>

      <td class="right num strong">
        ${progress}%
      </td>

      <td>
        ${esc(order.dueDate || '-')}
      </td>

      <td>
        ${progressStatus}
      </td>

    </tr>`;
  });

  const completed = orders.filter(
    order => order.status === 'COMPLETED'
  ).length;

  const inProgress = orders.filter(
    order => order.status === 'IN_PROGRESS'
  ).length;

  const overdue = orders.filter(order =>
    order.dueDate &&
    order.dueDate < DB.today &&
    order.status !== 'COMPLETED'
  ).length;

  const avgProgress = orders.length
    ? Math.round(
        orders.reduce((sum, order) => {
          const planned =
            Number(order.plannedQty) || 0;

          const received =
            Number(order.receivedQty) || 0;

          return sum + (
            planned
              ? Math.min((received / planned) * 100, 100)
              : 0
          );
        }, 0) / orders.length
      )
    : 0;

  return `${pageHead(
    'Theo dõi tiến độ',
    'Theo dõi tình trạng thực hiện và tiến độ nhận hàng của các đơn gia công',
    ''
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Tiến độ trung bình',
      `${avgProgress}%`,
      'fa-chart-line',
      'blue'
    )}

    ${mkpi(
      'Đang thực hiện',
      inProgress,
      'fa-spinner',
      'orange'
    )}

    ${mkpi(
      'Đã hoàn thành',
      completed,
      'fa-circle-check',
      'green'
    )}

    ${mkpi(
      'Quá hạn',
      overdue,
      'fa-triangle-exclamation',
      'red'
    )}

  </div>

  <div class="card">

    <div class="card-head">
      <div>
        <h3>Tiến độ đơn gia công</h3>
        <p>Theo dõi sản lượng đã giao và sản lượng đã nhận</p>
      </div>
    </div>

    ${tableShell(
      [
        { t: 'Mã đơn' },
        { t: 'Đối tác' },
        { t: 'Sản phẩm' },
        { t: 'Kế hoạch', cls: 'right' },
        { t: 'Đã giao', cls: 'right' },
        { t: 'Đã nhận', cls: 'right' },
        { t: 'Tiến độ', cls: 'right' },
        { t: 'Hạn hoàn thành' },
        { t: 'Tình trạng' }
      ],
      rows,
      {
        emptyTitle: 'Chưa có đơn gia công'
      }
    )}

  </div>`;
};

Views['subcontracting-receive'] = function () {

  const orders = DB.subcontractingOrders;

  const rows = orders.map(order => {

    const received =
      Number(order.receivedQty) || 0;

    const good =
      Number(order.goodQty) || 0;

    const defect =
      Number(order.defectQty) || 0;

    const defectRate =
      received > 0
        ? ((defect / received) * 100).toFixed(1)
        : '0.0';

    let qualityStatus = 'Chưa nhận';

    if (received > 0 && defect === 0) {
      qualityStatus = 'Đạt';
    } else if (defect > 0) {
      qualityStatus = 'Có lỗi';
    }

    return `<tr>

      <td>
        <span class="code">${esc(order.id)}</span>
      </td>

      <td class="strong">
        ${esc(order.partner)}
      </td>

      <td>
        ${esc(
          Q.product(order.productId)?.name ||
          order.productId
        )}
      </td>

      <td class="right num">
        ${fmtDec(order.plannedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(received, 2)}
      </td>

      <td class="right num">
        ${fmtDec(good, 2)}
      </td>

      <td class="right num">
        ${fmtDec(defect, 2)}
      </td>

      <td class="right num">
        ${defectRate}%
      </td>

      <td>
        ${esc(qualityStatus)}
      </td>

      <td>
        ${rowActions([
          {
            act: 'subcontracting-receive',
            data: `data-id="${order.id}"`,
            icon: 'fa-box-open',
            title: 'Ghi nhận nhận hàng'
          }
        ])}
      </td>

    </tr>`;
  });

  const totalReceived = orders.reduce(
    (sum, order) =>
      sum + (Number(order.receivedQty) || 0),
    0
  );

  const totalGood = orders.reduce(
    (sum, order) =>
      sum + (Number(order.goodQty) || 0),
    0
  );

  const totalDefect = orders.reduce(
    (sum, order) =>
      sum + (Number(order.defectQty) || 0),
    0
  );

  const defectRate =
    totalReceived > 0
      ? ((totalDefect / totalReceived) * 100).toFixed(1)
      : '0.0';

  return `${pageHead(
    'Nhận hàng & chất lượng',
    'Ghi nhận sản lượng nhận về và theo dõi chất lượng sản phẩm gia công',
    ''
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Đã nhận',
      fmtDec(totalReceived, 2),
      'fa-box-open',
      'blue'
    )}

    ${mkpi(
      'Số lượng đạt',
      fmtDec(totalGood, 2),
      'fa-circle-check',
      'green'
    )}

    ${mkpi(
      'Số lượng lỗi',
      fmtDec(totalDefect, 2),
      'fa-circle-xmark',
      'red'
    )}

    ${mkpi(
      'Tỷ lệ lỗi',
      `${defectRate}%`,
      'fa-triangle-exclamation',
      'orange'
    )}

  </div>

  <div class="card">

    <div class="card-head">
      <div>
        <h3>Nhận hàng & kiểm soát chất lượng</h3>
        <p>Theo dõi số lượng nhận, số lượng đạt và số lượng lỗi</p>
      </div>
    </div>

    ${tableShell(
      [
        { t: 'Mã đơn' },
        { t: 'Đối tác' },
        { t: 'Sản phẩm' },
        { t: 'Kế hoạch', cls: 'right' },
        { t: 'Đã nhận', cls: 'right' },
        { t: 'Đạt', cls: 'right' },
        { t: 'Lỗi', cls: 'right' },
        { t: 'Tỷ lệ lỗi', cls: 'right' },
        { t: 'Chất lượng' },
        { t: '', cls: 'right' }
      ],
      rows,
      {
        emptyTitle: 'Chưa có dữ liệu nhận hàng'
      }
    )}

  </div>`;
};

Views['subcontracting-debt'] = function () {

  const orders = DB.subcontractingOrders;

  const rows = orders.map(order => {

    const amount =
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0);

    const paid =
      Number(order.paid) || 0;

    const debt =
      Math.max(amount - paid, 0);

    let debtStatus = 'Chưa thanh toán';

    if (debt <= 0) {
      debtStatus = 'Đã thanh toán';
    } else if (paid > 0) {
      debtStatus = 'Thanh toán một phần';
    }

    return `<tr>

      <td>
        <span class="code">${esc(order.id)}</span>
      </td>

      <td class="strong">
        ${esc(order.partner)}
      </td>

      <td>
        ${esc(
          Q.product(order.productId)?.name ||
          order.productId
        )}
      </td>

      <td class="right num">
        ${fmtDec(order.plannedQty, 2)}
      </td>

      <td class="right num">
        ${fmtVND(order.unitCost)}
      </td>

      <td class="right num">
        ${fmtVND(amount)}
      </td>

      <td class="right num">
        ${fmtVND(paid)}
      </td>

      <td class="right num strong">
        ${fmtVND(debt)}
      </td>

      <td>
        ${esc(debtStatus)}
      </td>

    </tr>`;
  });

  const totalAmount = orders.reduce(
    (sum, order) =>
      sum +
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0),
    0
  );

  const totalPaid = orders.reduce(
    (sum, order) =>
      sum + (Number(order.paid) || 0),
    0
  );

  const totalDebt =
    Math.max(totalAmount - totalPaid, 0);

  const paidOrders = orders.filter(order => {

    const amount =
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0);

    return amount > 0 &&
      (Number(order.paid) || 0) >= amount;

  }).length;

  const unpaidOrders = orders.filter(order => {

    const amount =
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0);

    return amount >
      (Number(order.paid) || 0);

  }).length;

  return `${pageHead(
    'Công nợ',
    'Theo dõi giá trị gia công, số tiền đã thanh toán và công nợ còn lại',
    ''
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Tổng giá trị',
      fmtVND(totalAmount),
      'fa-file-invoice',
      'blue'
    )}

    ${mkpi(
      'Đã thanh toán',
      fmtVND(totalPaid),
      'fa-money-bill-transfer',
      'green'
    )}

    ${mkpi(
      'Còn phải trả',
      fmtVND(totalDebt),
      'fa-file-invoice-dollar',
      'red'
    )}

    ${mkpi(
      'Đơn chưa thanh toán',
      unpaidOrders,
      'fa-clock',
      'orange'
    )}

  </div>

  <div class="card">

    <div class="card-head">
      <div>
        <h3>Công nợ gia công</h3>
        <p>Theo dõi thanh toán theo từng đơn gia công</p>
      </div>
    </div>

    ${tableShell(
      [
        { t: 'Mã đơn' },
        { t: 'Đối tác' },
        { t: 'Sản phẩm' },
        { t: 'SL', cls: 'right' },
        { t: 'Đơn giá', cls: 'right' },
        { t: 'Giá trị', cls: 'right' },
        { t: 'Đã trả', cls: 'right' },
        { t: 'Còn nợ', cls: 'right' },
        { t: 'Trạng thái' }
      ],
      rows,
      {
        emptyTitle: 'Chưa có dữ liệu công nợ'
      }
    )}

  </div>`;
};

Views['subcontracting-partners'] = function () {

  const partnerMap = {};

  DB.subcontractingOrders.forEach(order => {

    const partner = order.partner;

    if (!partnerMap[partner]) {
      partnerMap[partner] = {
        partner,
        orders: 0,
        plannedQty: 0,
        issuedQty: 0,
        receivedQty: 0,
        goodQty: 0,
        defectQty: 0,
        amount: 0,
        paid: 0
      };
    }

    const item = partnerMap[partner];

    item.orders += 1;

    item.plannedQty +=
      Number(order.plannedQty) || 0;

    item.issuedQty +=
      Number(order.issuedQty) || 0;

    item.receivedQty +=
      Number(order.receivedQty) || 0;

    item.goodQty +=
      Number(order.goodQty) || 0;

    item.defectQty +=
      Number(order.defectQty) || 0;

    item.amount +=
      (Number(order.plannedQty) || 0) *
      (Number(order.unitCost) || 0);

    item.paid +=
      Number(order.paid) || 0;
  });

  const partners = Object.values(partnerMap);

  const rows = partners.map(item => {

    const debt =
      Math.max(
        item.amount - item.paid,
        0
      );

    const defectRate =
      item.receivedQty > 0
        ? (
            item.defectQty /
            item.receivedQty *
            100
          ).toFixed(1)
        : '0.0';

    return `<tr>

      <td class="strong">
        ${esc(item.partner)}
      </td>

      <td class="right num">
        ${item.orders}
      </td>

      <td class="right num">
        ${fmtDec(item.plannedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(item.issuedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(item.receivedQty, 2)}
      </td>

      <td class="right num">
        ${fmtDec(item.goodQty, 2)}
      </td>

      <td class="right num">
        ${defectRate}%
      </td>

      <td class="right num">
        ${fmtVND(item.amount)}
      </td>

      <td class="right num">
        ${fmtVND(debt)}
      </td>

      <td>
        ${rowActions([
          {
            act: 'subcontracting-partner-detail',
            data: `data-partner="${esc(item.partner)}"`,
            icon: 'fa-eye',
            title: 'Xem chi tiết'
          }
        ])}
      </td>

    </tr>`;
  });

  const totalPartners = partners.length;

  const totalOrders = partners.reduce(
    (sum, item) =>
      sum + item.orders,
    0
  );

  const totalAmount = partners.reduce(
    (sum, item) =>
      sum + item.amount,
    0
  );

  const totalDebt = partners.reduce(
    (sum, item) =>
      sum + Math.max(item.amount - item.paid, 0),
    0
  );

  return `${pageHead(
    'Đối tác gia công',
    'Quản lý và theo dõi tình hình thực hiện của các đối tác gia công',
    `
      <button class="btn btn-primary"
        data-act="subcontracting-partner-new">
        <i class="fa-solid fa-plus"></i>
        Thêm đối tác
      </button>
    `
  )}

  <div class="grid g-auto-sm" style="margin-bottom:14px">

    ${mkpi(
      'Đối tác',
      totalPartners,
      'fa-handshake',
      'blue'
    )}

    ${mkpi(
      'Tổng đơn gia công',
      totalOrders,
      'fa-industry',
      'teal'
    )}

    ${mkpi(
      'Tổng giá trị',
      fmtVND(totalAmount),
      'fa-file-invoice',
      'green'
    )}

    ${mkpi(
      'Công nợ',
      fmtVND(totalDebt),
      'fa-file-invoice-dollar',
      'red'
    )}

  </div>

  <div class="card">

    <div class="card-head">
      <div>
        <h3>Danh sách đối tác gia công</h3>
        <p>Tổng hợp sản lượng, chất lượng và công nợ theo đối tác</p>
      </div>
    </div>

    ${tableShell(
      [
        { t: 'Đối tác' },
        { t: 'Số đơn', cls: 'right' },
        { t: 'Kế hoạch', cls: 'right' },
        { t: 'Đã giao', cls: 'right' },
        { t: 'Đã nhận', cls: 'right' },
        { t: 'Đạt', cls: 'right' },
        { t: 'Tỷ lệ lỗi', cls: 'right' },
        { t: 'Giá trị', cls: 'right' },
        { t: 'Công nợ', cls: 'right' },
        { t: '', cls: 'right' }
      ],
      rows,
      {
        emptyTitle: 'Chưa có đối tác gia công'
      }
    )}

  </div>`;
};
function openSubcontractingForm() {
  Modal.open({ title: 'Tạo kế hoạch gia công', sub: 'Khai báo đối tác, sản phẩm, số lượng và hạn hoàn thành', size: 'md', body: `<div class="form-grid"><div class="field"><label>Đối tác gia công</label><input class="inp" id="subPartner" value="Cơ sở Đậu Hủ Tân Phúc" /></div><div class="field"><label>Sản phẩm</label><select class="inp" id="subProduct">${DB.products.map((product) => `<option value="${product.id}">${esc(product.name)}</option>`).join('')}</select></div></div><div class="form-grid"><div class="field"><label>Số lượng kế hoạch</label><input class="inp num" id="subQty" type="number" min="1" value="500" /></div><div class="field"><label>Đơn giá gia công</label><input class="inp num" id="subCost" type="number" min="0" value="1500" /></div></div><div class="form-grid"><div class="field"><label>Ngày giao nguyên liệu</label><input class="inp" id="subIssueDate" type="date" value="${currentDateYMD()}" min="${currentDateYMD()}" /></div><div class="field"><label>Ngày cần hoàn thành</label><input class="inp" id="subDueDate" type="date" value="${addDays(currentDateYMD(), 10)}" min="${currentDateYMD()}" /></div></div>`, foot: '<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="subcontracting-save"><i class="fa-solid fa-floppy-disk"></i>Lưu kế hoạch</button>' });
}


function incomingInspectionView() {
  const f = F('quality-iqc', { q: '', status: '' });
  const q = (f.q || '').toLowerCase().trim();
  const receipts = (DB.goodsReceipts || []).filter(r => {
    const po = Q.purchaseOrder(r.poId);
    if (!po || !['RECEIVED', 'PARTIAL_RECEIVED'].includes(po.status)) return false;
    if (f.status && (r.inspectionStatus || 'PENDING') !== f.status) return false;
    if (q && ![r.id, r.poId, r.prId, Q.supplierName(po.supplierId), r.note].some(v => String(v || '').toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b) => String(b.id).localeCompare(String(a.id)));
  const pg = paged(receipts, 'quality-iqc');
  const rows = pg.items.map(r => {
    const po = Q.purchaseOrder(r.poId);
    const status = r.inspectionStatus || 'PENDING';
    const statusHtml = status === 'PASSED' ? '<span class="badge green">Đạt</span>' : (status === 'FAILED' || status === 'PARTIAL_FAILED') ? '<span class="badge red">Có nguyên liệu không đạt</span>' : '<span class="badge orange">Chờ kiểm</span>';
    return `<tr>
      <td><span class="code">${esc(r.id)}</span><div class="cell-sub">Đợt nhập ${fmtN((Q.receiptsOfPo(r.poId).sort((a,b)=>String(a.id).localeCompare(String(b.id))).findIndex(x=>x.id===r.id)+1) || 1)}</div></td>
      <td><span class="code">${esc(r.poId)}</span></td>
      <td>${esc(Q.supplierName(po?.supplierId))}</td>
      <td class="num">${fmtDate(r.date)}</td>
      <td>${esc(r.warehouse || Q.warehouseName(r.warehouseId))}</td>
      <td>${esc((r.items||[]).map(i=>`${i.name} (${fmtN(i.qty)} ${i.unit})`).join(', '))}</td>
      <td>${statusHtml}</td>
      <td class="right">${status === 'PENDING' ? `<button class="btn btn-sm btn-primary" data-act="iqc-open-inspection" data-id="${esc(r.id)}"><i class="fa-solid fa-clipboard-check"></i>Kiểm tra</button>` : `<button class="btn btn-sm" data-act="iqc-open-inspection" data-id="${esc(r.id)}"><i class="fa-solid fa-eye"></i>Xem kết quả</button>`}</td>
    </tr>`;
  });
  return `${pageHead('Kiểm tra nguyên liệu đầu vào', 'Kiểm tra theo từng phiếu nhập/đợt nhập. Nguyên liệu không đạt sẽ sinh yêu cầu trả chuyển sang Kho nguyên liệu.', '')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Đợt chờ kiểm', receipts.filter(r => (r.inspectionStatus||'PENDING') === 'PENDING').length, 'fa-clock', 'orange')}
      ${mkpi('Đợt đạt', receipts.filter(r => r.inspectionStatus === 'PASSED').length, 'fa-circle-check', 'green')}
      ${mkpi('Đợt có lỗi', receipts.filter(r => ['FAILED','PARTIAL_FAILED'].includes(r.inspectionStatus)).length, 'fa-triangle-exclamation', 'red')}
      ${mkpi('Yêu cầu trả chờ kho', (DB.materialReturnRequests||[]).filter(r=>r.status==='PENDING_WAREHOUSE').length, 'fa-rotate-left', 'blue')}
    </div>
    <div class="card"><div class="toolbar">${searchBox('quality-iqc','Tìm phiếu nhập, PO, NCC…')}${selectFilter('quality-iqc','status',[['PENDING','Chờ kiểm'],['PASSED','Đạt'],['PARTIAL_FAILED','Có lỗi một phần'],['FAILED','Không đạt']], 'Tất cả kết quả')}${(f.q||f.status)?'<button class="btn btn-sm" data-act="clear-filter" data-key="quality-iqc"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>':''}<span class="spacer"></span><span class="chip">${receipts.length} đợt nhập</span></div>
    ${tableShell([{t:'Phiếu nhập / Đợt'},{t:'PO'},{t:'Nhà cung cấp'},{t:'Ngày nhập'},{t:'Kho'},{t:'Nguyên liệu'},{t:'Kết quả'},{t:'',cls:'right'}], rows, {emptyTitle:'Chưa có đợt nhập nào cần kiểm tra'})}${pagiHTML('quality-iqc', pg, 'đợt nhập')}</div>`;
}

function openIncomingInspectionModal(receiptId) {
  const receipt = (DB.goodsReceipts || []).find(r => r.id === receiptId);
  if (!receipt) return;
  const po = Q.purchaseOrder(receipt.poId);
  const readonly = (receipt.inspectionStatus && receipt.inspectionStatus !== 'PENDING') || !Auth.hasPermission('QC_INSPECT');
  Modal.open({
    title: `Kiểm tra nguyên liệu · ${receipt.id}`,
    sub: `${receipt.poId} · ${esc(Q.supplierName(po?.supplierId))} · kiểm tra theo đúng đợt nhập ngày ${fmtDate(receipt.date)}`,
    size: 'lg',
    body: `
      <div class="info-grid" style="margin-bottom:16px">
        ${infoItem('Phiếu nhập', `<span class="code">${esc(receipt.id)}</span>`)}
        ${infoItem('Đơn đặt hàng', `<span class="code">${esc(receipt.poId)}</span>`)}
        ${infoItem('Kho / Kệ', `${esc(receipt.warehouse || Q.warehouseName(receipt.warehouseId))} · ${esc(receipt.location || Q.locationName(receipt.locationId))}`)}
        ${infoItem('Người nhập kho', esc(Q.employeeName(receipt.receivedBy)))}
      </div>
      <div class="form-grid"><div class="field"><label>Người kiểm tra</label><input class="inp" value="${esc(readonly ? Q.employeeName(receipt.inspectedBy) : (DB.currentUser?.name || Q.employeeName(DB.currentUser?.id)))}" disabled><div class="cell-sub" style="margin-top:5px">${readonly ? 'Người đã thực hiện kiểm tra của đợt nhập này.' : 'Tự động lấy theo tài khoản đang đăng nhập; không cho chọn thay người khác.'}</div></div><div class="field"><label>Ngày kiểm tra</label><input class="inp" value="${esc(receipt.inspectedAt||currentDateYMD())}" disabled></div></div>
      <div class="form-sec-title"><i class="fa-solid fa-vials"></i>Kết quả theo từng nguyên liệu</div>
      <div class="tbl-wrap"><table class="line-tbl"><thead><tr><th>Nguyên liệu</th><th>SL nhập</th><th>Lô hệ thống</th><th>Lô SP/NCC</th><th>Kết quả</th><th class="right">SL không đạt / trả</th><th>Lý do</th></tr></thead><tbody>
      ${(receipt.items||[]).map(i=>`<tr><td>${cell2(esc(i.name),esc(i.materialId))}</td><td class="num">${fmtN(i.qty)} ${esc(i.unit)}</td><td><span class="code">${esc(i.lotNumber||'—')}</span></td><td>${esc(i.supplierLot||Q.lot(i.lotId)?.supplierLot||'—')}</td><td><select class="inp iqc-result" data-mid="${esc(i.materialId)}" ${readonly?'disabled':''}><option value="PASSED" ${(i.qcStatus||'PASSED')==='PASSED'?'selected':''}>Đạt</option><option value="FAILED" ${i.qcStatus==='FAILED'?'selected':''}>Không đạt</option></select></td><td><input class="inp right num iqc-fail-qty" data-mid="${esc(i.materialId)}" type="number" min="0" max="${Number(i.qty||0)}" value="${Number(i.failedQty||0)}" ${readonly?'disabled':''}></td><td><input class="inp iqc-reason" data-mid="${esc(i.materialId)}" value="${esc(i.qcReason||'')}" placeholder="Mùi, màu, bao bì, độ ẩm…" ${readonly?'disabled':''}></td></tr>`).join('')}
      </tbody></table></div>
      <div class="field" style="margin-top:12px"><label>Ghi chú kiểm tra</label><textarea class="inp" id="iqcNote" rows="2" ${readonly?'disabled':''}>${esc(receipt.inspectionNote||'')}</textarea></div>
      ${readonly ? `<div class="alert-item"><i class="fa-solid fa-circle-info"></i><div><b>Đợt nhập đã được kiểm tra</b><div class="muted">Kết quả đã khóa. Yêu cầu trả nguyên liệu (nếu có) đang/đã được xử lý ở Kho → Xuất kho → Kho nguyên liệu.</div></div></div>` : ''}`,
    foot: `<button class="btn" data-act="modal-close">Đóng</button>${readonly?'':`<button class="btn btn-primary" data-act="iqc-save-inspection" data-id="${esc(receipt.id)}"><i class="fa-solid fa-floppy-disk"></i>Lưu kết quả kiểm tra</button>`}`
  });
}


/* ==========================================================================\n * QC THÀNH PHẨM - nhận trực tiếp từ Lệnh sản xuất\n * Thành phẩm chỉ là tồn chờ QC (qtyPending), chưa được cộng qtyOnHand.\n * ======================================================================= */
function finalInspectionStatusHtml(status) {
  if (status === 'PASSED') return '<span class="badge green">Đạt</span>';
  if (status === 'PARTIAL_FAILED') return '<span class="badge orange">Đạt một phần</span>';
  if (status === 'FAILED') return '<span class="badge red">Không đạt</span>';
  return '<span class="badge orange">Chờ kiểm</span>';
}

function finalInspectionView() {
  DB.productionFinalInspections = DB.productionFinalInspections || [];
  // Tương thích các LSX đang QC được tạo từ phiên bản trước.
  (DB.productionOrders || []).filter(po => po.status === 'lsx_dang_qc').forEach(po => {
    if (!(DB.productionFinalInspections || []).some(x => x.productionOrderId === po.id) && typeof ensureFinishedQcPending === 'function') {
      ensureFinishedQcPending(po, Number(po.qty || 0));
    }
  });
  const f = F('quality-fqc', { q:'', status:'' });
  const q = String(f.q || '').toLowerCase().trim();
  let list = (DB.productionFinalInspections || []).filter(ins => {
    if (f.status && (ins.status || 'PENDING') !== f.status) return false;
    if (q && ![ins.id,ins.productionOrderId,ins.productId,ins.productName,ins.lotNumber].some(v=>String(v||'').toLowerCase().includes(q))) return false;
    return true;
  }).sort((a,b)=>String(b.id).localeCompare(String(a.id),'vi',{numeric:true}));
  const pg = paged(list,'quality-fqc');
  const rows = pg.items.map(ins => {
    const po = Q.po(ins.productionOrderId);
    return `<tr class="clickable" data-act="fqc-open" data-id="${esc(ins.id)}">
      <td>${cell2(`<span class="code">${esc(ins.id)}</span>`, `<span class="code">${esc(ins.productionOrderId)}</span>`)}</td>
      <td>${cell2(esc(ins.productName || Q.product(ins.productId)?.name || ins.productId), esc(ins.productId))}</td>
      <td class="right num">${fmtN(ins.qty)} ${esc(ins.unit||po?.unit||'')}</td>
      <td><span class="code">${esc(ins.lotNumber||'—')}</span><div class="cell-sub">${esc(Q.warehouseName(ins.warehouseId))}</div></td>
      <td>${finalInspectionStatusHtml(ins.status||'PENDING')}</td>
      <td class="right num">${ins.status==='PENDING'?'—':`${fmtN(ins.passQty||0)} / ${fmtN(ins.failQty||0)}`}</td>
      <td class="num">${ins.inspectedAt ? fmtDate(String(ins.inspectedAt).slice(0,10)) : '—'}</td>
      <td class="right">${rowActions([{act:'fqc-open',data:`data-id="${esc(ins.id)}"`,icon:'fa-eye',title:'Xem chi tiết / kiểm tra'}])}</td>
    </tr>`;
  });
  return `${pageHead('Kiểm tra thành phẩm', 'Thành phẩm hoàn tất sản xuất được đưa vào Kho thành phẩm ở trạng thái chờ QC; chỉ số lượng đạt mới được cộng tồn.', '')}
    <div class="grid g-auto-sm" style="margin-bottom:14px">
      ${mkpi('Chờ kiểm',list.filter(x=>(x.status||'PENDING')==='PENDING').length,'fa-clock','orange')}
      ${mkpi('Đạt',list.filter(x=>x.status==='PASSED').length,'fa-circle-check','green')}
      ${mkpi('Đạt một phần',list.filter(x=>x.status==='PARTIAL_FAILED').length,'fa-circle-half-stroke','orange')}
      ${mkpi('Không đạt',list.filter(x=>x.status==='FAILED').length,'fa-circle-xmark','red')}
    </div>
    <div class="card"><div class="toolbar">${searchBox('quality-fqc','Tìm FQC, LSX, thành phẩm, lô…')}${selectFilter('quality-fqc','status',[['PENDING','Chờ kiểm'],['PASSED','Đạt'],['PARTIAL_FAILED','Đạt một phần'],['FAILED','Không đạt']],'Tất cả kết quả')}${(f.q||f.status)?'<button class="btn btn-sm" data-act="clear-filter" data-key="quality-fqc"><i class="fa-solid fa-filter-circle-xmark"></i>Xóa lọc</button>':''}<span class="spacer"></span><span class="chip">${fmtN(list.length)} phiếu</span></div>
    ${tableShell([{t:'Phiếu QC / LSX'},{t:'Thành phẩm'},{t:'SL chờ kiểm',cls:'right'},{t:'Lô / Kho'},{t:'Kết quả'},{t:'Đạt / Lỗi',cls:'right'},{t:'Ngày kiểm'},{t:'',cls:'right'}],rows,{emptyTitle:'Chưa có thành phẩm chờ kiểm tra',emptyDesc:'Khi công đoạn sản xuất hoàn tất, thành phẩm sẽ tự xuất hiện tại đây.'})}${pagiHTML('quality-fqc',pg,'phiếu QC')}</div>`;
}

function openFinalInspectionModal(id) {
  const ins = (DB.productionFinalInspections || []).find(x=>x.id===id); if (!ins) return;
  const po = Q.po(ins.productionOrderId);
  const row = (DB.inventory || []).find(r=>r.lotId===ins.lotId && r.productId===ins.productId);
  const readonly = (ins.status||'PENDING') !== 'PENDING' || !Auth.hasPermission('QC_INSPECT');
  const total = Number(ins.qty || row?.qtyPending || po?.qty || 0);
  Modal.open({
    title:`Kiểm tra thành phẩm · ${ins.id}`,
    sub:`${esc(ins.productionOrderId)} · ${esc(ins.productName||po?.productName||'')} · lô ${esc(ins.lotNumber||'')}`,
    size:'lg',
    body:`<div class="info-grid" style="margin-bottom:14px">
      ${infoItem('Lệnh sản xuất',`<span class="code">${esc(ins.productionOrderId)}</span>`)}
      ${infoItem('Thành phẩm',esc(ins.productName||po?.productName||ins.productId))}
      ${infoItem('Số lượng chờ QC',`<b>${fmtN(total)} ${esc(ins.unit||po?.unit||'')}</b>`)}
      ${infoItem('Kho chờ QC',`${esc(Q.warehouseName(ins.warehouseId))} · ${esc(Q.locationName(ins.locationId))}`)}
      ${infoItem('Mã lô',`<span class="code">${esc(ins.lotNumber||'—')}</span>`)}
      ${infoItem('Trạng thái',finalInspectionStatusHtml(ins.status||'PENDING'))}
    </div>
    <div class="note-box" style="margin-bottom:14px"><b>Nguyên tắc tồn kho:</b> ${fmtN(total)} ${esc(ins.unit||po?.unit||'')} hiện chỉ là <b>tồn chờ QC</b>, chưa được tính vào tồn khả dụng. Khi QC xác nhận, chỉ số lượng đạt mới được cộng vào tồn kho thành phẩm.</div>
    <div class="form-grid cols-2">
      <div class="field"><label>Số lượng đạt *</label><input class="inp right num" id="fqcPass" type="number" min="0" max="${total}" step="0.01" value="${readonly?Number(ins.passQty||0):total}" ${readonly?'disabled':''}></div>
      <div class="field"><label>Số lượng không đạt *</label><input class="inp right num" id="fqcFail" type="number" min="0" max="${total}" step="0.01" value="${Number(ins.failQty||0)}" ${readonly?'disabled':''}></div>
      <div class="field" style="grid-column:1/-1"><label>Ghi chú QC</label><textarea class="inp" id="fqcNote" rows="3" ${readonly?'disabled':''}>${esc(ins.note||'')}</textarea></div>
    </div>
    ${readonly?`<div class="alert-item"><i class="fa-solid fa-lock"></i><div><b>Kết quả đã được xác nhận</b><div class="muted">Đạt ${fmtN(ins.passQty||0)} · không đạt ${fmtN(ins.failQty||0)} ${esc(ins.unit||'')}. Kết quả đã khóa để bảo toàn lịch sử tồn kho.</div></div></div>`:''}`,
    foot:`<button class="btn" data-act="modal-close">Đóng</button>${readonly?'':`<button class="btn btn-primary" data-act="fqc-save" data-id="${esc(ins.id)}"><i class="fa-solid fa-clipboard-check"></i>Xác nhận QC & cập nhật tồn</button>`}`
  });
}

/* Đăng ký Views cho các phân hệ doanh nghiệp tiêu chuẩn */
['accounting', 'quality', 'maintenance', 'logistics', 'rnd', 'approvals', 'bi'].forEach(key => {
  Views[key] = function (params = {}) {
    const tab = State.tab || (params && params.tab) || 'dashboard';
    if (key === 'quality' && tab === 'iqc') return incomingInspectionView();
    if (key === 'quality' && tab === 'fqc') return finalInspectionView();
    if (!tab || tab === 'dashboard') {
      if (ENTERPRISE_MODULES[key]) return enterpriseView(key);
      if (key === 'bi' && typeof Views.reports === 'function') return Views.reports(params);
    }
    return '';
  };
});
function openSupplierForm(id = '') {
  const supplier = id ? DB.suppliers.find((x) => x.id === id) : null;
  // [DATA CONSISTENCY] Nhóm cung ứng dùng đúng master Danh mục nguyên liệu.
  // Nếu dữ liệu cũ từng có 2 record cùng tên (Bao bì/Phụ gia), dropdown chỉ
  // hiện một lựa chọn. InventoryAPI đồng thời dọn record trùng trên KIO server.
  const seenGroups = new Set();
  const rawMaterialCategories = (DB.itemCategories || [])
    .filter((c) => c.type === 'RAW_MATERIAL' && c.status !== 'inactive' && c.name)
    .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), 'vi', { numeric: true }))
    .filter((c) => {
      const key = String(c.name).trim().toLocaleLowerCase('vi');
      if (seenGroups.has(key)) return false;
      seenGroups.add(key);
      return true;
    });

  const groupOptions = rawMaterialCategories
    .map((c) => `<option value="${esc(c.name)}" ${supplier?.group === c.name ? 'selected' : ''}>${esc(c.name)}</option>`)
    .join('');
  Modal.open({
    title: supplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp',
    sub: supplier ? `${supplier.id} · Cập nhật hồ sơ nhà cung cấp` : 'Tạo hồ sơ nhà cung cấp mới · ban đầu chưa đánh giá',
    size: 'md',
    body: `<div class="form-grid">
      <div class="field" style="grid-column:1/-1"><label>Tên nhà cung cấp <span class="req">*</span></label><input class="inp" id="supName" value="${esc(supplier?.name || '')}" placeholder="Tên công ty / hộ kinh doanh / đối tác"></div>
      <div class="field"><label>Nhóm cung ứng <span class="req">*</span></label><select class="inp" id="supGroup"><option value="">-- Chọn nhóm cung ứng --</option>${groupOptions}</select><div class="cell-sub" style="margin-top:5px">Danh sách lấy trực tiếp từ danh mục nguyên liệu hiện hành.</div></div>
      <div class="field"><label>Người liên hệ</label><input class="inp" id="supContact" value="${esc(supplier?.contact || '')}" placeholder="Họ và tên"></div>
      <div class="field"><label>Số điện thoại</label><input class="inp" id="supPhone" value="${esc(supplier?.phone || '')}" placeholder="Số điện thoại"></div>
      <div class="field"><label>Email</label><input class="inp" id="supEmail" type="email" value="${esc(supplier?.email || '')}" placeholder="email@congty.vn"></div>
      <div class="field"><label>Mã số thuế</label><input class="inp" id="supTaxCode" value="${esc(supplier?.taxCode || '')}" placeholder="Mã số thuế"></div>
      <div class="field"><label>Tài khoản ngân hàng</label><input class="inp" id="supBankAccount" value="${esc(supplier?.bankAccount || '')}" placeholder="Số tài khoản"></div>
      <div class="field"><label>Ngân hàng</label><input class="inp" id="supBankName" value="${esc(supplier?.bankName || '')}" placeholder="Tên ngân hàng"></div>
      <div class="field" style="grid-column:1/-1"><label>Địa chỉ</label><input class="inp" id="supAddress" value="${esc(supplier?.address || '')}" placeholder="Địa chỉ nhà cung cấp"></div>
      <div class="field"><label>Điều khoản thanh toán</label><input class="inp" id="supPayment" value="${esc(supplier?.paymentTerm || '')}" placeholder="Ví dụ: 30 ngày sau giao hàng"></div>
      <div class="field"><label>Đánh giá</label><input class="inp" value="${supplier && Number(supplier.rating) ? Number(supplier.rating).toFixed(1) + ' / 5' : 'Chưa đánh giá'}" disabled></div>
    </div>`,
    foot: `<button class="btn" data-act="modal-close">Hủy</button><button class="btn btn-primary" data-act="supplier-save" data-id="${esc(supplier?.id || '')}"><i class="fa-solid fa-floppy-disk"></i>${supplier ? 'Lưu thay đổi' : 'Lưu nhà cung cấp'}</button>`
  });
}
