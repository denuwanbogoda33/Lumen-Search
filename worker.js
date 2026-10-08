// Lumen search - single-file Cloudflare Worker (no Wrangler, no npm packages).
// Paste into: Workers & Pages -> your Worker -> Edit code. Optional secrets/variables:
// BRAVE_API_KEY, GOOGLE_API_KEY, GOOGLE_CX  (Settings -> Variables and Secrets)

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lumen</title>
<meta name="theme-color" content="#fb542b">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%2711%27 fill=%27%23fb542b%27/%3E%3Ccircle cx=%2712%27 cy=%2712%27 r=%274.5%27 fill=%27white%27/%3E%3C/svg%3E">
<script>try{var t=localStorage.getItem("lumen.theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}catch(e){}</script>
<style>
:root{--lw:132px;--bg:#fff;--sf:#f4f4f8;--ink:#1b1b25;--mute:#5c5f6e;--line:#e3e3ea;--ac:#fb542b;--lk:#3b3fc7;--vis:#7a3fb0;--hi:#fff1ec;--sh:0 2px 10px rgba(20,20,40,.1)}
[data-theme=dark]{--bg:#17181f;--sf:#22232c;--ink:#ececf2;--mute:#a1a4b3;--line:#32333f;--ac:#ff6a45;--lk:#9aa2ff;--vis:#c79bff;--hi:#2c2220;--sh:0 2px 12px rgba(0,0,0,.5)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 Inter,"Segoe UI",system-ui,-apple-system,sans-serif}
button{font:inherit;color:inherit;cursor:pointer}a{color:inherit;text-decoration:none}svg{width:1em;height:1em;display:block}
:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
.mark{display:flex;align-items:center;gap:.25em;font:700 clamp(44px,9vw,72px)/1 Inter,system-ui,sans-serif;letter-spacing:-.045em}
.mark svg{width:.8em;height:.8em}.mark circle:first-child{fill:var(--ac)}.mark circle:last-child{fill:var(--bg)}
.mark.sm{font-size:28px}
.th{width:38px;height:38px;border-radius:50%;border:0;background:none;display:grid;place-items:center;font-size:20px;color:var(--mute)}.th:hover{background:var(--sf)}
.bx{position:relative;width:100%}
.bx input{width:100%;height:54px;font:inherit;font-size:17px;color:var(--ink);padding:0 58px 0 24px;border-radius:28px;border:1px solid var(--line);background:var(--bg);outline:0;box-shadow:0 1px 3px rgba(20,20,40,.06)}
.bx input:hover{box-shadow:var(--sh)}.bx input:focus{border-color:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 22%,transparent)}
.go{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;border:0;background:var(--ac);color:#fff;display:grid;place-items:center;font-size:19px}
.sl{position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--bg);border:1px solid var(--line);border-radius:18px;box-shadow:var(--sh);padding:6px;z-index:20;display:none}.sl.open{display:block}
.sh{display:flex;justify-content:space-between;padding:6px 14px;font-size:13px;color:var(--mute)}.sh button{background:none;border:0;color:var(--lk);font-size:13px}
.si{display:flex;align-items:center;gap:12px;padding:9px 14px;border-radius:12px;cursor:pointer}.si.on,.si:hover{background:var(--sf)}
.si svg{color:var(--mute);flex:none}.si .tx{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.si .x{background:none;border:0;font-size:20px;line-height:1;color:var(--mute);padding:0 4px}
body.home #resv{display:none}body:not(.home) #homev{display:none}
#homev{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative}
#homev .th{position:absolute;top:16px;right:16px}
.hero{width:min(640px,100%);display:flex;flex-direction:column;align-items:center;gap:28px;margin-top:-6vh}
.chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;min-height:34px}
.chips button{border:0;background:var(--sf);border-radius:20px;padding:5px 14px;font-size:14px;color:var(--mute)}.chips button:hover{color:var(--ink);background:var(--hi)}
.tip{color:var(--mute);font-size:14px;text-align:center;margin:0;line-height:2}
code{background:var(--sf);padding:2px 9px;border-radius:8px;font:13px Consolas,monospace;cursor:pointer}code:hover{background:var(--hi)}
header{background:var(--bg);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
.hd{max-width:1240px;margin:0 auto;padding:14px 24px 0;display:grid;grid-template-columns:var(--lw) minmax(0,640px) 1fr;column-gap:24px;align-items:center}
.hd .mark{grid-area:1/1}.hd .bx{grid-area:1/2}.hd .th{grid-area:1/3;justify-self:end}
.hd .bx input{height:46px;font-size:16px;background:var(--sf);border-color:transparent;box-shadow:none}.hd .bx input:focus{background:var(--bg);border-color:var(--ac)}
.hd .go{width:34px;height:34px;font-size:17px}
nav{grid-area:2/2;display:flex;gap:4px;margin-top:6px}
nav button{background:none;border:0;border-bottom:3px solid transparent;padding:9px 14px;color:var(--mute)}nav button:hover{color:var(--ink)}
nav button.on{color:var(--ink);font-weight:600;border-color:var(--ac)}
main{max-width:1240px;margin:0 auto;padding:22px 24px 80px;display:grid;grid-template-columns:var(--lw) minmax(0,640px) 360px;column-gap:24px;align-items:start}
main>div{grid-column:2}main>aside{grid-column:3;position:sticky;top:130px;margin-left:24px}
.meta{color:var(--mute);font-size:13px;margin-bottom:18px}
.r{margin-bottom:26px}
.u{display:flex;align-items:center;gap:8px;font-size:13px;flex-wrap:wrap;min-width:0}.u>span{color:var(--mute)}.u .h{color:var(--ink);font-weight:500;font-size:14px}
.fav{width:22px;height:22px;border-radius:50%;background:var(--sf);padding:3px}
.tag{font-size:11px;opacity:.7}.tag.m{color:var(--ac);opacity:1}
.t{display:block;font-size:20px;line-height:1.35;font-weight:500;color:var(--lk);margin:4px 0 3px}.t:hover{text-decoration:underline}.t:visited{color:var(--vis)}
.r p{margin:0;color:var(--mute);line-height:1.55}mark{background:none;color:var(--ink);font-weight:600}
.more{padding:11px 28px;border-radius:24px;border:1px solid var(--line);background:var(--bg);font-weight:500}.more:hover{border-color:var(--ac);color:var(--ac)}
.pan{background:var(--bg);border:1px solid var(--line);border-radius:16px;padding:18px;margin-bottom:16px}
.pan h3{margin:0;font:700 22px/1.25 Inter,system-ui,sans-serif}.pan .d{color:var(--mute);font-size:14px;margin-bottom:10px}
.pan img{width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:12px}
.pan .lk{color:var(--lk);font-size:14px;font-weight:500}
.big{font:700 44px/1.1 Inter,system-ui,sans-serif;word-break:break-all}.sub{color:var(--mute);font-size:14px}
.wx{display:flex;align-items:baseline;gap:12px}.wx .big{font-size:52px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:12px;font-size:14px;color:var(--mute)}
.def{margin:10px 0 0}.def i{color:var(--mute)}
.imgs{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.imgs button{position:relative;padding:0;border:0;border-radius:12px;overflow:hidden;background:var(--sf);aspect-ratio:4/3}
.imgs img{width:100%;height:100%;object-fit:cover;display:block}
.imgs span{position:absolute;inset:auto 0 0;padding:20px 10px 8px;font-size:12px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.7));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left;opacity:0}
.imgs button:hover span,.imgs button:focus-visible span{opacity:1}
.sk{height:84px;border-radius:12px;margin-bottom:22px;background:linear-gradient(90deg,var(--sf),var(--line),var(--sf));background-size:200% 100%;animation:sh 1.3s linear infinite}
@keyframes sh{to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.sk{animation:none}}
.err{grid-column:2;border:1px solid #c0392b;border-radius:14px;padding:16px;color:#c0392b}
#lb{display:none;position:fixed;inset:0;background:rgba(8,8,14,.93);z-index:50;align-items:center;justify-content:center;gap:12px;padding:20px;color:#fff}#lb:not([hidden]){display:flex}
#lb figure{margin:0;max-width:min(1000px,80vw);text-align:center}#lb img{max-width:100%;max-height:78vh;border-radius:8px}
#lb figcaption{margin-top:10px;font-size:14px}#lb a{color:#ff9a7d}
#lb button{background:rgba(255,255,255,.12);border:0;border-radius:50%;width:46px;height:46px;font-size:26px;color:#fff;flex:none}#lbc{position:absolute;top:16px;right:16px}
@media(max-width:980px){:root{--lw:auto}.hd{grid-template-columns:auto 1fr;row-gap:10px}.hd .th{grid-area:1/2}.hd .bx{grid-area:2/1/3/3}nav{grid-area:3/1/4/3;overflow-x:auto}
main{grid-template-columns:minmax(0,1fr)}main>*{grid-column:1!important;margin-left:0!important}main>aside{position:static;order:-1}}
</style>
</head>
<body class="home">
<div id="homev">
  <button class="th" title="Switch theme"><svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 100 18V3z" fill="currentColor"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
  <div class="hero">
    <div class="mark"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="4.5"/></svg>lumen</div>
    <div class="bx" id="b0"><input id="q0" placeholder="Search the web" autocomplete="off" autofocus aria-label="Search"><button class="go" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button><div class="sl" id="l0"></div></div>
    <div class="chips" id="chips"></div>
    <p class="tip">Try <code>weather in colombo</code> <code>define serendipity</code> <code>2^10/4</code> <code>!yt lofi</code> <code>!gh express</code></p>
  </div>
</div>
<div id="resv">
  <header><div class="hd">
    <a class="mark sm" href="/"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="4.5"/></svg>lumen</a>
    <div class="bx" id="b1"><input id="q1" autocomplete="off" aria-label="Search"><button class="go" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button><div class="sl" id="l1"></div></div>
    <button class="th" title="Switch theme"><svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 100 18V3z" fill="currentColor"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
    <nav id="tabs"><button data-t="web">All</button><button data-t="images">Images</button><button data-t="news">News</button></nav>
  </div></header>
  <main id="out"></main>
</div>
<div id="lb" hidden><button id="lbc" aria-label="Close">&times;</button><button id="lbp" aria-label="Previous">&lsaquo;</button><figure><img id="lbi" alt=""><figcaption id="lbt"></figcaption></figure><button id="lbn" aria-label="Next">&rsaquo;</button></div>

<script>
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=u=>/^https?:\\/\\//i.test(u)?u:"#";
const LS={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const ICO={s:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',c:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'};
let hist=LS.get("lumen.hist",[]),st={q:"",type:"web",page:1,seen:new Set(),imgs:[]};
const addHist=q=>{hist=[q,...hist.filter(h=>h.toLowerCase()!==q.toLowerCase())].slice(0,20);LS.set("lumen.hist",hist)};
const BANGS={w:"https://en.wikipedia.org/w/index.php?search=",yt:"https://www.youtube.com/results?search_query=",gh:"https://github.com/search?q=",so:"https://stackoverflow.com/search?q=",g:"https://www.google.com/search?q=",r:"https://www.reddit.com/search/?q=",maps:"https://www.google.com/maps/search/",a:"https://www.amazon.com/s?k=",npm:"https://www.npmjs.com/search?q=",mdn:"https://developer.mozilla.org/en-US/search?q="};

document.querySelectorAll(".th").forEach(b=>b.onclick=()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;try{localStorage.setItem("lumen.theme",t)}catch{}});

function box(inp,list){
  let items=[],idx=-1,seq=0,timer;
  const draw=()=>{list.innerHTML=(items.length&&!inp.value.trim()?'<div class="sh"><span>Recent searches</span><button data-clear>Clear all</button></div>':"")+items.map((s,i)=>\`<div class="si\${i===idx?" on":""}" data-i="\${i}">\${s.h?ICO.c:ICO.s}<span class="tx">\${esc(s.t)}</span>\${s.h?\`<button class="x" data-del="\${i}" title="Remove">&times;</button>\`:""}</div>\`).join("");list.classList.toggle("open",items.length>0)};
  const refresh=async()=>{
    const v=inp.value.trim(),my=++seq;
    if(!v){items=hist.slice(0,6).map(t=>({t,h:1}));idx=-1;return draw()}
    const lv=v.toLowerCase(),local=hist.filter(h=>h.toLowerCase().startsWith(lv)&&h.toLowerCase()!==lv).slice(0,3).map(t=>({t,h:1}));
    items=local;draw();
    try{const s=await(await fetch("/api/suggest?q="+encodeURIComponent(v))).json();if(my!==seq)return;
      const seen=new Set(local.map(x=>x.t.toLowerCase()));
      items=[...local,...s.filter(x=>!seen.has(x.toLowerCase())).map(t=>({t}))].slice(0,8);idx=-1;draw()}catch{}
  };
  const close=()=>{items=[];idx=-1;seq++;draw()};
  inp.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(refresh,110)});
  inp.addEventListener("focus",refresh);
  inp.addEventListener("blur",()=>setTimeout(close,150));
  inp.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){if(!items.length)return;e.preventDefault();idx=(idx+(e.key==="ArrowDown"?1:-1)+items.length+1)%(items.length+1)-0;if(idx===items.length)idx=-1;draw()}
    else if(e.key==="Enter"){const v=idx>=0?items[idx].t:inp.value;close();go(v)}
    else if(e.key==="Escape")close();
  });
  list.addEventListener("mousedown",e=>{
    e.preventDefault();
    if(e.target.closest("[data-clear]")){hist=[];LS.set("lumen.hist",hist);return refresh()}
    const d=e.target.closest("[data-del]");
    if(d){hist.splice(hist.indexOf(items[d.dataset.del].t),1);LS.set("lumen.hist",hist);return refresh()}
    const s=e.target.closest("[data-i]");if(s){const v=items[s.dataset.i].t;close();go(v)}
  });
}
box($("#q0"),$("#l0"));box($("#q1"),$("#l1"));

function go(q,type=st.type){
  q=(q||"").trim();if(!q)return;
  let m=q.match(/^!(\\w+)\\s+(.+)$/)||(q.match(/^(.+?)\\s+!(\\w+)$/)||[]).slice(0,3).map((x,i,a)=>i===1?a[2]:i===2?a[1]:x);
  if(m&&m[1]&&BANGS[m[1].toLowerCase()]){location.href=BANGS[m[1].toLowerCase()]+encodeURIComponent(m[2]);return}
  addHist(q);history.pushState(null,"",\`/?q=\${encodeURIComponent(q)}&type=\${type}\`);boot();
}
$("#tabs").onclick=e=>{const b=e.target.closest("button");if(b&&st.q)go(st.q,b.dataset.t)};
addEventListener("popstate",boot);
addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();(document.body.classList.contains("home")?$("#q0"):$("#q1")).focus()}});

async function api(type,q,page){
  const r=await fetch(\`/api/search?type=\${type}&page=\${page}&q=\${encodeURIComponent(q)}\`);
  const d=await r.json().catch(()=>({error:"Bad response from server"}));
  if(!r.ok)throw new Error(d.error||"Request failed");return d;
}
async function boot(){
  const p=new URLSearchParams(location.search),q=(p.get("q")||"").trim(),type=["images","news"].includes(p.get("type"))?p.get("type"):"web";
  document.body.classList.toggle("home",!q);
  if(!q){document.title="Lumen";$("#chips").innerHTML=hist.slice(0,6).map(h=>\`<button>\${esc(h)}</button>\`).join("");$("#q0").focus();return}
  st={q,type,page:1,seen:new Set(),imgs:[]};$("#q1").value=q;document.title=q+" - Lumen";
  document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===type));
  $("#out").innerHTML='<div><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>';
  try{
    const d=await api(type,q,1);if(q!==st.q||type!==st.type)return;
    $("#out").innerHTML=type==="images"?vImages(d):type==="news"?vNews(d):vWeb(d);
    const mb=$("#more");if(mb)mb.onclick=more;
  }catch(e){$("#out").innerHTML=\`<div class="err">Search failed: \${esc(e.message)}. Check your connection, then search again.</div>\`}
}
$("#chips").onclick=e=>{const b=e.target.closest("button");if(b)go(b.textContent)};

const hl=t=>{const w=st.q.split(/\\s+/).filter(x=>x.length>2&&!x.includes(":")&&!x.startsWith("!")).map(x=>x.replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\\\$&"));if(!w.length||!t)return esc(t);return String(t).split(new RegExp("("+w.join("|")+")","gi")).map((p,i)=>i%2?\`<mark>\${esc(p)}</mark>\`:esc(p)).join("")};
const ago=d=>{const s=(Date.now()-new Date(d))/1000;if(isNaN(s))return"";if(s<3600)return Math.max(1,Math.round(s/60))+" min ago";if(s<86400)return Math.round(s/3600)+" h ago";return Math.round(s/86400)+" d ago"};
const wmo=c=>c===0?"Clear sky":c<4?"Partly cloudy":c<50?"Fog":c<60?"Drizzle":c<70?"Rain":c<80?"Snow":c<85?"Rain showers":c<90?"Snow showers":"Thunderstorm";

const row=r=>{let p="";try{const u=new URL(r.url);p=(u.pathname+u.search).replace(/\\/$/,"")}catch{}
  return \`<article class="r"><div class="u"><img class="fav" src="https://icons.duckduckgo.com/ip3/\${esc(r.host)}.ico" alt="" onerror="this.style.visibility='hidden'"><span class="h">\${esc(r.host)}</span><span>\${esc(p.length>38?p.slice(0,38)+"…":p)}</span>\${r.sources.map(s=>\`<span class="tag\${r.sources.length>1?" m":""}">\${esc(s)}</span>\`).join("")}</div><a class="t" href="\${esc(safe(r.url))}">\${esc(r.title)}</a><p>\${hl(r.snippet)}</p></article>\`};

function panel(d){
  const a=d.answer,c=d.card;let h="";
  if(a?.type==="math")h=\`<div class="pan"><div class="sub">\${esc(a.expr)} =</div><div class="big">\${esc(a.value)}</div></div>\`;
  else if(a?.type==="define")h=\`<div class="pan"><h3>\${esc(a.word)}</h3><div class="d">\${esc(a.phonetic)}</div>\${a.meanings.map(m=>\`<p class="def"><i>\${esc(m.pos)}</i> \${esc(m.def)}\${m.example?\`<br><i>"\${esc(m.example)}"</i>\`:""}</p>\`).join("")}</div>\`;
  else if(a?.type==="weather")h=\`<div class="pan"><div class="sub">\${esc(a.place)}</div><div class="wx"><span class="big">\${Math.round(a.temp)}°C</span><span>\${esc(wmo(a.code))}</span></div><div class="grid2"><span>Feels like \${Math.round(a.feels)}°</span><span>Humidity \${a.humidity}%</span><span>High \${Math.round(a.max)}° / Low \${Math.round(a.min)}°</span><span>Wind \${a.wind} km/h</span></div></div>\`;
  if(c)h+=\`<div class="pan">\${c.image?\`<img src="\${esc(safe(c.image))}" alt="" referrerpolicy="no-referrer">\`:""}<h3>\${esc(c.title)}</h3><div class="d">\${esc(c.description||"")}</div><p style="margin:0 0 10px;font-size:15px">\${esc(c.extract.length>460?c.extract.slice(0,460)+"…":c.extract)}</p><a class="lk" href="\${esc(safe(c.url))}">Read on Wikipedia</a></div>\`;
  return h?\`<aside>\${h}</aside>\`:"";
}
function vWeb(d){
  d.results.forEach(r=>st.seen.add(r.url));
  const eng=Object.entries(d.status).filter(([,v])=>typeof v==="number"&&v>0).map(([k])=>k).join(", ");
  const bad=Object.entries(d.status).filter(([,v])=>typeof v==="string").map(([k,v])=>\`\${k}: \${v.replace("error: ","")}\`).join(" | ");
  if(!d.results.length)return\`<div class="err">No results. \${bad?esc(bad):"Try different words."}</div>\${panel(d)}\`;
  return\`<div><div class="meta">\${d.results.length} results from \${esc(eng)} in \${d.ms} ms\${bad?\` <span title="\${esc(bad)}">(some engines failed)</span>\`:""}</div><div id="list">\${d.results.map(row).join("")}</div><button class="more" id="more">More results</button></div>\${panel(d)}\`;
}
async function more(){
  const b=$("#more");b.textContent="Loading...";
  try{const d=await api("web",st.q,++st.page);const fresh=d.results.filter(r=>!st.seen.has(r.url));fresh.forEach(r=>st.seen.add(r.url));
    $("#list").insertAdjacentHTML("beforeend",fresh.map(row).join(""));
    if(!fresh.length||st.page>=5)b.remove();else b.textContent="More results"}
  catch(e){b.textContent="Failed: "+e.message+" (click to retry)";st.page--}
}
function vImages(d){
  st.imgs=d.results;if(!d.results.length)return'<div class="err">No images found. Try different words.</div>';
  return\`<div class="imgs">\${d.results.map((i,n)=>\`<button data-n="\${n}"><img loading="lazy" referrerpolicy="no-referrer" src="\${esc(safe(i.thumb))}" alt="\${esc(i.title)}"><span>\${esc(i.title||i.host)}</span></button>\`).join("")}</div>\`;
}
function vNews(d){
  if(!d.results.length)return'<div class="err">No news found. Try different words.</div>';
  return\`<div class="news">\${d.results.map(n=>\`<article class="r"><div class="u"><span class="h">\${esc(n.source)}</span><span>\${esc(ago(n.date))}</span></div><a class="t" href="\${esc(safe(n.url))}">\${esc(n.title)}</a>\${n.snippet?\`<p>\${esc(n.snippet)}</p>\`:""}</article>\`).join("")}</div>\`;
}

let li=0;
function lbShow(n){
  const imgs=st.imgs;if(!imgs.length)return;li=(n+imgs.length)%imgs.length;const i=imgs[li],el=$("#lbi");
  el.onerror=()=>{el.onerror=null;el.src=i.thumb};el.referrerPolicy="no-referrer";el.src=i.full;
  $("#lbt").innerHTML=\`\${esc(i.title)}<br><a href="\${esc(safe(i.page))}" target="_blank" rel="noopener noreferrer">Visit \${esc(i.host||"page")}</a>\`;$("#lb").hidden=false;
}
$("#out").addEventListener("click",e=>{const b=e.target.closest(".imgs button");if(b)lbShow(+b.dataset.n)});
$("#lbc").onclick=()=>$("#lb").hidden=true;$("#lbp").onclick=()=>lbShow(li-1);$("#lbn").onclick=()=>lbShow(li+1);
$("#lb").onclick=e=>{if(e.target.id==="lb")$("#lb").hidden=true};
addEventListener("keydown",e=>{if($("#lb").hidden)return;if(e.key==="Escape")$("#lb").hidden=true;if(e.key==="ArrowLeft")lbShow(li-1);if(e.key==="ArrowRight")lbShow(li+1)});

document.querySelectorAll(".go").forEach(b=>b.onclick=()=>go(b.parentNode.querySelector("input").value));
document.querySelectorAll(".tip code").forEach(c=>c.onclick=()=>go(c.textContent));
boot();
</script>
</body>
</html>`;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const enc = encodeURIComponent;
const JSON_HDR = { "Content-Type": "application/json;charset=utf-8" };
const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HDR });

async function get(url, opts = {}, ms = 7000) {
  const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(ms), headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9", ...(opts.headers || {}) } });
  if (!r.ok) throw new Error(`${r.status} from ${new URL(url).hostname}`);
  return r;
}
const jget = async (u, o, ms) => (await get(u, o, ms)).json();
const tget = async (u, o, ms) => (await get(u, o, ms)).text();

// ---------- tiny helpers: entities, tags, HTMLRewriter scraping ----------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const dec = s => String(s ?? "").replace(/&(#x?[\da-f]+|\w+);/gi, (m, e) => {
  if (e[0] !== "#") return ENT[e.toLowerCase()] ?? m;
  try { return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)); } catch { return m; }
});
const strip = s => dec(dec(s).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

async function scrape(res, rules) {
  const rw = new HTMLRewriter();
  for (const [sel, h] of rules) rw.on(sel, h);
  await rw.transform(res).text(); // consume the stream so handlers run
}
// collect the text of the matched element into item()[key]
const txt = (item, key) => {
  let c, b = "";
  return {
    element(el) { c = item(); b = ""; el.onEndTag(() => { if (c && !c[key]) c[key] = b.replace(/\s+/g, " ").trim(); }); },
    text(t) { b += t.text; },
  };
};
const attr = (item, key, name) => ({ element(el) { const c = item(); if (c && !c[key]) c[key] = el.getAttribute(name) || ""; } });

// RSS via regex (HTML parsers mangle <link> in XML)
const tag = (b, n) => {
  const m = b.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
  return m ? m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim() : "";
};
const rssItems = x => x.split(/<item[\s>]/i).slice(1);

// ---------- web engines: (q, page, env) -> [{title,url,snippet}] ----------
const engines = {
  async duckduckgo(q, page) {
    const off = (page - 1) * 30;
    const body = new URLSearchParams({ q, kl: "wt-wt" });
    if (off) { body.set("s", String(off)); body.set("dc", String(off + 1)); }
    const r = await get("https://html.duckduckgo.com/html/", {
      method: "POST", body,
      headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: "https://html.duckduckgo.com/", Origin: "https://html.duckduckgo.com" },
    });
    const out = []; let cur = null, captcha = false;
    await scrape(r, [
      [".anomaly-modal__modal", { element() { captcha = true; } }],
      [".result", { element(el) {
        cur = /result--ad/.test(el.getAttribute("class") || "") ? null : { title: "", url: "", snippet: "" };
        if (cur) out.push(cur);
      } }],
      [".result__a", attr(() => cur, "url", "href")],
      [".result__a", txt(() => cur, "title")],
      [".result__snippet", txt(() => cur, "snippet")],
    ]);
    if (captcha) throw new Error("DuckDuckGo asked for a captcha (try again later)");
    return out.map(x => {
      let href = x.url;
      try { const u = new URL(href, "https://duckduckgo.com"); href = u.searchParams.get("uddg") || u.href; } catch { return null; }
      return /^https?:/.test(href) && x.title ? { ...x, url: href } : null;
    }).filter(Boolean);
  },
  async mojeek(q, page) {
    const r = await get(`https://www.mojeek.com/search?q=${enc(q)}&s=${(page - 1) * 10 + 1}`);
    const out = []; let cur = null;
    await scrape(r, [
      ["ul.results-standard > li", { element() { cur = { title: "", url: "", snippet: "" }; out.push(cur); } }],
      ["ul.results-standard a.title", attr(() => cur, "url", "href")],
      ["ul.results-standard a.title", txt(() => cur, "title")],
      ["ul.results-standard p.s", txt(() => cur, "snippet")],
    ]);
    return out.filter(x => x.title && /^https?:/.test(x.url));
  },
  async brave(q, page, env) {
    if (!env.BRAVE_API_KEY) return [];
    const j = await jget(`https://api.search.brave.com/res/v1/web/search?count=20&offset=${page - 1}&q=${enc(q)}`,
      { headers: { "X-Subscription-Token": env.BRAVE_API_KEY, Accept: "application/json" } });
    return (j.web?.results || []).map(x => ({ title: strip(x.title), url: x.url, snippet: strip(x.description) }));
  },
  async google(q, page, env) {
    if (!env.GOOGLE_API_KEY || !env.GOOGLE_CX) return [];
    const j = await jget(`https://www.googleapis.com/customsearch/v1?key=${env.GOOGLE_API_KEY}&cx=${env.GOOGLE_CX}&num=10&start=${(page - 1) * 10 + 1}&q=${enc(q)}`);
    return (j.items || []).map(x => ({ title: x.title, url: x.link, snippet: x.snippet }));
  },
  async wikipedia(q, page) {
    const j = await jget(`https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=5&sroffset=${(page - 1) * 5}&format=json&srsearch=${enc(q)}`);
    return (j.query?.search || []).map(x => ({
      title: x.title + " - Wikipedia", url: "https://en.wikipedia.org/wiki/" + enc(x.title.replace(/ /g, "_")), snippet: strip(x.snippet),
    }));
  },
};
const weights = { brave: 1.2, google: 1.2, duckduckgo: 1, mojeek: 0.9, wikipedia: 0.7 };

const normUrl = u => {
  try {
    const x = new URL(u);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach(p => x.searchParams.delete(p));
    return (x.hostname.replace(/^www\./, "") + x.pathname.replace(/\/$/, "") + x.search).toLowerCase();
  } catch { return u; }
};

// Reciprocal Rank Fusion
function fuse(lists) {
  const map = new Map();
  for (const [name, items] of Object.entries(lists)) {
    items.forEach((it, i) => {
      const k = normUrl(it.url);
      const e = map.get(k) || { ...it, score: 0, sources: [] };
      e.score += (weights[name] || 1) / (60 + i);
      if (!e.sources.includes(name)) e.sources.push(name);
      if ((it.snippet || "").length > (e.snippet || "").length) e.snippet = it.snippet;
      map.set(k, e);
    });
  }
  return [...map.values()].sort((a, b) => b.score - a.score).map(({ score, ...r }) => ({ ...r, host: hostOf(r.url) }));
}

async function webSearch(q, page, env) {
  const names = Object.keys(engines);
  const settled = await Promise.allSettled(names.map(n => engines[n](q, page, env)));
  const lists = {}, status = {};
  settled.forEach((s, i) => {
    status[names[i]] = s.status === "fulfilled" ? s.value.length : "error: " + s.reason.message;
    if (s.status === "fulfilled" && s.value.length) lists[names[i]] = s.value;
  });
  return { results: fuse(lists), status };
}

// ---------- images: DuckDuckGo (token flow) + Wikimedia Commons ----------
async function ddgImages(q) {
  const page = await tget(`https://duckduckgo.com/?q=${enc(q)}&iax=images&ia=images`);
  const vqd = page.match(/vqd=["']?([\d-]+)["']?/)?.[1];
  if (!vqd) throw new Error("DuckDuckGo image token not found");
  const j = await jget(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${enc(q)}&vqd=${vqd}&f=,,,,,&p=1`, { headers: { Referer: "https://duckduckgo.com/" } });
  return (j.results || []).map(x => ({ title: x.title, thumb: x.thumbnail, full: x.image, page: x.url, host: hostOf(x.url), w: x.width, h: x.height }));
}
async function commonsImages(q) {
  const j = await jget(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=24&gsrsearch=${enc(q)}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json`, { headers: { "User-Agent": "LumenSearch/2.0 (self-hosted)" } });
  return Object.values(j.query?.pages || {}).map(p => p.imageinfo?.[0] && ({
    title: p.title.replace(/^File:/, "").replace(/\.\w+$/, ""), thumb: p.imageinfo[0].thumburl, full: p.imageinfo[0].url,
    page: p.imageinfo[0].descriptionurl, host: "commons.wikimedia.org", w: p.imageinfo[0].width, h: p.imageinfo[0].height,
  })).filter(x => x && /\.(jpe?g|png|gif|webp)/i.test(x.full));
}
async function images(q) {
  const [a, b] = await Promise.allSettled([ddgImages(q), commonsImages(q)]);
  if (a.status === "rejected" && b.status === "rejected") throw new Error(a.reason.message + "; " + b.reason.message);
  const seen = new Set();
  return [...(a.value || []), ...(b.value || [])].filter(i => i.thumb && !seen.has(i.full) && seen.add(i.full));
}

// ---------- news: Google News RSS + Bing News RSS ----------
async function googleNews(q) {
  const x = await tget(`https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en&q=${enc(q)}`);
  return rssItems(x).map(b => ({
    title: strip(tag(b, "title")).replace(/ - [^-]+$/, ""), url: dec(tag(b, "link")),
    source: strip(tag(b, "source")), date: tag(b, "pubDate"), snippet: "",
  }));
}
async function bingNews(q) {
  const x = await tget(`https://www.bing.com/news/search?q=${enc(q)}&format=rss`);
  return rssItems(x).map(b => {
    const link = dec(tag(b, "link"));
    let url = link; try { url = new URL(link).searchParams.get("url") || link; } catch {}
    return { title: strip(tag(b, "title")), url, source: strip(tag(b, "News:Source")) || hostOf(url), date: tag(b, "pubDate"), snippet: strip(tag(b, "description")) };
  });
}
async function news(q) {
  const [g, b] = await Promise.allSettled([googleNews(q), bingNews(q)]);
  if (g.status === "rejected" && b.status === "rejected") throw g.reason;
  const seen = new Set();
  return [...(g.value || []), ...(b.value || [])]
    .filter(n => n.title && n.url && !seen.has(n.title.toLowerCase().slice(0, 60)) && seen.add(n.title.toLowerCase().slice(0, 60)))
    .sort((x, y) => new Date(y.date) - new Date(x.date)).slice(0, 40);
}

// ---------- instant answers ----------
async function card(q) {
  const s = await jget(`https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search=${enc(q)}`, {}, 4000);
  const title = s[1]?.[0];
  if (!title) return null;
  const j = await jget("https://en.wikipedia.org/api/rest_v1/page/summary/" + enc(title.replace(/ /g, "_")), {}, 4000);
  if (j.type === "disambiguation" || !j.extract) return null;
  const ql = q.toLowerCase(), tl = j.title.toLowerCase();
  if (!(ql.includes(tl) || tl.includes(ql) || ql.split(/\s+/).every(w => tl.includes(w)))) return null;
  return { title: j.title, description: j.description, extract: j.extract, image: j.thumbnail?.source, url: j.content_urls?.desktop?.page };
}

// safe calculator (Workers block eval / new Function)
function calc(src) {
  const t = src.replace(/\s/g, "").match(/\d+\.?\d*|\.\d+|[-+*/^%()]/g);
  if (!t) throw 0;
  let i = 0;
  const peek = () => t[i], eat = () => t[i++];
  const prim = () => {
    const x = eat();
    if (x === "(") { const v = add(); if (eat() !== ")") throw 0; return v; }
    if (x === "-") return -pow();
    if (x === "+") return pow();
    const n = parseFloat(x); if (isNaN(n)) throw 0; return n;
  };
  const pow = () => { const b = prim(); return peek() === "^" ? (eat(), b ** pow()) : b; };
  const mul = () => { let v = pow(); while (["*", "/", "%"].includes(peek())) { const o = eat(), r = pow(); v = o === "*" ? v * r : o === "/" ? v / r : v % r; } return v; };
  const add = () => { let v = mul(); while (peek() === "+" || peek() === "-") { const o = eat(), r = mul(); v = o === "+" ? v + r : v - r; } return v; };
  const v = add(); if (i < t.length) throw 0; return v;
}

async function answer(q) {
  const expr = q.replace(/^(calc(ulate)?\s+|=\s*)/i, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, "");
  if (/^[\d\s+\-*/().%^]+$/.test(expr) && /\d/.test(expr) && /[+\-*/^%]/.test(expr.replace(/^\s*-/, ""))) {
    try {
      const v = calc(expr);
      if (typeof v === "number" && isFinite(v)) return { type: "math", expr: expr.trim(), value: String(Number(v.toPrecision(12))) };
    } catch {}
  }
  let m = q.match(/^(?:define|definition of|meaning of)\s+([\p{L}'-]+)$/iu);
  if (m) {
    const e = (await jget(`https://api.dictionaryapi.dev/api/v2/entries/en/${enc(m[1])}`, {}, 5000))[0];
    if (e) return {
      type: "define", word: e.word, phonetic: e.phonetic || e.phonetics?.find(p => p.text)?.text || "",
      meanings: e.meanings.slice(0, 3).map(x => ({ pos: x.partOfSpeech, def: x.definitions[0].definition, example: x.definitions[0].example || "" })),
    };
  }
  m = q.match(/^weather(?:\s+(?:in|for|at))?\s+(.+)$/i) || q.match(/^(.+?)\s+weather$/i);
  if (m) {
    const g = (await jget(`https://geocoding-api.open-meteo.com/v1/search?count=1&name=${enc(m[1])}`, {}, 5000)).results?.[0];
    if (!g) return null;
    const w = await jget(`https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`, {}, 5000);
    const c = w.current;
    return { type: "weather", place: [g.name, g.admin1, g.country].filter(Boolean).join(", "), temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m, wind: c.wind_speed_10m, code: c.weather_code, max: w.daily.temperature_2m_max[0], min: w.daily.temperature_2m_min[0] };
  }
  return null;
}

// ---------- suggestions: Google -> DuckDuckGo -> Wikipedia ----------
async function suggest(q) {
  const tries = [
    async () => (await jget(`https://suggestqueries.google.com/complete/search?client=firefox&q=${enc(q)}`, {}, 2500))[1],
    async () => (await jget(`https://duckduckgo.com/ac/?q=${enc(q)}`, {}, 2500)).map(x => x.phrase),
    async () => (await jget(`https://en.wikipedia.org/w/api.php?action=opensearch&limit=8&format=json&search=${enc(q)}`, {}, 2500))[1],
  ];
  for (const t of tries) { try { const r = await t(); if (r?.length) return r.slice(0, 8); } catch {} }
  return [];
}

// ---------- cache: per-isolate Map + Cache API (Cache API needs a custom domain; harmless on workers.dev) ----------
const L1 = new Map();
async function cached(ctx, key, fn, ttl = 600) {
  const hit = L1.get(key);
  if (hit && hit.t > Date.now()) return hit.v;
  const ck = new Request("https://lumen.cache.invalid/" + enc(key));
  try {
    const m = await caches.default.match(ck);
    if (m) { const v = await m.json(); L1.set(key, { v, t: Date.now() + ttl * 1000 }); return v; }
  } catch {}
  const v = await fn();
  L1.set(key, { v, t: Date.now() + ttl * 1000 });
  if (L1.size > 300) L1.delete(L1.keys().next().value);
  try { ctx.waitUntil(caches.default.put(ck, new Response(JSON.stringify(v), { headers: { ...JSON_HDR, "Cache-Control": `public, max-age=${ttl}` } }))); } catch {}
  return v;
}

// ---------- routes ----------
async function handleSearch(url, env, ctx) {
  const q = (url.searchParams.get("q") || "").trim().slice(0, 300);
  const t = url.searchParams.get("type");
  const type = ["web", "images", "news"].includes(t) ? t : "web";
  const page = Math.min(Math.max(parseInt(url.searchParams.get("page")) || 1, 1), 5);
  if (!q) return reply({ error: "Type something to search." }, 400);
  try {
    const t0 = Date.now();
    const data = await cached(ctx, `${type}:${page}:${q.toLowerCase()}`, async () => {
      if (type === "images") return { results: await images(q) };
      if (type === "news") return { results: await news(q) };
      const [web, c, a] = await Promise.all([webSearch(q, page, env), page === 1 ? card(q).catch(() => null) : null, page === 1 ? answer(q).catch(() => null) : null]);
      return { ...web, answer: a, card: a ? null : c };
    });
    return reply({ ...data, ms: Date.now() - t0 });
  } catch (e) { return reply({ error: e.message }, 502); }
}

async function handleSuggest(url, ctx) {
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  if (!q) return reply([]);
  return reply(await cached(ctx, "s:" + q.toLowerCase(), () => suggest(q), 3600));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/": return new Response(HTML, { headers: { "Content-Type": "text/html;charset=utf-8", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" } });
      case "/favicon.ico": return new Response(null, { status: 204 });
      case "/api/search": return handleSearch(url, env, ctx);
      case "/api/suggest": return handleSuggest(url, ctx);
      default: return new Response("Not found", { status: 404 });
    }
  },
};
