import { useState, useEffect, useRef, useCallback } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";

const BASE_RULES = `
QOIDALAR:
- Sen REAL xodimsan. Hech qachon "AI", "Claude", "assistant" dema.
- Faqat o'z sohasida gapir. Qisqa, professional, O'zbek tilida (2-4 gap).
- Kim yozganini ko'rib, unga mos javob ber.`;

const AGENTS = {
  alex:   { id:"alex",   name:"Alex Chen",    title:"CEO",             avatar:"AC", color:"#5b6af0", bg:"#eef0ff" },
  sarah:  { id:"sarah",  name:"Sarah Park",   title:"COO",             avatar:"SP", color:"#7c3aed", bg:"#f3eeff" },
  marcus: { id:"marcus", name:"Marcus Webb",  title:"CTO",             avatar:"MW", color:"#0891b2", bg:"#e0f7fa" },
  yuki:   { id:"yuki",   name:"Yuki Tanaka",  title:"Senior Engineer", avatar:"YT", color:"#059669", bg:"#e6faf3" },
  omar:   { id:"omar",   name:"Omar Rashid",  title:"Frontend Eng",    avatar:"OR", color:"#16a34a", bg:"#edfaf2" },
  priya:  { id:"priya",  name:"Priya Nair",   title:"Data Scientist",  avatar:"PN", color:"#2563eb", bg:"#eff6ff" },
  leon:   { id:"leon",   name:"Leon Müller",  title:"ML Engineer",     avatar:"LM", color:"#1d4ed8", bg:"#eff6ff" },
  zoe:    { id:"zoe",    name:"Zoe Laurent",  title:"Head of Design",  avatar:"ZL", color:"#db2777", bg:"#fdf2f8" },
  kai:    { id:"kai",    name:"Kai Okonkwo",  title:"Brand Designer",  avatar:"KO", color:"#9333ea", bg:"#fdf4ff" },
  ines:   { id:"ines",   name:"Ines Ferreira",title:"DevOps",          avatar:"IF", color:"#d97706", bg:"#fffbeb" },
  tom:    { id:"tom",    name:"Tom Bradley",  title:"Product Manager", avatar:"TB", color:"#b45309", bg:"#fef9ee" },
};

const AGENT_SYSTEMS = {
  alex:   `Sen AI Corp CEO Alex Chensen. Strategiya, biznes, investorlar.${BASE_RULES}`,
  sarah:  `Sen AI Corp COO Sarah Parksan. Operatsiyalar, jarayonlar, KPI.${BASE_RULES}`,
  marcus: `Sen AI Corp CTO Marcus Webbsan. Texnik arxitektura.${BASE_RULES}`,
  yuki:   `Sen Senior Engineer Yuki Tanakasan. Node.js, PostgreSQL, API.${BASE_RULES}`,
  omar:   `Sen Frontend Engineer Omar Rashidsan. React, TypeScript, UI.${BASE_RULES}`,
  priya:  `Sen Data Scientist Priya Nairsan. Tahlil, metrikalar, A/B test.${BASE_RULES}`,
  leon:   `Sen ML Engineer Leon Müllersen. Model training, MLOps.${BASE_RULES}`,
  zoe:    `Sen Head of Design Zoe Laurentsan. UX strategiya, dizayn tizimi.${BASE_RULES}`,
  kai:    `Sen Brand Designer Kai Okonkwoilsan. Vizual identitet, typography.${BASE_RULES}`,
  ines:   `Sen DevOps Engineer Ines Ferreirasan. CI/CD, Docker/K8s.${BASE_RULES}`,
  tom:    `Sen Product Manager Tom Bradleysan. Roadmap, sprint.${BASE_RULES}`,
};

// Each team = a "building" on the infinite canvas
const TEAMS = [
  { id:"exec",   label:"Executive Floor",  color:"#5b6af0", x:100,  y:80,
    desks:[{id:"alex",x:30,y:70},{id:"sarah",x:200,y:70}], w:360, h:220 },
  { id:"eng",    label:"Engineering",      color:"#0891b2", x:560,  y:80,
    desks:[{id:"marcus",x:20,y:70},{id:"yuki",x:180,y:70},{id:"omar",x:340,y:70}], w:480, h:220 },
  { id:"data",   label:"Data & ML",        color:"#2563eb", x:100,  y:440,
    desks:[{id:"priya",x:30,y:70},{id:"leon",x:200,y:70}], w:360, h:220 },
  { id:"design", label:"Design Studio",    color:"#db2777", x:560,  y:440,
    desks:[{id:"zoe",x:30,y:70},{id:"kai",x:200,y:70}], w:360, h:220 },
  { id:"ops",    label:"Ops & PM",         color:"#d97706", x:1140, y:80,
    desks:[{id:"ines",x:30,y:70},{id:"tom",x:30,y:260}], w:240, h:480 },
];

function agentAbsPos(agentId) {
  for (const t of TEAMS) {
    const d = t.desks.find(d => d.id === agentId);
    if (d) return { x: t.x + d.x + 44, y: t.y + d.y + 18 };
  }
  return { x:400, y:300 };
}

const DEFAULT_CHANNELS = [
  { id:"general",     name:"general",     desc:"Umumiy",  members:Object.keys(AGENTS), isChannel:true },
  { id:"engineering", name:"engineering", desc:"Texnik",  members:["marcus","yuki","omar","ines"], isChannel:true },
  { id:"design",      name:"design",      desc:"Dizayn",  members:["zoe","kai","omar"], isChannel:true },
  { id:"product",     name:"product",     desc:"Product", members:["tom","alex","sarah","priya"], isChannel:true },
];

async function callClaude(system, history, userMsg) {
  const msgs = [];
  for (const m of history) {
    const role = m.role==="assistant"?"assistant":"user";
    if (msgs.length && msgs[msgs.length-1].role===role) msgs[msgs.length-1].content+="\n"+m.content;
    else msgs.push({role,content:m.content});
  }
  if (!msgs.length||msgs[msgs.length-1].role!=="user") msgs.push({role:"user",content:userMsg});
  else msgs[msgs.length-1].content=userMsg;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:280,system,messages:msgs}),
    });
    const d = await res.json();
    return d.content?.[0]?.text||"...";
  } catch { return "Tarmoq xatosi."; }
}

function nowTime() {
  return new Date().toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"});
}

// ── DESK SVG ──────────────────────────────────────────────────────────────────
function Desk({agentId,x,y,isBusy,tick,isActive,onClick}){
  const a=AGENTS[agentId];
  const bob=Math.sin(tick*(isBusy?0.13:0.05))*(isBusy?1.4:0.35);
  const typing=isBusy&&tick%10<5;
  const kx=12+(tick%7)*4;
  return(
    <g transform={`translate(${x},${y})`} onClick={onClick} style={{cursor:"pointer"}}>
      {isActive&&<rect x="-4" y="-4" width="96" height="118" rx="8" fill="none" stroke={a.color} strokeWidth="1.8" strokeDasharray="5 3" opacity="0.9"><animate attributeName="stroke-dashoffset" values="0;-16" dur="1.2s" repeatCount="indefinite"/></rect>}
      <rect x="0" y="44" width="88" height="48" rx="3" fill="#fdfcfb" stroke={isActive?a.color:"#ddd9d4"} strokeWidth={isActive?1.2:0.6}/>
      <rect x="10" y="12" width="68" height="44" rx="3" fill="#181818"/>
      <rect x="12" y="14" width="64" height="40" rx="2" fill="#080c12"/>
      {isBusy?(
        <><rect x="12" y="14" width="64" height="40" rx="2" fill={a.color} opacity="0.07"/>
          <text x="44" y="30" fontSize="5" textAnchor="middle" fill={a.color} fontFamily="IBM Plex Mono,monospace" opacity="0.8">processing</text>
          <text x="44" y="39" fontSize="4.5" textAnchor="middle" fill={a.color} fontFamily="IBM Plex Mono,monospace" opacity="0.6">● thinking...</text>
          <rect x="14" y="43" width={20+(tick%30)} height="3" rx="1" fill={a.color} opacity="0.4"/></>
      ):(
        <><text x="16" y="26" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.3">const ai =</text>
          <text x="16" y="33" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.25">  new Agent()</text>
          <text x="16" y="40" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.2">// ready</text></>
      )}
      <rect x="38" y="38" width="4" height="8" rx="1" fill="#ccc8c3"/>
      <rect x="32" y="45" width="16" height="2" rx="1" fill="#ccc8c3"/>
      <rect x="10" y="58" width="32" height="12" rx="2" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4"/>
      {typing&&<rect x={kx} y="60" width="4" height="5" rx="0.8" fill={a.color} opacity="0.5"/>}
      <rect x="48" y="59" width="10" height="12" rx="5" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4"/>
      <g transform={`translate(44,${-1+bob})`}>
        <rect x="-5" y="8" width="10" height="9" rx="3" fill={a.color} opacity="0.15"/>
        {typing?<><rect x="-12" y="11" width="7" height="3" rx="1.5" fill={a.color} opacity="0.28" transform="rotate(-12,-8,12)"/><rect x="5" y="10" width="7" height="3" rx="1.5" fill={a.color} opacity="0.28" transform="rotate(12,9,11)"/></>
              :<><rect x="-11" y="11" width="6" height="3" rx="1.5" fill={a.color} opacity="0.18"/><rect x="5" y="11" width="6" height="3" rx="1.5" fill={a.color} opacity="0.18"/></>}
        <circle cx="0" cy="3" r="7" fill="#f2ede8"/>
        <circle cx="-2.3" cy="2.8" r="1.05" fill="#3a3530"/>
        <circle cx="2.3" cy="2.8" r="1.05" fill="#3a3530"/>
        <circle cx="-1.9" cy="2.4" r="0.3" fill="#fff" opacity="0.7"/>
        <circle cx="2.7" cy="2.4" r="0.3" fill="#fff" opacity="0.7"/>
        <path d={isBusy?"M-2 6 Q0 8 2 6":"M-1.5 6 Q0 7 1.5 6"} stroke="#8a7a70" strokeWidth="0.9" fill="none"/>
      </g>
      <circle cx="82" cy="18" r="4" fill={isBusy?"#22c55e":"#ddd9d4"}>
        {isBusy&&<animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/>}
      </circle>
      <text x="44" y="98" fontSize="6" textAnchor="middle" fill="#3a3530" fontFamily="IBM Plex Sans,sans-serif" fontWeight="500">{a.name.split(" ")[0]}</text>
      <text x="44" y="106" fontSize="5" textAnchor="middle" fill="#9a9490" fontFamily="IBM Plex Sans,sans-serif">{a.title.split(" ")[0]}</text>
    </g>
  );
}

// ── SPEECH BUBBLE ─────────────────────────────────────────────────────────────
function SpeechBubble({agentId,text}){
  const a=AGENTS[agentId];
  const p=agentAbsPos(agentId);
  const W=130,PX=7,LH=9.5,FZ=7;
  const cpl=Math.floor((W-PX*2)/(FZ*0.57));
  const words=text.split(" ");const lines=[];let cur="";
  for(const w of words){const t=cur?cur+" "+w:w;if(t.length>cpl){if(cur)lines.push(cur);cur=w;}else cur=t;}
  if(cur)lines.push(cur);
  const shown=lines.slice(0,4);if(lines.length>4)shown[3]=shown[3].slice(0,12)+"...";
  const BH=PX*2+shown.length*LH+6;
  const bx=p.x+30,by=Math.max(4,p.y-BH/2-10);
  const tailX=bx,tailY=by+BH*0.5;
  return(
    <g style={{pointerEvents:"none"}}>
      <filter id={`sh-${agentId}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={a.color} floodOpacity="0.2"/>
      </filter>
      <rect x={bx} y={by} width={W} height={BH} rx="7" fill="#fff" stroke={a.color} strokeWidth="1.1" filter={`url(#sh-${agentId})`}/>
      <path d={`M${tailX},${tailY-5} L${p.x},${p.y} L${tailX},${tailY+5} Z`} fill="#fff" stroke={a.color} strokeWidth="1.1"/>
      <line x1={tailX} y1={tailY-4} x2={tailX} y2={tailY+4} stroke="#fff" strokeWidth="2.5"/>
      <rect x={bx+PX} y={by+PX-1} width="18" height="12" rx="3" fill={a.color} opacity="0.12"/>
      <text x={bx+PX+9} y={by+PX+7.5} fontSize="6" textAnchor="middle" fill={a.color} fontFamily="IBM Plex Mono,monospace" fontWeight="600">{a.avatar}</text>
      {shown.map((line,i)=><text key={i} x={bx+PX+20} y={by+PX+9+i*LH} fontSize={FZ} fill="#2a2520" fontFamily="IBM Plex Sans,sans-serif" opacity="0.88">{line}</text>)}
    </g>
  );
}

// ── INFINITE CANVAS ───────────────────────────────────────────────────────────
const MIN_Z=0.15, MAX_Z=3;

function InfiniteCanvas({agentStates,bubbles,activeChannel,onAgentClick}){
  const [cam,setCam]=useState({x:0,y:0,s:0.8});
  const dragging=useRef(false);
  const last=useRef({x:0,y:0});
  const ref=useRef(null);

  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const onWheel=(e)=>{
      e.preventDefault();
      const r=el.getBoundingClientRect();
      const mx=e.clientX-r.left, my=e.clientY-r.top;
      const d=e.deltaY<0?1.1:0.9;
      setCam(p=>{
        const ns=Math.min(MAX_Z,Math.max(MIN_Z,p.s*d));
        const ratio=ns/p.s;
        return{s:ns,x:mx-ratio*(mx-p.x),y:my-ratio*(my-p.y)};
      });
    };
    el.addEventListener("wheel",onWheel,{passive:false});
    return()=>el.removeEventListener("wheel",onWheel);
  },[]);

  const onMD=e=>{if(e.button!==0)return;dragging.current=true;last.current={x:e.clientX,y:e.clientY};};
  const onMM=e=>{if(!dragging.current)return;const dx=e.clientX-last.current.x,dy=e.clientY-last.current.y;last.current={x:e.clientX,y:e.clientY};setCam(p=>({...p,x:p.x+dx,y:p.y+dy}));};
  const onMU=()=>{dragging.current=false;};

  // minimap constants
  const WORLD_W=1600,WORLD_H=900;
  const MW=150,MH=90;
  const msx=MW/WORLD_W,msy=MH/WORLD_H;

  return(
    <div ref={ref} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
      style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",
        cursor:dragging.current?"grabbing":"grab",userSelect:"none"}}>
      {/* Dot grid */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        <defs>
          <pattern id="dg" x={cam.x%(24*cam.s)} y={cam.y%(24*cam.s)} width={24*cam.s} height={24*cam.s} patternUnits="userSpaceOnUse">
            <circle cx={cam.s} cy={cam.s} r={Math.max(0.4,cam.s*0.5)} fill="#c8c4be" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f0ede8"/>
        <rect width="100%" height="100%" fill="url(#dg)"/>
      </svg>

      {/* Main SVG world */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <g transform={`translate(${cam.x},${cam.y}) scale(${cam.s})`}>
          {TEAMS.map(team=>(
            <g key={team.id} transform={`translate(${team.x},${team.y})`}>
              {/* Building shadow */}
              <rect x="4" y="4" width={team.w} height={team.h} rx="14" fill="#000" opacity="0.06"/>
              {/* Building */}
              <rect width={team.w} height={team.h} rx="12" fill="#fafaf8" stroke={team.color} strokeWidth="1.5" opacity="0.7"/>
              {/* Header bar */}
              <rect width={team.w} height="36" rx="12" fill={team.color} opacity="0.13"/>
              <rect y="24" width={team.w} height="12" fill={team.color} opacity="0.13"/>
              <circle cx="16" cy="18" r="6" fill={team.color} opacity="0.6"/>
              <text x="30" y="23" fontSize="10" fill={team.color} fontFamily="IBM Plex Sans,sans-serif" fontWeight="700" letterSpacing="0.4">
                {team.label.toUpperCase()}
              </text>
              {/* Zone label line */}
              <line x1="16" y1="42" x2={team.w-16} y2="42" stroke={team.color} strokeWidth="0.5" opacity="0.3"/>
              {/* Desks */}
              {team.desks.map(d=>(
                <Desk key={d.id} agentId={d.id} x={d.x} y={d.y}
                  isBusy={agentStates[d.id]?.isBusy||false}
                  tick={agentStates[d.id]?.tick||0}
                  isActive={activeChannel?.members?.includes(d.id)}
                  onClick={()=>onAgentClick(d.id)}/>
              ))}
            </g>
          ))}
          {/* Speech bubbles */}
          {Object.entries(bubbles).map(([id,text])=><SpeechBubble key={id} agentId={id} text={text}/>)}
        </g>
      </svg>

      {/* Zoom controls */}
      <div style={{position:"absolute",bottom:"112px",right:"14px",display:"flex",flexDirection:"column",gap:"4px",zIndex:20}}>
        {[["+",()=>setCam(p=>({...p,s:Math.min(MAX_Z,p.s*1.2)}))],
          ["−",()=>setCam(p=>({...p,s:Math.max(MIN_Z,p.s/1.2)}))],
          ["⊡",()=>setCam({x:20,y:20,s:0.8})]
        ].map(([lbl,fn])=>(
          <button key={lbl} onClick={fn} style={{width:"32px",height:"32px",borderRadius:"8px",
            background:"rgba(255,255,255,0.95)",border:"1px solid #e2ddd8",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"16px",cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
            color:"#4a4540",fontWeight:"600"}}>{lbl}</button>
        ))}
        <div style={{background:"rgba(255,255,255,0.9)",borderRadius:"6px",border:"1px solid #e2ddd8",
          padding:"3px 6px",fontSize:"9px",color:"#9a9490",textAlign:"center",fontFamily:"IBM Plex Mono,monospace"}}>
          {Math.round(cam.s*100)}%
        </div>
      </div>

      {/* Minimap */}
      <div style={{position:"absolute",bottom:"14px",right:"14px",zIndex:20,
        background:"rgba(255,255,255,0.93)",border:"1px solid #ddd9d4",
        borderRadius:"8px",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
        <div style={{fontSize:"7px",color:"#b0aca8",padding:"3px 7px",
          fontFamily:"IBM Plex Mono,monospace",borderBottom:"1px solid #eee"}}>MINIMAP</div>
        <svg width={MW} height={MH} style={{display:"block"}}>
          <rect width={MW} height={MH} fill="#f5f3f0"/>
          {TEAMS.map(t=>(
            <rect key={t.id} x={t.x*msx} y={t.y*msy} width={t.w*msx} height={t.h*msy}
              rx="2" fill={t.color} opacity="0.3" stroke={t.color} strokeWidth="0.6"/>
          ))}
          {/* Viewport rect */}
          {(()=>{
            const el=ref.current;if(!el)return null;
            const vw=el.clientWidth/cam.s,vh=el.clientHeight/cam.s;
            const vx=-cam.x/cam.s,vy=-cam.y/cam.s;
            return<rect x={vx*msx} y={vy*msy} width={vw*msx} height={vh*msy}
              fill="none" stroke="#5b6af0" strokeWidth="1.2" rx="1" opacity="0.8"/>;
          })()}
        </svg>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({channels,activeId,onSelect,onNewChannel,onOpenDM}){
  const regular=channels.filter(c=>c.isChannel);
  return(
    <div style={{width:"200px",background:"#111827",flexShrink:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"14px 14px 12px",borderBottom:"1px solid #1f2937"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{width:"30px",height:"30px",borderRadius:"8px",background:"#5b6af0",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"13px",fontWeight:"700",color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>AI</div>
          <div>
            <div style={{fontSize:"13px",fontWeight:"600",color:"#f9fafb"}}>AI Corp</div>
            <div style={{fontSize:"9px",color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>workspace</div>
          </div>
        </div>
      </div>
      <div style={{padding:"10px 10px 6px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 8px",borderRadius:"8px",background:"#1f2937"}}>
          <div style={{width:"26px",height:"26px",borderRadius:"7px",background:"#374151",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"11px",fontWeight:"700",color:"#f9fafb",fontFamily:"'IBM Plex Mono',monospace"}}>U</div>
          <div>
            <div style={{fontSize:"12px",fontWeight:"600",color:"#f9fafb"}}>Siz</div>
            <div style={{display:"flex",alignItems:"center",gap:"3px"}}>
              <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#22c55e"}}/>
              <span style={{fontSize:"9px",color:"#6b7280"}}>Online</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"2px 0"}}>
        <div style={{padding:"8px 12px 3px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:"9px",fontWeight:"600",color:"#6b7280",letterSpacing:"0.8px"}}>KANALLAR</span>
          <button onClick={onNewChannel} style={{background:"none",border:"none",color:"#6b7280",fontSize:"15px",cursor:"pointer",padding:"0 1px",lineHeight:1}}>+</button>
        </div>
        {regular.map(ch=>{
          const act=ch.id===activeId;
          return(
            <div key={ch.id} onClick={()=>onSelect(ch.id)} style={{display:"flex",alignItems:"center",gap:"6px",padding:"5px 12px",cursor:"pointer",background:act?"#1f2937":"transparent",transition:"background 0.1s"}}
              onMouseEnter={e=>{if(!act)e.currentTarget.style.background="#1a2332"}}
              onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent"}}>
              <span style={{color:act?"#e5e7eb":"#6b7280",fontSize:"12px"}}>#</span>
              <span style={{fontSize:"12px",color:act?"#f9fafb":"#9ca3af",fontWeight:act?"500":"400",flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ch.name}</span>
              <span style={{fontSize:"9px",color:"#4b5563",fontFamily:"'IBM Plex Mono',monospace"}}>{ch.members.length}</span>
            </div>
          );
        })}
        <div style={{padding:"10px 12px 3px"}}>
          <span style={{fontSize:"9px",fontWeight:"600",color:"#6b7280",letterSpacing:"0.8px"}}>DM</span>
        </div>
        {Object.keys(AGENTS).map(id=>{
          const a=AGENTS[id];const dmId=`dm-${id}`;const act=dmId===activeId;
          return(
            <div key={id} onClick={()=>onOpenDM(id)} style={{display:"flex",alignItems:"center",gap:"7px",padding:"4px 12px",cursor:"pointer",background:act?"#1f2937":"transparent",transition:"background 0.1s"}}
              onMouseEnter={e=>{if(!act)e.currentTarget.style.background="#1a2332"}}
              onMouseLeave={e=>{if(!act)e.currentTarget.style.background="transparent"}}>
              <div style={{width:"18px",height:"18px",borderRadius:"5px",flexShrink:0,background:a.bg,border:`1px solid ${a.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"7px",fontWeight:"600",color:a.color,fontFamily:"'IBM Plex Mono',monospace"}}>{a.avatar}</div>
              <span style={{fontSize:"12px",flex:1,color:act?"#f9fafb":"#6b7280",fontWeight:act?"500":"400",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CHAT MESSAGE ──────────────────────────────────────────────────────────────
function ChatMessage({msg,prevMsg}){
  const isUser=msg.sender==="user";
  const a=!isUser?AGENTS[msg.sender]:null;
  const showH=!prevMsg||prevMsg.sender!==msg.sender||(msg.ts-prevMsg.ts)>300000;
  return(
    <div style={{display:"flex",gap:"9px",padding:showH?"10px 16px 2px":"2px 16px 2px",alignItems:"flex-start"}}>
      <div style={{width:32,flexShrink:0,marginTop:"1px"}}>
        {showH&&(isUser
          ?<div style={{width:32,height:32,borderRadius:"8px",background:"#111827",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>U</div>
          :<div style={{width:32,height:32,borderRadius:"8px",background:a.bg,border:`1.5px solid ${a.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"600",color:a.color,fontFamily:"'IBM Plex Mono',monospace"}}>{a.avatar}</div>
        )}
      </div>
      <div style={{flex:1,minWidth:0}}>
        {showH&&(
          <div style={{display:"flex",alignItems:"baseline",gap:"7px",marginBottom:"3px"}}>
            <span style={{fontSize:"13px",fontWeight:"600",color:isUser?"#111827":(a?.color||"#374151"),fontFamily:"'IBM Plex Sans',sans-serif"}}>{isUser?"Siz":a?.name}</span>
            {!isUser&&a&&<span style={{fontSize:"10px",color:"#9ca3af",fontFamily:"'IBM Plex Mono',monospace"}}>{a.title}</span>}
            <span style={{fontSize:"10px",color:"#d1d5db",fontFamily:"'IBM Plex Mono',monospace",marginLeft:"auto"}}>{msg.time}</span>
          </div>
        )}
        <div style={{fontSize:"13px",color:isUser?"#111827":"#1f2937",lineHeight:"1.65",fontFamily:"'IBM Plex Sans',sans-serif",wordBreak:"break-word"}}>{msg.text}</div>
      </div>
    </div>
  );
}

// ── NEW CHANNEL MODAL ─────────────────────────────────────────────────────────
function NewChannelModal({onClose,onCreate}){
  const [name,setName]=useState("");const [sel,setSel]=useState([]);
  const toggle=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"14px",width:"360px",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{fontSize:"14px",fontWeight:"600",color:"#111827"}}>Yangi kanal</div>
        </div>
        <div style={{padding:"14px 20px"}}>
          <div style={{marginBottom:"14px"}}>
            <div style={{fontSize:"11px",fontWeight:"600",color:"#374151",marginBottom:"5px"}}>Kanal nomi</div>
            <div style={{display:"flex",alignItems:"center",gap:"5px",border:"1.5px solid #e5e7eb",borderRadius:"8px",padding:"0 10px",background:"#fafafa"}}>
              <span style={{color:"#9ca3af",fontSize:"13px"}}>#</span>
              <input value={name} onChange={e=>setName(e.target.value.toLowerCase().replace(/\s+/g,"-"))} placeholder="kanal-nomi"
                style={{flex:1,border:"none",background:"transparent",fontSize:"13px",color:"#111827",padding:"9px 0",outline:"none",fontFamily:"'IBM Plex Mono',monospace"}}/>
            </div>
          </div>
          <div style={{fontSize:"11px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>A'zolar</div>
          <div style={{maxHeight:"190px",overflowY:"auto"}}>
            {Object.keys(AGENTS).map(id=>{const a=AGENTS[id];const s=sel.includes(id);return(
              <div key={id} onClick={()=>toggle(id)} style={{display:"flex",alignItems:"center",gap:"9px",padding:"6px 8px",borderRadius:"7px",cursor:"pointer",background:s?`${a.color}0e`:"transparent",transition:"background 0.1s"}}>
                <div style={{width:24,height:24,borderRadius:"6px",background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",fontWeight:"600",color:a.color,fontFamily:"'IBM Plex Mono',monospace",border:`1px solid ${a.color}25`}}>{a.avatar}</div>
                <span style={{fontSize:"12px",flex:1,color:"#111827"}}>{a.name}</span>
                <div style={{width:"15px",height:"15px",borderRadius:"4px",border:`2px solid ${s?a.color:"#d1d5db"}`,background:s?a.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {s&&<span style={{color:"#fff",fontSize:"8px",fontWeight:"700"}}>✓</span>}
                </div>
              </div>
            );})}
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",display:"flex",gap:"8px",justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 14px",borderRadius:"8px",border:"1px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:"12px",cursor:"pointer"}}>Bekor</button>
          <button onClick={()=>{if(name.trim()){onCreate(name.trim(),sel);onClose();}}} disabled={!name.trim()} style={{padding:"7px 16px",borderRadius:"8px",border:"none",background:name.trim()?"#111827":"#e5e7eb",color:name.trim()?"#fff":"#9ca3af",fontSize:"12px",cursor:name.trim()?"pointer":"default",fontWeight:"500"}}>Yaratish</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [channels,setChannels]=useState(DEFAULT_CHANNELS);
  const [activeId,setActiveId]=useState("general");
  const [messages,setMessages]=useState({});
  const [agentStates,setAgentStates]=useState(()=>Object.fromEntries(Object.keys(AGENTS).map(id=>[id,{isBusy:false,tick:Math.floor(Math.random()*80)}])));
  const [bubbles,setBubbles]=useState({});
  const [typingIn,setTypingIn]=useState({});
  const [input,setInput]=useState("");
  const [showNewCh,setShowNewCh]=useState(false);
  const historyRef=useRef({});
  const bottomRef=useRef(null);

  const active=channels.find(c=>c.id===activeId);
  const msgs=messages[activeId]||[];
  const typingAgents=typingIn[activeId]||[];

  useEffect(()=>{
    const iv=setInterval(()=>{
      setAgentStates(prev=>{const n={...prev};Object.keys(AGENTS).forEach(id=>{n[id]={...n[id],tick:(n[id].tick||0)+1};});return n;});
    },100);
    return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,typingAgents]);

  const showBubble=useCallback((agentId,text)=>{
    setBubbles(p=>({...p,[agentId]:text}));
    setTimeout(()=>setBubbles(p=>{const n={...p};delete n[agentId];return n;}),6500);
  },[]);

  const addMsg=useCallback((chId,msg)=>{
    setMessages(p=>({...p,[chId]:[...(p[chId]||[]),msg]}));
  },[]);

  const agentRespond=useCallback(async(chId,agentId,ctx)=>{
    const hKey=`${chId}:${agentId}`;
    if(!historyRef.current[hKey])historyRef.current[hKey]=[];
    const history=historyRef.current[hKey];
    setTypingIn(p=>({...p,[chId]:[...(p[chId]||[]),agentId]}));
    setAgentStates(p=>({...p,[agentId]:{...p[agentId],isBusy:true}}));
    await new Promise(r=>setTimeout(r,700+Math.random()*1400));
    const reply=await callClaude(AGENT_SYSTEMS[agentId],history,ctx);
    historyRef.current[hKey]=[...history,{role:"user",content:ctx},{role:"assistant",content:reply}].slice(-24);
    setTypingIn(p=>({...p,[chId]:(p[chId]||[]).filter(x=>x!==agentId)}));
    setAgentStates(p=>({...p,[agentId]:{...p[agentId],isBusy:false}}));
    addMsg(chId,{sender:agentId,text:reply,time:nowTime(),ts:Date.now()});
    showBubble(agentId,reply);
  },[addMsg,showBubble]);

  const handleSend=useCallback(async()=>{
    const text=input.trim();if(!text||!active)return;
    setInput("");
    addMsg(activeId,{sender:"user",text,time:nowTime(),ts:Date.now()});
    const mentioned=active.members.filter(id=>text.toLowerCase().includes(`@${AGENTS[id].name.split(" ")[0].toLowerCase()}`));
    const ctx=active.isChannel?`[#${active.name}] Siz: "${text}"`:` Siz: "${text}"`;
    if(active.isDM){agentRespond(activeId,active.dmAgent,ctx);}
    else if(mentioned.length>0){mentioned.forEach(id=>setTimeout(()=>agentRespond(activeId,id,ctx),Math.random()*200));}
    else{const pick=[...active.members].sort(()=>Math.random()-0.5).slice(0,Math.min(2,active.members.length));pick.forEach(id=>setTimeout(()=>agentRespond(activeId,id,ctx),Math.random()*600));}
  },[input,active,activeId,agentRespond,addMsg]);

  const openDM=useCallback(id=>{
    const dmId=`dm-${id}`;
    if(!channels.find(c=>c.id===dmId)){
      const a=AGENTS[id];
      setChannels(p=>[...p,{id:dmId,name:a.name,desc:a.title,members:[id],isChannel:false,isDM:true,dmAgent:id}]);
    }
    setActiveId(dmId);
  },[channels]);

  const handleCreateChannel=useCallback((name,members)=>{
    const id=`ch-${name}-${Date.now()}`;
    setChannels(p=>[...p,{id,name,desc:"",members,isChannel:true}]);
    setActiveId(id);
  },[]);

  return(
    <>
      <link href={FONT} rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-4px);opacity:1}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
        textarea,button,input{font-family:'IBM Plex Sans',sans-serif;}
      `}</style>
      <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",background:"#f5f3f0",overflow:"hidden",fontFamily:"'IBM Plex Sans',sans-serif"}}>

        {/* TOPBAR */}
        <div style={{height:"46px",background:"#0d1117",borderBottom:"1px solid #1f2937",display:"flex",alignItems:"center",padding:"0 18px",gap:"12px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"26px",height:"26px",borderRadius:"7px",background:"#5b6af0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>AI</div>
            <span style={{fontSize:"13px",fontWeight:"600",color:"#f9fafb"}}>AI Corp</span>
            <span style={{fontSize:"10px",color:"#4b5563",fontFamily:"'IBM Plex Mono',monospace"}}>Infinite Workspace</span>
          </div>
          <div style={{flex:1}}/>
          {TEAMS.map(t=>(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:"4px"}}>
              <div style={{width:"6px",height:"6px",borderRadius:"50%",background:t.color,opacity:0.8}}/>
              <span style={{fontSize:"9px",color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>{t.label}</span>
            </div>
          ))}
          <div style={{width:"1px",height:"20px",background:"#1f2937",margin:"0 4px"}}/>
          <span style={{fontSize:"10px",color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>
            {Object.values(agentStates).filter(s=>s.isBusy).length} band
          </span>
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <Sidebar channels={channels} activeId={activeId} onSelect={setActiveId} onNewChannel={()=>setShowNewCh(true)} onOpenDM={openDM}/>

          {/* CANVAS */}
          <div style={{flex:"0 0 55%",minWidth:"480px",borderRight:"1px solid #e2ddd8",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"8px 14px",borderBottom:"1px solid #e2ddd8",background:"#fff",display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
              <span style={{fontSize:"12px",fontWeight:"600",color:"#4a4540"}}>Ofis xaritasi</span>
              <span style={{fontSize:"10px",color:"#b0aca8",fontFamily:"'IBM Plex Mono',monospace"}}>· scroll=zoom · drag=pan · agent bosish=DM</span>
              <div style={{marginLeft:"auto",display:"flex",gap:"6px"}}>
                {Object.keys(AGENTS).filter(id=>agentStates[id]?.isBusy).map(id=>(
                  <div key={id} style={{fontSize:"10px",color:AGENTS[id].color,fontFamily:"'IBM Plex Mono',monospace",display:"flex",alignItems:"center",gap:"3px"}}>
                    <div style={{width:"5px",height:"5px",borderRadius:"50%",background:AGENTS[id].color,animation:"typingDot 1.2s ease-in-out infinite"}}/>
                    {AGENTS[id].name.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
            <div style={{flex:1,overflow:"hidden"}}>
              <InfiniteCanvas agentStates={agentStates} bubbles={bubbles} activeChannel={active} onAgentClick={openDM}/>
            </div>
          </div>

          {/* CHAT */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#fff",minWidth:"280px"}}>
            <div style={{height:"52px",borderBottom:"1px solid #f3f4f6",display:"flex",alignItems:"center",padding:"0 16px",gap:"8px",flexShrink:0}}>
              {active?.isChannel?<span style={{fontSize:"15px",color:"#9ca3af"}}>#</span>
                :active?.dmAgent?<div style={{width:"26px",height:"26px",borderRadius:"7px",background:AGENTS[active.dmAgent]?.bg,border:`1.5px solid ${AGENTS[active.dmAgent]?.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:"600",color:AGENTS[active.dmAgent]?.color,fontFamily:"'IBM Plex Mono',monospace"}}>{AGENTS[active.dmAgent]?.avatar}</div>:null}
              <div style={{flex:1}}>
                <div style={{fontSize:"13px",fontWeight:"600",color:"#111827"}}>{active?.isChannel?active.name:active?.name}</div>
                {active?.isChannel&&<div style={{fontSize:"10px",color:"#9ca3af"}}>{active.members.length} a'zo · {active.desc}</div>}
                {active?.isDM&&active.dmAgent&&<div style={{fontSize:"10px",color:AGENTS[active.dmAgent]?.color}}>{agentStates[active.dmAgent]?.isBusy?"● yozmoqda...":"● online"}</div>}
              </div>
              {active?.isChannel&&(
                <div style={{display:"flex",alignItems:"center",gap:"3px"}}>
                  {active.members.slice(0,4).map((id,i)=>(
                    <div key={id} style={{width:"22px",height:"22px",borderRadius:"6px",background:AGENTS[id].bg,border:`1.5px solid ${AGENTS[id].color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"7.5px",fontWeight:"600",color:AGENTS[id].color,fontFamily:"'IBM Plex Mono',monospace",marginLeft:i?"-4px":0,zIndex:4-i}}>{AGENTS[id].avatar}</div>
                  ))}
                  {active.members.length>4&&<div style={{width:"22px",height:"22px",borderRadius:"6px",background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px",color:"#6b7280",fontWeight:"600",marginLeft:"-4px"}}>+{active.members.length-4}</div>}
                </div>
              )}
            </div>

            <div style={{flex:1,overflowY:"auto",background:"#fff"}}>
              {msgs.length===0&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"10px",color:"#9ca3af"}}>
                  <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>{active?.isChannel?"#":"💬"}</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"13px",fontWeight:"600",color:"#374151",marginBottom:"3px"}}>{active?.isChannel?`#${active.name}`:active?.name}</div>
                    <div style={{fontSize:"11px",lineHeight:"1.7",color:"#9ca3af"}}>{active?.isChannel?"@Ism bilan mention qiling yoki oddiy yozing":`${active?.name} ga xabar yuboring`}</div>
                  </div>
                </div>
              )}
              {msgs.map((msg,i)=>msg.sender==="system"
                ?<div key={i} style={{textAlign:"center",padding:"6px",fontSize:"10px",color:"#9ca3af",fontFamily:"'IBM Plex Mono',monospace"}}>{msg.text}</div>
                :<ChatMessage key={i} msg={msg} prevMsg={msgs[i-1]}/>
              )}
              {typingAgents.length>0&&(
                <div style={{display:"flex",gap:"9px",padding:"5px 16px 8px",alignItems:"center"}}>
                  <div style={{width:32}}/>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    {typingAgents.slice(0,3).map(id=>(
                      <div key={id} style={{width:"20px",height:"20px",borderRadius:"5px",background:AGENTS[id].bg,border:`1px solid ${AGENTS[id].color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"7.5px",fontWeight:"600",color:AGENTS[id].color,fontFamily:"'IBM Plex Mono',monospace"}}>{AGENTS[id].avatar}</div>
                    ))}
                    <span style={{fontSize:"11px",color:"#9ca3af",fontStyle:"italic"}}>{typingAgents.map(id=>AGENTS[id]?.name.split(" ")[0]).join(", ")} yozmoqda</span>
                    <span style={{display:"inline-flex",gap:"3px",alignItems:"center"}}>
                      {[0,1,2].map(i=><span key={i} style={{width:"4px",height:"4px",borderRadius:"50%",background:"#9ca3af",display:"inline-block",animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite`}}/>)}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            <div style={{padding:"10px 14px 14px",borderTop:"1px solid #f3f4f6",flexShrink:0}}>
              <div style={{border:"1.5px solid #e5e7eb",borderRadius:"11px",background:"#fafafa",display:"flex",alignItems:"flex-end",gap:"6px",padding:"8px 12px",transition:"border-color 0.15s"}}
                onFocusCapture={e=>e.currentTarget.style.borderColor="#5b6af0"}
                onBlurCapture={e=>e.currentTarget.style.borderColor="#e5e7eb"}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}}
                  placeholder={active?.isChannel?`#${active?.name} · @Ism bilan mention qiling`:`${active?.name||"..."} ga yozing`}
                  rows={1} style={{flex:1,resize:"none",border:"none",background:"transparent",fontSize:"13px",color:"#111827",lineHeight:"1.6",fontFamily:"'IBM Plex Sans',sans-serif",maxHeight:"100px",overflowY:"auto"}}/>
                <button onClick={handleSend} disabled={!input.trim()} style={{width:"32px",height:"32px",borderRadius:"8px",flexShrink:0,background:input.trim()?"#111827":"#e5e7eb",border:"none",cursor:input.trim()?"pointer":"default",color:input.trim()?"#fff":"#9ca3af",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>↑</button>
              </div>
              <div style={{marginTop:"5px",fontSize:"10px",color:"#d1d5db",fontFamily:"'IBM Plex Mono',monospace",paddingLeft:"3px"}}>
                Enter = yuborish · @Ism = mention · scroll = zoom · drag = pan
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNewCh&&<NewChannelModal onClose={()=>setShowNewCh(false)} onCreate={handleCreateChannel}/>}
    </>
  );
}
