
import { getDrafts } from "./drafts.js";
import { getImage, putImage } from "./imageStore.js";

const blobToDataUrl = blob => new Promise((resolve,reject)=>{
  if(!blob)return resolve(null);
  const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);
});
const dataUrlToBlob = async s => s ? await (await fetch(s)).blob() : null;

export async function exportBackup(){
  const drafts=getDrafts();
  const enriched=[];
  for(const d of drafts){
    const [i1,i2]=await Promise.all([getImage(`${d.id}:1`),getImage(`${d.id}:2`)]);
    enriched.push({...d,image1:await blobToDataUrl(i1),image2:await blobToDataUrl(i2)});
  }
  return {
    type:"POP_STUDIO_BACKUP",
    version:"2.3",
    exportedAt:new Date().toISOString(),
    drafts:enriched
  };
}

export async function importBackup(payload){
  if(payload?.type!=="POP_STUDIO_BACKUP"||!Array.isArray(payload.drafts)) throw new Error("Format backup tidak dikenali.");
  const meta=[];
  for(const d of payload.drafts){
    const {image1,image2,...rest}=d;
    meta.push(rest);
    if(image1) await putImage(`${rest.id}:1`,await dataUrlToBlob(image1));
    if(image2) await putImage(`${rest.id}:2`,await dataUrlToBlob(image2));
  }
  localStorage.setItem("pop-studio-drafts-v22",JSON.stringify(meta.slice(0,30)));
  return meta.length;
}
