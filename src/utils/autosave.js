
const KEY="pop-studio-autosave-v24";
export function saveAutosave(payload){try{localStorage.setItem(KEY,JSON.stringify({...payload,savedAt:new Date().toISOString()}))}catch{}}
export function getAutosave(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}}
export function clearAutosave(){localStorage.removeItem(KEY)}
