export interface ColorData {
  r: number;
  g: number;
  b: number;
  hex: string;
  h: number;
  s: number;
  l: number;
  name: string;
}

const COLOR_NAMES: [number, number, number, string][] = [
  [255,0,0,'Red'],[255,128,0,'Orange'],[255,255,0,'Orange'],
  [128,255,0,'Lime'],[0,255,0,'Green'],[0,255,128,'Spring Green'],
  [0,255,255,'Cyan'],[0,128,255,'Azure'],[0,0,255,'Blue'],
  [128,0,255,'Violet'],[255,0,255,'Magenta'],[255,0,128,'Rose'],
  [255,255,255,'White'],[0,0,0,'Black'],[128,128,128,'Gray'],
  [192,192,192,'Silver'],[128,64,0,'Brown'],[255,200,150,'Peach'],
  [255,150,150,'Salmon'],[150,200,255,'Sky Blue'],[200,150,255,'Lavender'],
  [150,255,200,'Mint'],[255,230,150,'Cream'],[100,50,50,'Maroon'],
  [50,100,50,'Dark Green'],[50,50,100,'Navy'],[200,100,50,'Sienna'],
  [230,190,100,'Gold'],[180,140,100,'Tan']
];

export function nearestColorName(r: number, g: number, b: number): string {
  let minDist = Infinity, name = 'Unknown';
  for (const [cr, cg, cb, cn] of COLOR_NAMES) {
    const d = Math.sqrt((r-cr)**2 + (g-cg)**2 + (b-cb)**2);
    if (d < minDist) { minDist = d; name = cn as string; }
  }
  return name;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  let rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
  let h = 0, s = 0, l = (max+min)/2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case rn: h = ((gn-bn)/d + (gn<bn?6:0))/6; break;
      case gn: h = ((bn-rn)/d + 2)/6; break;
      case bn: h = ((rn-gn)/d + 4)/6; break;
    }
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}
