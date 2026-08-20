
import * as XLSX from "xlsx";
import { analyzeProductLocal } from "./productRules.js";

const norm = (v) => String(v ?? "").trim();
const price = (v) => norm(v).replace(/[^\d.,]/g,"");
const pick = (row, names) => {
  const keys=Object.keys(row);
  const key=keys.find(k=>names.includes(k.toLowerCase().trim()));
  return key ? row[key] : "";
};

export async function parseTableFile(file){
  const buf=await file.arrayBuffer();
  const wb=XLSX.read(buf,{type:"array"});
  const ws=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(ws,{defval:""});
  return rows.map((row,index)=>{
    const name=norm(pick(row,["nama produk","produk","product","product name","nama"]));
    const inferred=analyzeProductLocal(name);
    const category=norm(pick(row,["kategori","category"])) || inferred.category;
    const branch=norm(pick(row,["cabang","branch"])) || "CMS";
    const modeRaw=norm(pick(row,["mode","format","layout"])).toUpperCase();
    const mode=modeRaw.includes("2") ? "2POP" : "1POP";
    const promo=price(pick(row,["harga promo","promo","promo price","harga jual","selling price"]));
    const normal=price(pick(row,["harga normal","normal","normal price","harga coret","regular price"]));
    const unit=norm(pick(row,["satuan","unit"])) || inferred.unit;
    const period=norm(pick(row,["periode","period"]));
    const badgeText=norm(pick(row,["badge","label","tag"]));
    return {
      sourceRow:index+2,
      valid:!!name,
      branch,category,mode,name,
      name2: norm(pick(row,["nama produk 2","produk 2","product 2"])),
      promo: promo || "0",
      promo2: price(pick(row,["harga promo 2","promo 2"])) || "0",
      normal: normal || "",
      normal2: price(pick(row,["harga normal 2","normal 2"])) || "",
      unit,
      unit2: norm(pick(row,["satuan 2","unit 2"])) || "/100g",
      period,
      benefits: inferred.benefits.join("\n"),
      badgeText
    };
  });
}

export function createCsvTemplate(){
  const rows=[
    ["Cabang","Kategori","Mode","Nama Produk","Harga Promo","Harga Normal","Satuan","Periode","Badge"],
    ["CMS","Fruit/Veg","1POP","Sweet Pear","2990","3895","/kg","01-15 AGUSTUS","PROMO"],
    ["BJR","Fishery","1POP","Salmon Fillet","12900","15900","/100g","01-15 AGUSTUS",""]
  ];
  return rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
}
