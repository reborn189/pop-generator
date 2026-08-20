
const KEY="pop-studio-drafts-v22";
export function getDrafts(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
export function saveDraft(payload){
  const drafts=getDrafts(), id=payload.id||crypto.randomUUID();
  const row={...payload,id,updatedAt:new Date().toISOString(),hasImages:true};
  localStorage.setItem(KEY,JSON.stringify([row,...drafts.filter(d=>d.id!==id)].slice(0,30)));
  return row;
}
export function deleteDraft(id){localStorage.setItem(KEY,JSON.stringify(getDrafts().filter(d=>d.id!==id)))}
