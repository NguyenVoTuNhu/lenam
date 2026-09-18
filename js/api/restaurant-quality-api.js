/* ============================================================================
 * RESTAURANT + QUALITY API — ISOLATED KIO SERVER PERSISTENCE
 * ----------------------------------------------------------------------------
 * CHỈ dùng cho các bảng mới lenam_restaurant_* / lenam_quality_*.
 * Không sửa KioStore/kio-api.js và không can thiệp các module cũ.
 *
 * Lý do có writer riêng:
 * - KRUD/KIO tự tạo cột `payload` ở lần ghi đầu tiên.
 * - KioStore dùng ghi chunk song song; với bảng mới nhiều request đầu có thể cùng
 *   cố ADD COLUMN payload và gây SQLSTATE[42S21] Duplicate column name 'payload'.
 * - Adapter này ghi tuần tự để lần ghi đầu tiên tạo schema xong trước khi ghi tiếp.
 *
 * Format payload vẫn tương thích KioStore chunk v2 để dữ liệu không bị khóa vào
 * adapter này và có thể đọc bằng công cụ debug hiện có.
 * ========================================================================== */
const RestaurantQualityAPI = (() => {
  const RT = KIO_CONFIG.restaurantTables;
  const QT = KIO_CONFIG.qualityTables;
  const PAGE_SIZE = 1000;
  const CHUNK_SIZE = 120;
  const FORMAT_VERSION = 2;
  let formSeq = 0;

  const restaurantMap = Object.freeze({
    stores: ['stores', RT.stores],
    recipes: ['restaurantRecipes', RT.recipes],
    orders: ['posOrders', RT.orders],
    replenishments: ['storeReplenishmentRequests', RT.replenishments],
    storeStocks: ['restaurantStoreStocks', RT.storeStocks],
    storeStockTransactions: ['restaurantStoreStockTransactions', RT.storeStockTransactions],
  });
  const qualityMap = Object.freeze({
    coa: ['qualityCoa', QT.coa],
    capa: ['qualityCapa', QT.capa],
    recalls: ['qualityRecalls', QT.recalls],
  });

  function assertReady() {
    if (typeof getKrudList !== 'function' || typeof sendFormDataKRUD !== 'function' || typeof krud !== 'function') {
      throw new Error('Chưa tải đầy đủ KIO list.js / krud.js');
    }
  }
  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function keyOf(item, index = 0) {
    if (item && typeof item === 'object') {
      const candidates = [item.id,item.code,item.key,item.requestId,item.inspectionId,item.transactionId,item.lotId];
      const found = candidates.find(v => v !== undefined && v !== null && String(v) !== '');
      if (found !== undefined) return String(found);
    }
    return `ROW-${index + 1}`;
  }
  function splitText(text) {
    const out=[];
    for(let i=0;i<text.length;i+=CHUNK_SIZE) out.push(text.slice(i,i+CHUNK_SIZE));
    return out.length?out:[''];
  }
  function encodeItem(item,index=0){
    const key=keyOf(item,index), raw=JSON.stringify(clone(item)), chunks=splitText(raw);
    return {key,raw,payloads:chunks.map((d,i)=>JSON.stringify({v:FORMAT_VERSION,k:key,i,n:chunks.length,d}))};
  }
  function parsePayload(raw){
    if(raw==null||raw==='') return null;
    if(typeof raw==='object') return raw;
    try{return JSON.parse(raw);}catch(_){return null;}
  }
  function groupRows(rows){
    const groups=new Map();
    (rows||[]).forEach(row=>{
      const p=parsePayload(row.payload); if(!p)return;
      if(p.v===FORMAT_VERSION && p.k!=null && Number.isInteger(Number(p.i))){
        const key=String(p.k); if(!groups.has(key))groups.set(key,{key,rows:[],parts:[],legacy:false});
        const g=groups.get(key); g.rows.push(row); g.parts.push({i:Number(p.i),d:String(p.d??'')}); return;
      }
      const data=Object.prototype.hasOwnProperty.call(p,'data')?p.data:p;
      const key=String(p.key??keyOf(data,0)); if(!groups.has(key))groups.set(key,{key,rows:[],legacy:true,data});
      const g=groups.get(key);g.rows.push(row);g.legacy=true;g.data=data;
    });
    for(const g of groups.values()){
      if(g.legacy){try{g.raw=JSON.stringify(g.data);}catch(_){g.raw='';}continue;}
      g.parts.sort((a,b)=>a.i-b.i); g.raw=g.parts.map(x=>x.d).join('');
      try{g.data=JSON.parse(g.raw);}catch(_){g.data=null;}
    }
    return groups;
  }

  async function listRows(table){
    assertReady(); const out=[]; let page=1;
    while(true){
      let res, lastErr;
      for(let attempt=0;attempt<3;attempt+=1){
        try{res=await getKrudList({table,page,limit:PAGE_SIZE,sort:{id:'ASC'},where:[]});lastErr=null;break;}
        catch(err){lastErr=err;if(/abort/i.test(String(err?.message||err))&&attempt<2){await new Promise(r=>setTimeout(r,180*(attempt+1)));continue;}throw err;}
      }
      if(lastErr) throw lastErr;
      if(!res||!res.success) throw new Error(res?.error||`Không đọc được bảng ${table}`);
      const rows=Array.isArray(res.data)?res.data:[]; out.push(...rows);
      if(rows.length<PAGE_SIZE || out.length>=Number(res.total||0)) break; page+=1;
    }
    return out;
  }
  async function listCollection(table){
    const groups=groupRows(await listRows(table));
    return [...groups.values()].map(g=>g.data).filter(Boolean);
  }
  function createForm(payloadText){
    const f=document.createElement('form'); f.id=`__rq_payload_${++formSeq}`; f.style.display='none';
    f.innerHTML='<textarea class="data-element" name="payload"></textarea>';
    f.querySelector('[name="payload"]').value=payloadText; document.body.appendChild(f); return f;
  }
  async function writePayload(table,payloadText){
    const f=createForm(payloadText);
    try{
      const res=await sendFormDataKRUD('insert',table,null,`#${f.id}`);
      if(!res||!res.success) throw new Error(res?.error||`Insert thất bại ở ${table}`);
      return res;
    }finally{f.remove();}
  }
  async function deleteRows(table,rows){
    for(const row of (rows||[])){
      const res=await krud('delete',table,{},row.id);
      if(!res||!res.success) throw new Error(res?.error||`Không xóa được record ${row.id} ở ${table}`);
    }
  }
  async function insertEncoded(table,encoded){
    // CỐ Ý tuần tự: tránh nhiều request đầu đồng thời tạo cột payload.
    for(const payloadText of encoded.payloads) await writePayload(table,payloadText);
  }
  async function syncCollection(table,items){
    assertReady();
    const local=(Array.isArray(items)?items:[]).map(encodeItem);
    const remoteGroups=groupRows(await listRows(table));
    for(const encoded of local){
      const remote=remoteGroups.get(encoded.key);
      if(!remote){ await insertEncoded(table,encoded); continue; }
      if(remote.raw!==encoded.raw || remote.legacy){
        await deleteRows(table,remote.rows); await insertEncoded(table,encoded);
      }
    }
    return true;
  }
  async function deleteKeys(table,keys){
    const wanted=new Set((Array.isArray(keys)?keys:[keys]).map(String).filter(Boolean));
    if(!wanted.size)return true;
    const groups=groupRows(await listRows(table));
    for(const key of wanted){const g=groups.get(key);if(g)await deleteRows(table,g.rows);}
    return true;
  }

  async function loadMap(map,label){
    for(const [, [dbKey,table]] of Object.entries(map)){
      try{DB[dbKey]=await listCollection(table);}catch(err){DB[dbKey]=Array.isArray(DB[dbKey])?DB[dbKey]:[];console.warn(`[${label}] Không đọc được bảng ${table}:`,err);}
    }
  }
  async function bootstrap(){await loadMap(restaurantMap,'RestaurantAPI');await loadMap(qualityMap,'QualityAPI');return true;}
  async function syncMap(map,keys){
    const wanted=Array.isArray(keys)&&keys.length?keys:Object.keys(map);
    for(const key of wanted){const entry=map[key];if(!entry)continue;const [dbKey,table]=entry;await syncCollection(table,clone(Array.isArray(DB[dbKey])?DB[dbKey]:[]));}
    return true;
  }
  async function refreshRestaurant(keys){
    const wanted=Array.isArray(keys)&&keys.length?keys:Object.keys(restaurantMap);
    for(const key of wanted){const entry=restaurantMap[key];if(!entry)continue;const [dbKey,table]=entry;DB[dbKey]=await listCollection(table);}
    return true;
  }
  async function deleteRestaurant(key,id){const e=restaurantMap[key];if(!e||!id)return false;await deleteKeys(e[1],[id]);return true;}
  async function deleteQuality(key,id){const e=qualityMap[key];if(!e||!id)return false;await deleteKeys(e[1],[id]);return true;}
  async function debugTables(){
    const rows=[]; for(const [moduleName,map] of [['Restaurant',restaurantMap],['Quality',qualityMap]]){
      for(const [key,[,table]] of Object.entries(map)){
        try{const data=await listCollection(table);rows.push({module:moduleName,key,table,records:data.length,status:'OK'});}catch(err){rows.push({module:moduleName,key,table,records:0,status:String(err?.message||err)});}
      }
    } console.table(rows);return rows;
  }
  async function debugTable(table){
    const allowed=new Set([...Object.values(restaurantMap).map(v=>v[1]),...Object.values(qualityMap).map(v=>v[1])]);
    if(!allowed.has(table))throw new Error('Chỉ cho phép kiểm tra bảng Restaurant/Quality mới.');
    const data=await listCollection(table);console.table(data);return data;
  }

  return {
    bootstrap,
    syncRestaurant:(keys)=>syncMap(restaurantMap,keys),
    syncQuality:(keys)=>syncMap(qualityMap,keys),
    refreshRestaurant,
    deleteRestaurant,
    deleteQuality,
    debugTables,
    debugTable,
    listCollection,
  };
})();
