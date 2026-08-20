
export default async (req) => {
  const u = new URL(req.url);
  const id = (u.searchParams.get("id") || "").trim();
  if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) return new Response("Invalid template id",{status:400});
  const candidates = [
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2400`,
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=view&confirm=t`
  ];
  for (const url of candidates) {
    try {
      const r = await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(12000)});
      const type=r.headers.get("content-type")||"";
      if(r.ok && type.startsWith("image/")){
        return new Response(await r.arrayBuffer(),{
          status:200,
          headers:{
            "Content-Type":type,
            "Cache-Control":"public, max-age=3600, s-maxage=86400",
            "Access-Control-Allow-Origin":"*"
          }
        });
      }
    } catch {}
  }
  return new Response("Template image unavailable",{status:502});
};
