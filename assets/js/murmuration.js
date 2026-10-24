/* Distant birds follow invisible guides within a shifting, dense flock. */
(() => {
  const host=document.querySelector('[data-murmuration]');
  if (!host) return;
  const svg=host.querySelector('svg');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const ns='http://www.w3.org/2000/svg';
  let seed=72;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  // Exact contours from Wikimedia Commons File:Hammer and sickle.svg.
  // Source and public-domain notice are recorded in assets/images/SOURCES.md.
  const sourceContours=["m 157.54301,922.36336 -16.97149,16.9707 -45.256019,45.2539 -56.570993,56.57034 62.227502,62.2246 56.571,-56.5684 299.82842,299.8124 a 32.001491,31.999993 0 0 0 45.25601,0 32.001491,31.999993 0 0 0 0,-45.2539 l -299.82646,-299.8143 16.9715,-16.97074 50.91448,-50.91015 z", "m 255.989,844.0001 c 0,0 168.00781,127.99997 168.00783,256 C 423.99684,1164 367.99425,1236 271.98975,1236 c -64.00296,0 -104.24119,-47.7637 -104.24119,-47.7637 l -11.31302,11.3125 a 16.000745,15.999996 0 0 0 -22.62801,0 16.000745,15.999996 0 0 0 -2.47863,3.2227 32.001491,31.999993 0 0 0 -31.464359,8.0918 32.001491,31.999993 0 0 0 -9.330512,21.5449 C 65.101725,1246.1605 22.969246,1272.9834 4.2643862,1308 l 0.029298,0.029 A 32.001491,31.999993 0 0 0 4.2643862,1340 32.001491,31.999993 0 0 0 47.979313,1351.7129 c 35.025561,-18.708 61.854737,-60.8518 75.605087,-86.2813 a 32.001491,31.999993 0 0 0 21.53616,-9.3144 32.001491,31.999993 0 0 0 7.93201,-13.2012 c 24.51647,23.0544 71.44493,57.084 134.93792,57.084 96.00451,0 200.00932,-72 200.00932,-199.9999 0,-160.00002 -232.01081,-256 -232.01081,-256 z"];
  function track(points){
    const lengths=[0];
    for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
    return {points,lengths,total:lengths[lengths.length-1]};
  }
  const guides=document.createElementNS(ns,'g');
  guides.setAttribute('fill','none');
  guides.setAttribute('stroke','#b04a35');
  guides.setAttribute('stroke-width','1.6');
  guides.setAttribute('stroke-dasharray','5 4');
  guides.setAttribute('opacity','.9');
  guides.setAttribute('aria-hidden','true');
  svg.appendChild(guides);
  const routes=sourceContours.map(d=>{
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',d);
    path.setAttribute('transform','translate(145 35) scale(.5) translate(18 -824.0001)');
    path.setAttribute('vector-effect','non-scaling-stroke');
    guides.appendChild(path);
    const length=path.getTotalLength(),points=[];
    for(let i=0;i<=1000;i++){
      const point=path.getPointAtLength(length*i/1000);
      points.push([145+.5*(point.x+18),35+.5*(point.y-824.0001)]);
    }
    return track(points);
  });
  guides.style.display='none';
  function along(route,u){
    const distance=((u%1)+1)%1*route.total;
    let lo=1,hi=route.lengths.length-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(route.lengths[mid]<distance)lo=mid+1;else hi=mid;}
    const i=lo,a=route.points[i-1],b=route.points[i];
    const t=(distance-route.lengths[i-1])/(route.lengths[i]-route.lengths[i-1]||1);
    const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
    return {x:a[0]+dx*t,y:a[1]+dy*t,nx:-dy/len,ny:dx/len};
  }
  const birds=Array.from({length:4400},()=>{
    const node=document.createElementNS(ns,'ellipse');
    const r=.6+random()*.38;
    node.setAttribute('rx',r);node.setAttribute('ry',r*.72);
    node.setAttribute('fill','#080808');node.setAttribute('stroke','none');
    node.setAttribute('opacity',(.85+random()*.15).toFixed(2));
    svg.appendChild(node);
    const a=random()*Math.PI*2,radius=Math.sqrt(random());
    return {node,u:random(),route:random()<.36?0:1,speed:.027+random()*.017,
      offset:(random()+random()+random()-1.5)*19,phase:random()*Math.PI*2,
      x:Math.cos(a)*radius,y:Math.sin(a)*radius,halo:random()<.17};
  });
  svg.appendChild(guides);
  svg.setAttribute('viewBox','95 25 370 310');
  let paused=motion.matches,time=0,last=null,frame=null,lastPaint=0;
  function paint(){
    // Once per cycle: a clearer silhouette with a brief peak, never a held pose.
    const distance=Math.abs((time%30)-15);
    const pulse=Math.exp(-Math.pow(distance/.58,2));
    const gathering=.08+.89*pulse;
    for(const b of birds){
      const u=b.u+time*b.speed;
      const point=along(routes[b.route],u);
      const flutter=3*Math.sin(time*2.5+b.phase);
      const spread=b.offset*(.8+.35*Math.sin(time*.3+b.phase));
      const gx=point.x+point.nx*(spread+flutter);
      const gy=point.y+point.ny*(spread+flutter);
      const a=time*.18;
      const cloudX=285+145*(b.x*Math.cos(a)-b.y*Math.sin(a));
      const cloudY=169+95*(b.x*Math.sin(a)+b.y*Math.cos(a))+22*Math.sin(b.x*2.8+time*.6)+10*Math.sin(time*.7+b.phase);
      const blend=b.halo?.04:gathering;
      const x=cloudX*(1-blend)+gx*blend;
      const y=cloudY*(1-blend)+gy*blend;
      b.node.setAttribute('cx',x.toFixed(1));b.node.setAttribute('cy',y.toFixed(1));
    }
  }
  function visible(){return host.getClientRects().length>0&&!document.hidden;}
  function tick(now){
    frame=null;
    if(paused||!visible()){last=null;return;}
    if(now-lastPaint>40){
      if(last!==null)time+=Math.min((now-last)/1000,.08);
      last=now;lastPaint=now;paint();
    }
    frame=requestAnimationFrame(tick);
  }
  function sync(){
    if(frame!==null)cancelAnimationFrame(frame);
    frame=null;last=null;
    if(!paused&&visible())frame=requestAnimationFrame(tick);
  }
  host.classList.add('is-animated');paint();
  motion.addEventListener('change',()=>{paused=motion.matches;sync();});
  document.querySelectorAll('input[name="rg-art"]').forEach(el=>el.addEventListener('change',sync));
  document.addEventListener('visibilitychange',sync);sync();
})();
