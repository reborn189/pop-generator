
export async function removeFlatBackground(image, tolerance = 42) {
  const max = 1200;
  const ratio = Math.min(1, max / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const w = Math.max(1, Math.round((image.naturalWidth || image.width) * ratio));
  const h = Math.max(1, Math.round((image.naturalHeight || image.height) * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, w, h);
  const frame = ctx.getImageData(0, 0, w, h);
  const d = frame.data;

  const corners = [
    0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + w - 1) * 4
  ];
  let tr=0,tg=0,tb=0;
  for (const i of corners) { tr += d[i]; tg += d[i+1]; tb += d[i+2]; }
  tr/=4; tg/=4; tb/=4;

  const visited = new Uint8Array(w*h);
  const q = new Int32Array(w*h);
  let head=0, tail=0;
  const add=(x,y)=>{
    if(x<0||y<0||x>=w||y>=h)return;
    const k=y*w+x;
    if(!visited[k]){visited[k]=1;q[tail++]=k}
  };
  for(let x=0;x<w;x++){add(x,0);add(x,h-1)}
  for(let y=0;y<h;y++){add(0,y);add(w-1,y)}

  while(head<tail){
    const k=q[head++], x=k%w, y=(k/w)|0, i=k*4;
    const dr=d[i]-tr,dg=d[i+1]-tg,db=d[i+2]-tb;
    if(Math.sqrt(dr*dr+dg*dg+db*db)<=tolerance){
      d[i+3]=0;
      add(x+1,y);add(x-1,y);add(x,y+1);add(x,y-1);
    }
  }
  ctx.putImageData(frame,0,0);
  const out = new Image();
  await new Promise((resolve,reject)=>{out.onload=resolve;out.onerror=reject;out.src=canvas.toDataURL("image/png")});
  return out;
}
