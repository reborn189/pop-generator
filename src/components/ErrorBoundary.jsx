import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false,message:""}}
  static getDerivedStateFromError(error){return{hasError:true,message:error?.message||"Aplikasi mengalami error."}}
  componentDidCatch(error,info){console.error("POP Studio fatal error",error,info)}
  reset=()=>{try{sessionStorage.removeItem("pop-studio-crash")}catch{};window.location.reload()}
  render(){
    if(!this.state.hasError)return this.props.children;
    return <main className="fatalShell"><section className="fatalCard"><span className="fatalEyebrow">POP STUDIO · RECOVERY</span><h1>Aplikasi tidak dapat melanjutkan.</h1><p>{this.state.message}</p><p className="fatalHint">Data draft yang sudah disimpan tetap berada di perangkat. Muat ulang aplikasi untuk mencoba memulihkan editor.</p><button onClick={this.reset}>Muat Ulang POP Studio</button></section></main>
  }
}
