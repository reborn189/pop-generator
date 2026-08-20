
export const BASE_LAYOUT={
 title:{x:530,y:500,s:1},image:{x:650,y:832,s:.83},period:{x:178,y:911,s:.89},benefits:{x:36,y:1163,s:.85},price:{x:688,y:1372,s:.65},normal:{x:907,y:1197,s:.83},unit:{x:923,y:1375,s:.8},badge:{x:540,y:220,s:1},
 title1:{x:800,y:590,s:.6},image1:{x:280,y:700,s:.95},price1:{x:790,y:830,s:.72},normal1:{x:955,y:700,s:1.24},unit1:{x:1022,y:845,s:.88},
 title2:{x:800,y:1125,s:.6},image2:{x:280,y:1180,s:.95},price2:{x:790,y:1350,s:.72},normal2:{x:955,y:1220,s:1.24},unit2:{x:1022,y:1360,s:.88}
};
const shift=(src,dy=0,dx=0)=>Object.fromEntries(Object.entries(src).map(([k,v])=>[k,{...v,x:v.x+dx,y:v.y+dy}]));
export const LAYOUT_PRESETS={
 "Fruit/Veg":BASE_LAYOUT,
 Meat:shift(BASE_LAYOUT,-38,0),
 Poultry:shift(BASE_LAYOUT,-18,0),
 Fishery:shift(BASE_LAYOUT,-8,0)
};
export function getLayoutPreset(category){return JSON.parse(JSON.stringify(LAYOUT_PRESETS[category]||BASE_LAYOUT))}
