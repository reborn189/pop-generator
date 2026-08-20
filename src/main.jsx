import React from "react";
import{createRoot}from"react-dom/client";
import App from"./App.jsx";
import ErrorBoundary from"./components/ErrorBoundary.jsx";
import"./styles.css";

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(err=>console.warn("Service worker registration failed",err)));
}

createRoot(document.getElementById("root")).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);
