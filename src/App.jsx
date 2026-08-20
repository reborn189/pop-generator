import React,{useEffect,useRef,useState}from"react";
import{AlertTriangle,Archive,ChevronDown,Copy,Download,Eye,FileDown,FileSpreadsheet,FileText,GripVertical,History,Layers3,Minus,Move,Plus,RotateCcw,Save,Settings2,ShieldCheck,SlidersHorizontal,Trash2,Upload,X}from"lucide-react";
import{jsPDF}from"jspdf";
import{POP_TEMPLATES,BRANCHES,CATEGORIES,directDriveImageUrl,proxiedDriveImageUrl,getTemplateId,templateOverrideKey}from"./config/templates.js";
import{removeFlatBackground}from"./utils/background.js";
import{getDrafts,saveDraft,deleteDraft}from"./utils/drafts.js";
import{analyzeProductLocal,PRODUCT_PRESETS}from"./utils/productRules.js";
import{putImage,getImage,deleteImages,imageToBlob,blobToImage,imageToDataURL}from"./utils/imageStore.js";
import{parseTableFile,createCsvTemplate}from"./utils/importer.js";
import{exportBackup,importBackup}from"./utils/backup.js";
import{formatRupiahInput,validatePop,canExport}from"./utils/validation.js";
import{BASE_LAYOUT,getLayoutPreset}from"./utils/layoutPresets.js";
import{saveAutosave,getAutosave,clearAutosave}from"./utils/autosave.js";
import InstallStatus from"./components/InstallStatus.jsx";

const W=1080,H=1528,EXPORT_SCALE=3;
const INITIAL=BASE_LAYOUT;
const loadImage=src=>new Promise((res,rej)=>{const i=new Image();i.crossOrigin="anonymous";i.onload=()=>res(i);i.onerror=rej;i.src=src});
const cleanFile=s=>(s||"POP").replace(/[^\w.-]+/g,"_").replace(/_+/g,"_").slice(0,80);
const clone=o=>JSON.parse(JSON.stringify(o));

async function loadTemplate(id){
  try{return await loadImage(proxiedDriveImageUrl(id))}catch{return loadImage(directDriveImageUrl(id))}
}
async function snapshotImages(s){
  const out={...s};
  out.productImg=s.productData?await loadImage(s.productData):null;
  out.productImg2=s.productData2?await loadImage(s.productData2):null;
  out.baseImg=await loadTemplate(s.templateId).catch(()=>null);
  return out;
}
function renderSnapshot(s,target,scale=1,selection=null){
  const ctx=target.getContext("2d");ctx.save();ctx.scale(scale,scale);ctx.clearRect(0,0,W,H);ctx.fillStyle="#f4f0e7";ctx.fillRect(0,0,W,H);
  if(s.baseImg)ctx.drawImage(s.baseImg,0,0,W,H);else{ctx.fillStyle="#20231f";ctx.fillRect(28,28,W-56,H-56);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 38px Arial";ctx.fillText("TEMPLATE PREVIEW",W/2,H/2)}
  const e=s.els;
  const putImage=(im,key,w)=>{if(!im)return;const a=e[key],iw=w*a.s,ih=im.height/im.width*iw;ctx.drawImage(im,a.x-iw/2,a.y-ih/2,iw,ih)};
  const title=(text,key,max=850)=>{const a=e[key],words=(text||"").toUpperCase().trim().split(/\s+/),l1=words.length<=2?words.join(" "):words[0],l2=words.length<=2?"":words.slice(1).join(" ");ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#20231f";let fs=135*a.s;ctx.font=`900 ${fs}px Arial Black,Arial`;if(ctx.measureText(l1).width>max*a.s)fs*=max*a.s/ctx.measureText(l1).width;ctx.font=`900 ${fs}px Arial Black,Arial`;ctx.fillText(l1,a.x,a.y);if(l2){let fs2=86*a.s;ctx.font=`900 ${fs2}px Arial Black,Arial`;if(ctx.measureText(l2).width>max*a.s)fs2*=max*a.s/ctx.measureText(l2).width;ctx.font=`900 ${fs2}px Arial Black,Arial`;ctx.fillText(l2,a.x,a.y+112*a.s)}};
  if(s.mode==="1POP"){
    putImage(s.productImg,"image",700);title(s.name,"title");
    const p=e.price;ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font=`900 ${230*p.s}px Arial Black,Arial`;ctx.fillText(s.promo,p.x,p.y);
    const n=e.normal;ctx.fillStyle="#111";ctx.font=`700 ${70*n.s}px Arial`;ctx.fillText(`Rp ${s.normal}`,n.x,n.y);
    const u=e.unit;ctx.fillStyle="#fff";ctx.font=`900 ${62*u.s}px Arial`;ctx.fillText(s.unit,u.x,u.y);
    const per=e.period;ctx.font=`900 ${37*per.s}px Arial`;ctx.fillStyle="#fff";s.period.split("\n").forEach((v,i)=>ctx.fillText(v,per.x,per.y+i*44*per.s));
    const b=e.benefits;ctx.textAlign="left";ctx.font=`700 ${27*b.s}px Arial`;s.benefits.split("\n").filter(Boolean).slice(0,5).forEach((v,i)=>ctx.fillText(`✓ ${v}`,b.x,b.y+i*39*b.s));
    if(s.badgeText){const bg=e.badge;ctx.fillStyle=s.badgeColor;ctx.beginPath();ctx.arc(bg.x,bg.y,88*bg.s,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=3*bg.s;ctx.beginPath();ctx.arc(bg.x,bg.y,78*bg.s,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font=`900 ${26*bg.s}px Arial`;const ws=s.badgeText.toUpperCase().split(/\s+/);ctx.fillText(ws.slice(0,2).join(" "),bg.x,bg.y-(ws.length>2?13:0));if(ws.length>2)ctx.fillText(ws.slice(2).join(" "),bg.x,bg.y+18*bg.s)}
  }else{
    const colors={Meat:["#ef4444","#7f1d1d"],Poultry:["#f97316","#9a3412"],Fishery:["#3b82f6","#1e3a8a"],"Fruit/Veg":["#16a34a","#064e3b"]}[s.category];
    const item=(idx,im,nm,pr,norm,un)=>{putImage(im,`image${idx}`,450);const t=e[`title${idx}`];ctx.textAlign="center";ctx.font=`900 ${82*t.s}px Arial Black,Arial`;ctx.fillStyle=colors[0];ctx.fillText((nm||"").toUpperCase(),t.x,t.y);const p=e[`price${idx}`];ctx.fillStyle="#fff";ctx.font=`900 ${150*p.s}px Arial Black,Arial`;ctx.fillText(pr,p.x,p.y);const ne=e[`normal${idx}`];ctx.fillStyle="#111";ctx.font=`700 ${34*ne.s}px Arial`;ctx.fillText(`RP. ${norm}`,ne.x,ne.y);const ue=e[`unit${idx}`];ctx.fillStyle="#fff";ctx.font=`900 ${38*ue.s}px Arial`;ctx.fillText(un,ue.x,ue.y)};
    item(1,s.productImg,s.name,s.promo,s.normal,s.unit);item(2,s.productImg2,s.name2,s.promo2,s.normal2,s.unit2);
  }
  if(selection&&e[selection]){const a=e[selection];ctx.strokeStyle="#17745a";ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.strokeRect(a.x-92,a.y-62,184,124);ctx.setLineDash([])}
  ctx.restore();
}

export default function App(){
 const[branch,setBranch]=useState("CMS"),[category,setCategory]=useState("Fruit/Veg"),[mode,setMode]=useState("1POP");
 const[name,setName]=useState("Sweet Pear"),[name2,setName2]=useState("Apel Dazzle");
 const[promo,setPromo]=useState("2.990"),[promo2,setPromo2]=useState("9.865"),[normal,setNormal]=useState("3.895"),[normal2,setNormal2]=useState("12.500"),[unit,setUnit]=useState("/kg"),[unit2,setUnit2]=useState("/kg");
 const[period,setPeriod]=useState("01-15\nAGUSTUS"),[benefits,setBenefits]=useState("Manis dan renyah\nSumber serat\nSegar setiap hari\nPraktis dikonsumsi"),[badgeText,setBadgeText]=useState(""),[badgeColor,setBadgeColor]=useState("#17745a");
 const[raw1,setRaw1]=useState(null),[raw2,setRaw2]=useState(null),[product,setProduct]=useState(null),[product2,setProduct2]=useState(null),[tol1,setTol1]=useState(42),[tol2,setTol2]=useState(42);
 const[base,setBase]=useState(null),[error,setError]=useState(""),[notice,setNotice]=useState(""),[busy,setBusy]=useState("");
 const[active,setActive]=useState("image"),[els,setEls]=useState(INITIAL),[drafts,setDrafts]=useState(()=>getDrafts()),[batch,setBatch]=useState([]);
 const[showHistory,setShowHistory]=useState(false),[showTemplates,setShowTemplates]=useState(false),[showBatch,setShowBatch]=useState(false),[showImport,setShowImport]=useState(false),[showPreview,setShowPreview]=useState(false),[showPreflight,setShowPreflight]=useState(false),[showRecovery,setShowRecovery]=useState(false),[customTemplate,setCustomTemplate]=useState("");
 const[thumbs,setThumbs]=useState({}),[dragIndex,setDragIndex]=useState(null),[recovery,setRecovery]=useState(()=>getAutosave());
 const[importRows,setImportRows]=useState([]),[periodPreset,setPeriodPreset]=useState("01-15 AGUSTUS");
 const canvas=useRef(null),drag=useRef(null),templateId=getTemplateId(branch,mode,category),standardId=POP_TEMPLATES[branch][mode][category];

 useEffect(()=>{setCustomTemplate(localStorage.getItem(templateOverrideKey(branch,mode,category))||"")},[branch,mode,category]);
 useEffect(()=>{let alive=true;setBase(null);setError("");loadTemplate(templateId).then(i=>alive&&setBase(i)).catch(()=>alive&&setError("Template tidak dapat dimuat. Cek permission Drive atau Template Manager."));return()=>alive=false},[templateId]);
 useEffect(()=>{const c=canvas.current;if(!c)return;renderSnapshot(currentSnapshot(),c,1,active)},[base,product,product2,name,name2,promo,promo2,normal,normal2,unit,unit2,period,benefits,badgeText,badgeColor,mode,category,els,active]);
 useEffect(()=>{const t=setTimeout(()=>saveAutosave({...serialSnapshot(),productData:undefined,productData2:undefined}),700);return()=>clearTimeout(t)},[branch,category,mode,name,name2,promo,promo2,normal,normal2,unit,unit2,period,benefits,badgeText,badgeColor,els]);
 useEffect(()=>{if(recovery?.savedAt)setShowRecovery(true)},[]);


 const currentSnapshot=()=>({branch,category,mode,name,name2,promo,promo2,normal,normal2,unit,unit2,period,benefits,badgeText,badgeColor,els:clone(els),templateId,baseImg:base,productImg:product,productImg2:product2});
 const serialSnapshot=()=>({...currentSnapshot(),baseImg:undefined,productImg:undefined,productImg2:undefined,productData:imageToDataURL(product),productData2:imageToDataURL(product2)});
 const upload=(e,second=false)=>{const f=e.target.files?.[0];if(!f)return;if(!/^image\/(png|jpeg|webp)/.test(f.type)||f.size>12*1024*1024)return setError("Gunakan PNG/JPG/WebP maksimal 12 MB.");const r=new FileReader();r.onload=async ev=>{try{const im=await loadImage(ev.target.result);second?(setRaw2(im),setProduct2(im)):(setRaw1(im),setProduct(im));setError("")}catch{setError("Gambar gagal dibaca.")}};r.readAsDataURL(f)};
 const process=(raw,tol,setter)=>{if(!raw)return;setBusy("Menghapus background...");removeFlatBackground(raw,tol).then(setter).catch(()=>setter(raw)).finally(()=>setBusy(""))};
 const analyze=item=>{const nm=item===1?name:name2,r=analyzeProductLocal(nm);setCategory(r.category);if(item===1){setUnit(r.unit);if(mode==="1POP")setBenefits(r.benefits.join("\n"))}else setUnit2(r.unit);setNotice(r.confidence==="fallback"?"Produk belum ada di katalog; hasil kategori adalah saran lokal.":"Kategori, satuan, dan benefit terisi dari katalog lokal.")};
 const preset=(p,item)=>{if(item===1){setName(p.name);setCategory(p.category);setUnit(p.unit);if(mode==="1POP")setBenefits(p.benefits.join("\n"))}else{setName2(p.name);setCategory(p.category);setUnit2(p.unit)}};

 const pointer=ev=>{const r=canvas.current.getBoundingClientRect();return{x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*H/r.height}};
 const eligible=()=>Object.keys(els).filter(k=>mode==="1POP"?!/[12]$/.test(k):/[12]$/.test(k));
 const down=ev=>{const p=pointer(ev),key=eligible().sort((a,b)=>Math.hypot(p.x-els[a].x,p.y-els[a].y)-Math.hypot(p.x-els[b].x,p.y-els[b].y))[0];setActive(key);drag.current={key,dx:p.x-els[key].x,dy:p.y-els[key].y};canvas.current.setPointerCapture?.(ev.pointerId)};
 const move=ev=>{if(!drag.current)return;const p=pointer(ev),d=drag.current;setEls(s=>({...s,[d.key]:{...s[d.key],x:p.x-d.dx,y:p.y-d.dy}}))};
 const zoom=f=>active&&setEls(s=>({...s,[active]:{...s[active],s:Math.max(.3,Math.min(3,s[active].s*f))}}));
 const nudge=(dx,dy)=>active&&setEls(s=>({...s,[active]:{...s[active],x:s[active].x+dx,y:s[active].y+dy}}));

 const exportPng=()=>{setBusy("Menyiapkan PNG high-resolution...");const out=document.createElement("canvas");out.width=W*EXPORT_SCALE;out.height=H*EXPORT_SCALE;renderSnapshot(currentSnapshot(),out,EXPORT_SCALE,null);out.toBlob(blob=>{if(!blob){setBusy("");return setError("Export gagal.")}const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=cleanFile(`POP_${branch}_${category}_${mode}_${name}`)+".png";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);setBusy("")},"image/png",1)};
 const exportPdf=()=>{setBusy("Menyiapkan PDF A3...");try{const out=document.createElement("canvas");out.width=W*2;out.height=H*2;renderSnapshot(currentSnapshot(),out,2,null);const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a3",compress:true});pdf.addImage(out.toDataURL("image/jpeg",.96),"JPEG",0,0,297,420,undefined,"FAST");pdf.save(cleanFile(`POP_${branch}_${category}_${mode}_${name}`)+".pdf");setNotice("PDF A3 berhasil dibuat.")}catch(e){setError("PDF gagal dibuat.")}finally{setBusy("")}};
 const save=async()=>{setBusy("Menyimpan draft lengkap...");try{const row=saveDraft({branch,category,mode,name,name2,promo,promo2,normal,normal2,unit,unit2,period,benefits,badgeText,badgeColor,els:clone(els),tol1,tol2});await putImage(`${row.id}:1`,await imageToBlob(product));await putImage(`${row.id}:2`,await imageToBlob(product2));setDrafts(getDrafts());setNotice(`Draft "${row.name}" beserta foto tersimpan di perangkat.`)}catch{setError("Draft gagal disimpan di perangkat.")}finally{setBusy("")}};
 const restore=async d=>{setBusy("Membuka draft...");try{setBranch(d.branch);setCategory(d.category);setMode(d.mode);setName(d.name);setName2(d.name2||"");setPromo(d.promo);setPromo2(d.promo2||"");setNormal(d.normal);setNormal2(d.normal2||"");setUnit(d.unit);setUnit2(d.unit2||"/100g");setPeriod(d.period);setBenefits(d.benefits);setBadgeText(d.badgeText||"");setBadgeColor(d.badgeColor||"#17745a");setEls(d.els||INITIAL);setTol1(d.tol1||42);setTol2(d.tol2||42);const [b1,b2]=await Promise.all([getImage(`${d.id}:1`),getImage(`${d.id}:2`)]);const [i1,i2]=await Promise.all([blobToImage(b1),blobToImage(b2)]);setProduct(i1);setProduct2(i2);setRaw1(i1);setRaw2(i2);setShowHistory(false);setNotice("Draft lengkap berhasil dipulihkan.")}catch{setError("Draft gagal dipulihkan.")}finally{setBusy("")}};
 const removeDraft=async id=>{deleteDraft(id);await deleteImages(`${id}:`);setDrafts(getDrafts())};

 const addBatch=()=>{const row={...serialSnapshot(),id:crypto.randomUUID(),addedAt:new Date().toISOString()};setBatch(v=>[...v,row]);setNotice(`${name} ditambahkan ke antrean batch.`)};
 const exportBatchPdf=async()=>{if(!batch.length)return setError("Batch masih kosong.");setBusy(`Membuat PDF batch ${batch.length} halaman...`);try{const pdf=new jsPDF({orientation:"portrait",unit:"mm",format:"a3",compress:true});for(let i=0;i<batch.length;i++){if(i)pdf.addPage("a3","portrait");const s=await snapshotImages(batch[i]);const out=document.createElement("canvas");out.width=W*2;out.height=H*2;renderSnapshot(s,out,2,null);pdf.addImage(out.toDataURL("image/jpeg",.94),"JPEG",0,0,297,420,undefined,"FAST")}pdf.save(cleanFile(`POP_BATCH_${branch}_${new Date().toISOString().slice(0,10)}`)+".pdf");setNotice(`${batch.length} POP diekspor menjadi PDF A3 multi-halaman.`)}catch(e){setError("Export batch gagal. Pastikan seluruh template dapat dimuat.")}finally{setBusy("")}};


 const issues=validatePop(currentSnapshot());
 const doValidatedExport=kind=>{if(!canExport(issues))return;setShowPreflight(false);kind==="pdf"?exportPdf():exportPng()};
 const restoreRecovery=()=>{if(!recovery)return;setBranch(recovery.branch);setCategory(recovery.category);setMode(recovery.mode);setName(recovery.name);setName2(recovery.name2||"");setPromo(recovery.promo);setPromo2(recovery.promo2||"");setNormal(recovery.normal);setNormal2(recovery.normal2||"");setUnit(recovery.unit);setUnit2(recovery.unit2||"/100g");setPeriod(recovery.period);setBenefits(recovery.benefits);setBadgeText(recovery.badgeText||"");setBadgeColor(recovery.badgeColor||"#17745a");setEls(recovery.els||getLayoutPreset(recovery.category));setShowRecovery(false);setNotice("Autosave terakhir dipulihkan.")};
 const dismissRecovery=()=>{clearAutosave();setRecovery(null);setShowRecovery(false)};
 const reorder=(from,to)=>{if(from===null||to===null||from===to)return;setBatch(v=>{const n=[...v];const [m]=n.splice(from,1);n.splice(to,0,m);return n});setDragIndex(null)};
 const makeThumb=async row=>{try{const s=await snapshotImages(row);const c=document.createElement("canvas");c.width=216;c.height=306;renderSnapshot(s,c,.2,null);return c.toDataURL("image/jpeg",.75)}catch{return null}};
 const generateThumbs=async()=>{const next={};for(const b of batch){if(!thumbs[b.id])next[b.id]=await makeThumb(b)}if(Object.keys(next).length)setThumbs(t=>({...t,...next}))};
 const duplicateCurrent=()=>{const copy={...serialSnapshot(),id:crypto.randomUUID(),name:`${name} COPY`,addedAt:new Date().toISOString()};setBatch(v=>[...v,copy]);setNotice("POP diduplikasi ke Batch Queue.")};

 const applyPeriodPreset=val=>{setPeriodPreset(val);setPeriod(val.replace(" ","\n"));setNotice(`Periode ${val} diterapkan.`)};
 const importFile=async file=>{if(!file)return;setBusy("Membaca file CSV/Excel...");try{const rows=await parseTableFile(file);setImportRows(rows);setShowImport(true);setNotice(`${rows.filter(r=>r.valid).length} baris produk terbaca.`)}catch(e){setError("File CSV/Excel gagal dibaca.")}finally{setBusy("")}};
 const addImportedToBatch=()=>{const valid=importRows.filter(r=>r.valid);const mapped=valid.map(r=>{const tid=getTemplateId(r.branch,r.mode,r.category);return {...r,id:crypto.randomUUID(),addedAt:new Date().toISOString(),templateId:tid,els:clone(INITIAL),badgeColor:"#17745a",productData:null,productData2:null}});setBatch(v=>[...v,...mapped]);setShowImport(false);setNotice(`${mapped.length} POP dari tabel ditambahkan ke batch.`)};
 const downloadCsvTemplate=()=>{const blob=new Blob([createCsvTemplate()],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="template_import_pop.csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 const backupDrafts=async()=>{setBusy("Membuat backup draft...");try{const data=await exportBackup();const blob=new Blob([JSON.stringify(data)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`POP_Studio_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);setNotice("Backup draft berhasil dibuat.")}catch{setError("Backup draft gagal.")}finally{setBusy("")}};
 const restoreBackup=async file=>{if(!file)return;setBusy("Memulihkan backup...");try{const data=JSON.parse(await file.text());const count=await importBackup(data);setDrafts(getDrafts());setNotice(`${count} draft berhasil dipulihkan.`)}catch(e){setError(e.message||"Backup gagal dipulihkan.")}finally{setBusy("")}};
 const exportBatchPngZipNotice=()=>setNotice("Untuk batch, gunakan PDF multi-halaman agar lebih ringan di Android.");
 const applyTemplate=()=>{const key=templateOverrideKey(branch,mode,category);customTemplate.trim()?localStorage.setItem(key,customTemplate.trim()):localStorage.removeItem(key);setShowTemplates(false);location.reload()};


 return <main className="app">
  <aside className="rail">
   <header className="brand"><div><span className="eyebrow">STORE COMMUNICATION TOOL</span><h1>POP Studio</h1></div><div className="brandMeta"><span className="version">A3 / v2.5</span><InstallStatus/></div></header>
   <div className="quickActions operational"><button onClick={()=>setShowHistory(true)}><History size={15}/> Draft</button><button onClick={()=>setShowBatch(true)}><Layers3 size={15}/> Batch <em>{batch.length}</em></button><label className="quickFile"><FileSpreadsheet size={15}/> Import<input type="file" accept=".csv,.xlsx,.xls" onChange={e=>importFile(e.target.files?.[0])}/></label><button onClick={()=>setShowTemplates(true)}><Settings2 size={15}/> Template</button><button onClick={save}><Save size={15}/> Simpan</button><button onClick={duplicateCurrent}><Copy size={15}/> Duplikat</button></div>
   <section className="block"><label>FORMAT</label><div className="seg"><button className={mode==="1POP"?"on":""} onClick={()=>setMode("1POP")}>1 POP</button><button className={mode==="2POP"?"on":""} onClick={()=>setMode("2POP")}>2 POP</button></div></section>
   <section className="block"><div className="row"><label>CABANG</label><span>{branch}</span></div><div className="branches">{BRANCHES.map(b=><button key={b} className={b===branch?"selected":""} onClick={()=>setBranch(b)}>{b}</button>)}</div></section>
   <section className="block"><label>KATEGORI</label><div className="selectWrap"><select value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select><ChevronDown size={16}/></div></section><button className="layoutPresetBtn" onClick={()=>{setEls(getLayoutPreset(category));setNotice(`Preset posisi ${category} diterapkan.`)}}><Move size={14}/> Terapkan Preset Posisi Kategori</button><section className="block compact"><div className="row"><label>PRESET PERIODE</label><span>{periodPreset}</span></div><div className="periodPresets">{["01-15 AGUSTUS","16-31 AGUSTUS","01-15 SEPTEMBER","16-30 SEPTEMBER"].map(v=><button key={v} onClick={()=>applyPeriodPreset(v)}>{v}</button>)}</div></section>
   <ProductCard title={mode==="1POP"?"PRODUK":"ITEM 1 · ATAS"} name={name} setName={setName} promo={promo} setPromo={setPromo} normal={normal} setNormal={setNormal} unit={unit} setUnit={setUnit} upload={e=>upload(e,false)} raw={raw1} tolerance={tol1} setTolerance={setTol1} process={()=>process(raw1,tol1,setProduct)} analyze={()=>analyze(1)} applyPreset={p=>preset(p,1)}/>
   {mode==="1POP"?<section className="productCard muted"><Field label="Periode" value={period} set={setPeriod}/><label>BENEFIT · 1 BARIS PER POIN</label><textarea rows="4" value={benefits} onChange={e=>setBenefits(e.target.value)}/><div className="two"><Field label="Badge" value={badgeText} set={setBadgeText}/><label className="field"><span>Warna badge</span><input type="color" value={badgeColor} onChange={e=>setBadgeColor(e.target.value)}/></label></div></section>:<ProductCard title="ITEM 2 · BAWAH" name={name2} setName={setName2} promo={promo2} setPromo={setPromo2} normal={normal2} setNormal={setNormal2} unit={unit2} setUnit={setUnit2} upload={e=>upload(e,true)} raw={raw2} tolerance={tol2} setTolerance={setTol2} process={()=>process(raw2,tol2,setProduct2)} analyze={()=>analyze(2)} applyPreset={p=>preset(p,2)}/>}
   <button className="batchAdd" onClick={addBatch}><Archive size={16}/> Tambahkan POP ke Batch</button>
   {(error||notice||busy)&&<div className={`message ${error?"error":busy?"busy":"notice"}`}>{error||busy||notice}</div>}
   <div className="exportGrid"><button className="export secondary" onClick={()=>setShowPreflight("pdf")} disabled={!!busy}><FileText size={17}/> PDF A3</button><button className="export" onClick={()=>setShowPreflight("png")} disabled={!!busy}><Download size={17}/> PNG HIGH-RES</button></div>
  </aside>
  <section className="workspace">
   <div className="topbar"><div><span className="crumb">POP / {branch} / {category}</span><b>{mode==="1POP"?"Single Product":"Split Product"}</b></div><div className="tools"><button onClick={()=>setEls(INITIAL)}><RotateCcw size={16}/></button><button onClick={()=>zoom(.92)}><Minus size={16}/></button><button onClick={()=>zoom(1.08)}><Plus size={16}/></button></div></div>
   <div className="stage"><div className="paper"><canvas ref={canvas} width={W} height={H} onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null}/></div></div>
   <div className="finebar"><span><Move size={14}/> {active}</span><button onClick={()=>nudge(0,-5)}>↑</button><button onClick={()=>nudge(-5,0)}>←</button><button onClick={()=>nudge(5,0)}>→</button><button onClick={()=>nudge(0,5)}>↓</button><button onClick={()=>zoom(.96)}>−</button><button onClick={()=>zoom(1.04)}>+</button><span className="templateCode">{templateId.slice(0,11)}…</span></div>
  </section>
  {showHistory&&<Modal title="Draft lengkap di perangkat" close={()=>setShowHistory(false)}><div className="historyTools"><button onClick={backupDrafts}><Download size={15}/> Backup JSON</button><label><Upload size={15}/> Restore<input type="file" accept=".json,application/json" onChange={e=>restoreBackup(e.target.files?.[0])}/></label></div><div className="draftList">{drafts.length?drafts.map(d=><div className="draftRow" key={d.id}><button className="draftMain" onClick={()=>restore(d)}><b>{d.name}</b><span>{d.branch} · {d.category} · {d.mode} · foto tersimpan</span></button><button className="trash" onClick={()=>removeDraft(d.id)}><Trash2 size={16}/></button></div>):<div className="empty">Belum ada draft.</div>}</div></Modal>}
  {showTemplates&&<Modal title="Template Manager" close={()=>setShowTemplates(false)}><p className="modalText">Override disimpan lokal untuk kombinasi cabang, kategori, dan format ini.</p><div className="templateSummary"><b>{branch} · {category} · {mode}</b><span>Standar: {standardId}</span></div><Field label="Google Drive File ID override" value={customTemplate} set={setCustomTemplate}/><button className="primary" onClick={applyTemplate}>Simpan template</button></Modal>}
  {showBatch&&<Modal title={`Batch Queue · ${batch.length} POP`} close={()=>setShowBatch(false)}><p className="modalText">Setiap item akan menjadi satu halaman A3 pada PDF. Foto produk disimpan di antrean sesi ini.</p><div className="batchList">{batch.map((b,i)=><div className="batchRow draggable" key={b.id} draggable onDragStart={()=>setDragIndex(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>reorder(dragIndex,i)}><GripVertical size={15}/><span>{String(i+1).padStart(2,"0")}</span><div><b>{b.name}</b><small>{b.branch} · {b.category} · {b.mode}</small></div><button onClick={()=>setBatch(v=>v.filter(x=>x.id!==b.id))}><X size={15}/></button></div>)}</div><div className="modalActions"><button className="primary ghost" disabled={!batch.length} onClick={()=>{setShowBatch(false);setShowPreview(true);generateThumbs()}}><Eye size={15}/> Preview Semua</button><button className="primary" disabled={!batch.length} onClick={exportBatchPdf}>Export PDF A3 Multi-Halaman</button></div></Modal>}
  {showImport&&<Modal title={`Import Produk · ${importRows.length} baris`} close={()=>setShowImport(false)}><div className="importToolbar"><button onClick={downloadCsvTemplate}><FileDown size={15}/> Unduh template CSV</button><span>{importRows.filter(r=>r.valid).length} valid · {importRows.filter(r=>!r.valid).length} perlu diperiksa</span></div><div className="importTable"><table><thead><tr><th>Baris</th><th>Produk</th><th>Cabang</th><th>Kategori</th><th>Promo</th><th>Status</th></tr></thead><tbody>{importRows.slice(0,100).map(r=><tr key={r.sourceRow}><td>{r.sourceRow}</td><td>{r.name||"—"}</td><td>{r.branch}</td><td>{r.category}</td><td>{r.promo}</td><td><span className={r.valid?"ok":"bad"}>{r.valid?"OK":"Nama kosong"}</span></td></tr>)}</tbody></table></div><button className="primary" onClick={addImportedToBatch} disabled={!importRows.some(r=>r.valid)}>Tambahkan Baris Valid ke Batch</button></Modal>}
  {showPreview&&<Modal title={`Preview Batch · ${batch.length} halaman`} close={()=>setShowPreview(false)}><div className="previewGrid visual">{batch.map((b,i)=><div className="previewCard visual" key={b.id}><div className="thumb">{thumbs[b.id]?<img src={thumbs[b.id]}/>:<div className="thumbLoading">PREVIEW</div>}<span>{i+1}</span></div><div><b>{b.name}</b><span>{b.branch} · {b.category} · {b.mode}</span><small>Rp {b.promo} {b.unit}</small></div></div>)}</div><div className="modalActions"><button className="primary ghost" onClick={()=>setShowPreview(false)}>Kembali Edit Batch</button><button className="primary" onClick={exportBatchPdf}>Cetak PDF A3</button></div></Modal>}

  {showPreflight&&<Modal title="Pre-Print Check" close={()=>setShowPreflight(false)}><div className="preflightSummary"><ShieldCheck size={30}/><div><b>{canExport(issues)?"Siap diexport":"Perlu diperbaiki"}</b><span>{issues.filter(i=>i.level==="error").length} error · {issues.filter(i=>i.level==="warning").length} warning</span></div></div><div className="issueList">{issues.length?issues.map((i,k)=><div className={`issue ${i.level}`} key={k}><AlertTriangle size={15}/><span>{i.message}</span></div>):<div className="issue ok"><ShieldCheck size={15}/><span>Tidak ada masalah terdeteksi.</span></div>}</div><button className="primary" disabled={!canExport(issues)} onClick={()=>doValidatedExport(showPreflight)}>{showPreflight==="pdf"?"Export PDF A3":"Export PNG High-Res"}</button></Modal>}
  {showRecovery&&<Modal title="Pulihkan pekerjaan terakhir?" close={dismissRecovery}><p className="modalText">Ditemukan autosave dari {recovery?.savedAt?new Date(recovery.savedAt).toLocaleString("id-ID"):"sesi sebelumnya"}. Foto produk tidak termasuk autosave otomatis.</p><div className="modalActions"><button className="primary ghost" onClick={dismissRecovery}>Abaikan</button><button className="primary" onClick={restoreRecovery}>Pulihkan Autosave</button></div></Modal>}

 </main>
}
function ProductCard({title,name,setName,promo,setPromo,normal,setNormal,unit,setUnit,upload,raw,tolerance,setTolerance,process,analyze,applyPreset}){
 const[query,setQuery]=useState("");
 const suggestions=PRODUCT_PRESETS.filter(p=>!query||p.name.toLowerCase().includes(query.toLowerCase())||p.keywords.some(k=>k.includes(query.toLowerCase()))).slice(0,8);
 return <section className="productCard"><div className="cardHead"><b>{title}</b><span>CATALOG READY</span></div><label className="field"><span>Nama produk / cari katalog</span><input value={name} onFocus={()=>setQuery(name)} onChange={e=>{setName(e.target.value);setQuery(e.target.value)}}/></label>{query&&<div className="catalogSuggestions">{suggestions.map(p=><button key={p.name} onClick={()=>{applyPreset(p);setQuery("")}}><b>{p.name}</b><span>{p.category} · {p.unit}</span></button>)}</div>}<div className="two"><Field label="Harga promo" value={promo} set={setPromo}/><Field label="Harga normal" value={normal} set={setNormal}/></div><Field label="Satuan" value={unit} set={setUnit}/><div className="mediaActions noAI"><label className="upload"><Upload size={15}/> Upload foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload}/></label><button onClick={analyze}><SlidersHorizontal size={15}/> Auto isi lokal</button></div>{raw&&<div className="bgTool"><div className="row"><label>HAPUS LATAR</label><span>{tolerance}</span></div><input type="range" min="0" max="150" value={tolerance} onChange={e=>setTolerance(+e.target.value)}/><button onClick={process}>Terapkan background removal</button></div>}</section>
}
function Field({label,value,set}){const money=/harga/i.test(label);return <label className="field"><span>{label}</span><input inputMode={money?"numeric":undefined} value={value} onChange={e=>set(money?formatRupiahInput(e.target.value):e.target.value)}/></label>}
function Modal({title,close,children}){return <div className="modalBackdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modalHead"><h2>{title}</h2><button onClick={close}><X size={18}/></button></div>{children}</div></div>}
