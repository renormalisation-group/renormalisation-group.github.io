(() => {
  const svg=document.getElementById('firefly-field');
  if(!svg)return;
  const status=document.querySelector('.firefly-status');
  const ns='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let seed=38;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  function circle(r,fill){
    const n=document.createElementNS(ns,'circle');n.setAttribute('r',r);n.setAttribute('fill',fill);return n;
  }
  const flies=Array.from({length:100},()=>{
    const group=document.createElementNS(ns,'g');
    const outer=circle(13,'#d9a441'),inner=circle(6,'#d4a035'),light=circle(2.1,'#ac701a');
    const body=document.createElementNS(ns,'path');
    body.setAttribute('d','M-1.2-2Q-4-5-4-2Q-3 0-1 0M1.2-2Q4-5 4-2Q3 0 1 0M0-2V2');
    body.setAttribute('stroke','#292722');body.setAttribute('stroke-width','.8');body.setAttribute('fill','none');
    group.append(outer,inner,body,light);svg.append(group);
    return {group,outer,inner,light,x:65+random()*770,y:60+random()*290,
      phase:random()*Math.PI*2,period:2.3+random()*.6,drift:random()*Math.PI*2};
  });
  let start=null,last=0;
  function paint(t){
    const cycle=t%42;
    // Local pockets acquire a common beat before the whole field aligns.
    const coupling=cycle<8?0:cycle<25?(cycle-8)/17:cycle<34?1:1-(cycle-34)/8;
    for(const f of flies){
      const x=f.x+(reduced.matches?0:9*Math.sin(t*.22+f.drift));
      const y=f.y+(reduced.matches?0:7*Math.cos(t*.28+f.drift));
      const local=(f.x/900)*.7;
      const own=t/f.period*Math.PI*2+f.phase;
      const shared=t/2.65*Math.PI*2;
      // Circular phase interpolation avoids jumps at the 2π boundary.
      const delta=Math.atan2(Math.sin(own-shared),Math.cos(own-shared));
      const phase=shared+delta*(1-coupling)+local*Math.sin(coupling*Math.PI);
      const flash=Math.pow(Math.max(0,Math.cos(phase)),18);
      f.group.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      f.outer.setAttribute('opacity',(flash*.13).toFixed(3));
      f.inner.setAttribute('opacity',(flash*.3).toFixed(3));
      f.light.setAttribute('opacity',(.06+flash*.94).toFixed(3));
    }
    status.textContent=coupling<.15?'Independent flashes':coupling<.8?'Small rhythms gathering':cycle<34?'A shared pulse':'The rhythm loosens';
  }
  function tick(now){
    if(start===null)start=now;
    if(now-last>40){paint((now-start)/1000);last=now;}
    requestAnimationFrame(tick);
  }
  if(reduced.matches){paint(0);status.textContent='Still study · reduced motion';}
  else requestAnimationFrame(tick);
})();
