
const DB_NAME="pop-studio-v22", STORE="images";
function db(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE)};
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
export async function putImage(key,blob){
  if(!blob)return; const d=await db();
  return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readwrite");tx.objectStore(STORE).put(blob,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
}
export async function getImage(key){
  const d=await db();
  return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readonly");const r=tx.objectStore(STORE).get(key);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});
}
export async function deleteImages(prefix){
  const d=await db();
  return new Promise((resolve,reject)=>{const tx=d.transaction(STORE,"readwrite"),s=tx.objectStore(STORE);const r=s.openCursor();r.onsuccess=()=>{const c=r.result;if(!c)return;if(String(c.key).startsWith(prefix))c.delete();c.continue()};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
}
export async function imageToBlob(img){
  if(!img)return null;
  const c=document.createElement("canvas");c.width=img.naturalWidth||img.width;c.height=img.naturalHeight||img.height;
  c.getContext("2d").drawImage(img,0,0);
  return new Promise(resolve=>c.toBlob(resolve,"image/png",.95));
}
export async function blobToImage(blob){
  if(!blob)return null; const url=URL.createObjectURL(blob); const img=new Image();
  return new Promise((resolve,reject)=>{img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=e=>{URL.revokeObjectURL(url);reject(e)};img.src=url});
}
export function imageToDataURL(img){
  if(!img)return null; const c=document.createElement("canvas");c.width=img.naturalWidth||img.width;c.height=img.naturalHeight||img.height;c.getContext("2d").drawImage(img,0,0);return c.toDataURL("image/png",.92);
}
