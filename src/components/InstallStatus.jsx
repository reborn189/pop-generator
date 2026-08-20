import React,{useEffect,useState}from"react";
export default function InstallStatus(){
 const[online,setOnline]=useState(()=>navigator.onLine);
 useEffect(()=>{const on=()=>setOnline(true),off=()=>setOnline(false);window.addEventListener("online",on);window.addEventListener("offline",off);return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off)}},[]);
 return <div className={`networkPill ${online?"online":"offline"}`}><i/>{online?"ONLINE":"OFFLINE"}</div>
}
