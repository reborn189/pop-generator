
export const onlyDigits = v => String(v ?? "").replace(/[^\d]/g,"");
export const formatRupiahInput = v => {
  const d=onlyDigits(v);
  return d ? Number(d).toLocaleString("id-ID") : "";
};
export function validatePop(s){
  const issues=[];
  if(!s.name?.trim()) issues.push({level:"error",field:"name",message:"Nama produk wajib diisi."});
  if(!onlyDigits(s.promo)) issues.push({level:"error",field:"promo",message:"Harga promo harus berisi angka."});
  if(!s.unit?.trim()) issues.push({level:"warning",field:"unit",message:"Satuan belum diisi."});
  if(s.mode==="2POP"){
    if(!s.name2?.trim()) issues.push({level:"error",field:"name2",message:"Nama produk item 2 wajib diisi."});
    if(!onlyDigits(s.promo2)) issues.push({level:"error",field:"promo2",message:"Harga promo item 2 harus berisi angka."});
  }
  if(s.mode==="1POP" && !s.period?.trim()) issues.push({level:"warning",field:"period",message:"Periode promo belum diisi."});
  if(!s.baseImg) issues.push({level:"error",field:"template",message:"Template tidak berhasil dimuat."});
  if(!s.productImg) issues.push({level:"warning",field:"image",message:"Foto produk item 1 belum ada."});
  if(s.mode==="2POP" && !s.productImg2) issues.push({level:"warning",field:"image2",message:"Foto produk item 2 belum ada."});
  return issues;
}
export function canExport(issues){ return !issues.some(i=>i.level==="error"); }
