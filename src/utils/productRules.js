
const P = (name, category, unit, benefits, keywords=[]) => ({name,category,unit,benefits,keywords});
export const PRODUCT_PRESETS = [
P("Sweet Pear","Fruit/Veg","/kg",["Manis dan renyah","Sumber serat","Segar setiap hari","Praktis dikonsumsi"],["pear","pir"]),
P("Apel Dazzle","Fruit/Veg","/kg",["Renyah dan segar","Sumber serat","Praktis dikonsumsi","Cocok untuk keluarga"],["apel","apple"]),
P("Apel Fuji","Fruit/Veg","/kg",["Manis dan renyah","Sumber serat","Segar setiap hari","Pilihan keluarga"],["fuji"]),
P("Jeruk Mandarin","Fruit/Veg","/kg",["Segar dan juicy","Sumber vitamin C","Praktis dikonsumsi","Pilihan keluarga"],["jeruk","mandarin","orange"]),
P("Anggur Merah","Fruit/Veg","/kg",["Manis dan segar","Praktis dikonsumsi","Cocok untuk camilan","Pilihan berkualitas"],["anggur","grape"]),
P("Pisang Cavendish","Fruit/Veg","/kg",["Manis alami","Praktis dikonsumsi","Cocok untuk camilan","Pilihan keluarga"],["pisang","banana"]),
P("Mangga Harum Manis","Fruit/Veg","/kg",["Manis dan harum","Segar setiap hari","Praktis dikonsumsi","Pilihan keluarga"],["mangga","mango"]),
P("Semangka Merah","Fruit/Veg","/kg",["Segar dan juicy","Cocok dinikmati dingin","Pilihan keluarga","Segar setiap hari"],["semangka","watermelon"]),
P("Melon","Fruit/Veg","/kg",["Manis dan segar","Tekstur renyah","Praktis disajikan","Pilihan keluarga"],["melon"]),
P("Pepaya","Fruit/Veg","/kg",["Manis dan lembut","Praktis dikonsumsi","Segar setiap hari","Pilihan keluarga"],["pepaya","papaya"]),
P("Alpukat","Fruit/Veg","/kg",["Tekstur lembut","Cocok aneka sajian","Pilihan berkualitas","Segar setiap hari"],["alpukat","avocado"]),
P("Strawberry","Fruit/Veg","/pack",["Manis dan segar","Cocok untuk camilan","Praktis disajikan","Pilihan berkualitas"],["strawberry","stroberi"]),
P("Kelengkeng","Fruit/Veg","/kg",["Manis dan juicy","Praktis dikonsumsi","Cocok untuk camilan","Segar setiap hari"],["kelengkeng","lengkeng"]),
P("Rambutan","Fruit/Veg","/kg",["Manis dan segar","Praktis dikonsumsi","Pilihan keluarga","Segar setiap hari"],["rambutan"]),
P("Brokoli","Fruit/Veg","/kg",["Segar setiap hari","Praktis dimasak","Cocok aneka masakan","Pilihan berkualitas"],["brokoli","broccoli"]),
P("Wortel","Fruit/Veg","/kg",["Segar dan renyah","Praktis dimasak","Cocok aneka masakan","Pilihan keluarga"],["wortel","carrot"]),
P("Tomat","Fruit/Veg","/kg",["Segar setiap hari","Cocok aneka masakan","Praktis digunakan","Pilihan keluarga"],["tomat","tomato"]),
P("Kentang","Fruit/Veg","/kg",["Praktis dimasak","Cocok aneka masakan","Pilihan keluarga","Kualitas terjaga"],["kentang","potato"]),
P("Cabai Merah","Fruit/Veg","/kg",["Segar setiap hari","Cocok aneka masakan","Warna cerah alami","Pilihan berkualitas"],["cabai","chili"]),
P("Bawang Merah","Fruit/Veg","/kg",["Cocok aneka masakan","Praktis digunakan","Kualitas terjaga","Pilihan dapur"],["bawang merah"]),
P("Salmon Fillet","Fishery","/100g",["Sumber protein","Tekstur lembut","Segar dan berkualitas","Cocok aneka masakan"],["salmon"]),
P("Tuna Steak","Fishery","/100g",["Sumber protein","Tekstur padat","Segar dan berkualitas","Cocok aneka masakan"],["tuna"]),
P("Udang Vaname","Fishery","/100g",["Sumber protein","Segar dan berkualitas","Praktis diolah","Cocok aneka masakan"],["udang","shrimp"]),
P("Cumi Segar","Fishery","/100g",["Segar dan berkualitas","Praktis diolah","Cocok aneka masakan","Pilihan keluarga"],["cumi","squid"]),
P("Ikan Gurame","Fishery","/kg",["Segar dan berkualitas","Sumber protein","Cocok aneka masakan","Pilihan keluarga"],["gurame"]),
P("Ikan Nila","Fishery","/kg",["Segar setiap hari","Sumber protein","Cocok aneka masakan","Pilihan keluarga"],["nila"]),
P("Ikan Kembung","Fishery","/kg",["Segar dan berkualitas","Sumber protein","Praktis diolah","Pilihan keluarga"],["kembung"]),
P("Ikan Dori Fillet","Fishery","/100g",["Tekstur lembut","Praktis diolah","Sumber protein","Cocok aneka masakan"],["dori"]),
P("Daging Sapi","Meat","/100g",["Sumber protein","Tekstur berkualitas","Cocok aneka masakan","Pilihan keluarga"],["daging sapi","beef","sapi"]),
P("Sirloin Beef","Meat","/100g",["Potongan premium","Tekstur berkualitas","Cocok untuk steak","Pilihan istimewa"],["sirloin"]),
P("Tenderloin Beef","Meat","/100g",["Tekstur lembut","Potongan premium","Cocok untuk steak","Pilihan istimewa"],["tenderloin"]),
P("Iga Sapi","Meat","/100g",["Potongan berkualitas","Cocok aneka masakan","Sumber protein","Pilihan keluarga"],["iga","rib"]),
P("Buntut Sapi","Meat","/100g",["Potongan berkualitas","Cocok untuk sup","Sumber protein","Pilihan keluarga"],["buntut","oxtail"]),
P("Daging Rendang","Meat","/100g",["Potongan pilihan","Cocok untuk rendang","Tekstur berkualitas","Pilihan keluarga"],["rendang"]),
P("Ayam Broiler","Poultry","/kg",["Sumber protein","Segar setiap hari","Praktis untuk dimasak","Cocok aneka masakan"],["ayam","chicken"]),
P("Dada Ayam Fillet","Poultry","/100g",["Sumber protein","Praktis diolah","Tanpa tulang","Cocok aneka masakan"],["dada ayam","fillet ayam"]),
P("Paha Ayam","Poultry","/kg",["Segar setiap hari","Sumber protein","Cocok aneka masakan","Pilihan keluarga"],["paha ayam"]),
P("Sayap Ayam","Poultry","/kg",["Segar setiap hari","Praktis diolah","Cocok aneka masakan","Pilihan keluarga"],["sayap ayam"]),
P("Ceker Ayam","Poultry","/kg",["Segar setiap hari","Cocok aneka masakan","Praktis diolah","Pilihan keluarga"],["ceker"])
];

export function analyzeProductLocal(name){
  const value=(name||"").trim().toLowerCase();
  const exact=PRODUCT_PRESETS.find(p=>p.name.toLowerCase()===value);
  if(exact) return {...exact,confidence:"preset"};
  const hit=PRODUCT_PRESETS.find(p=>p.keywords.some(k=>value.includes(k.toLowerCase())));
  if(hit) return {...hit,confidence:"keyword"};
  const generic = value.match(/ikan|udang|cumi|seafood/) ? "Fishery" :
    value.match(/ayam|chicken/) ? "Poultry" :
    value.match(/sapi|daging|beef|sirloin|tenderloin|iga|buntut/) ? "Meat" : "Fruit/Veg";
  const defaults={
    "Fruit/Veg":["Segar setiap hari","Pilihan berkualitas","Praktis dikonsumsi","Cocok untuk keluarga"],
    Fishery:["Sumber protein","Segar dan berkualitas","Praktis diolah","Cocok aneka masakan"],
    Meat:["Sumber protein","Tekstur berkualitas","Cocok aneka masakan","Pilihan keluarga"],
    Poultry:["Sumber protein","Segar setiap hari","Praktis untuk dimasak","Pilihan keluarga"]
  };
  return {name,category:generic,unit:generic==="Fruit/Veg"?"/kg":"/100g",benefits:defaults[generic],confidence:"fallback"};
}
