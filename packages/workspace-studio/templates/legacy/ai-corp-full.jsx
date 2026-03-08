import { useState, useEffect, useRef, useCallback } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";

const BASE_RULES = `
QOIDALAR:
- Sen REAL xodimsan. Hech qachon "AI", "Claude", "assistant" dema.
- Faqat o'z sohasida gapir. Qisqa, professional, O'zbek tilida (2-4 gap).
- Kim yozganini ko'rib, unga mos javob ber.`;

const AGENTS = {
  alex:   { id:"alex",   name:"Alex Chen",     title:"CEO",             avatar:"AC", color:"#5b6af0", bg:"#eef0ff" },
  sarah:  { id:"sarah",  name:"Sarah Park",     title:"COO",             avatar:"SP", color:"#7c3aed", bg:"#f3eeff" },
  marcus: { id:"marcus", name:"Marcus Webb",    title:"CTO",             avatar:"MW", color:"#0891b2", bg:"#e0f7fa" },
  yuki:   { id:"yuki",   name:"Yuki Tanaka",    title:"Senior Engineer", avatar:"YT", color:"#059669", bg:"#e6faf3" },
  omar:   { id:"omar",   name:"Omar Rashid",    title:"Frontend Eng",    avatar:"OR", color:"#16a34a", bg:"#edfaf2" },
  priya:  { id:"priya",  name:"Priya Nair",     title:"Data Scientist",  avatar:"PN", color:"#2563eb", bg:"#eff6ff" },
  leon:   { id:"leon",   name:"Leon Müller",    title:"ML Engineer",     avatar:"LM", color:"#1d4ed8", bg:"#eff6ff" },
  zoe:    { id:"zoe",    name:"Zoe Laurent",    title:"Head of Design",  avatar:"ZL", color:"#db2777", bg:"#fdf2f8" },
  kai:    { id:"kai",    name:"Kai Okonkwo",    title:"Brand Designer",  avatar:"KO", color:"#9333ea", bg:"#fdf4ff" },
  ines:   { id:"ines",   name:"Ines Ferreira",  title:"DevOps",          avatar:"IF", color:"#d97706", bg:"#fffbeb" },
  tom:    { id:"tom",    name:"Tom Bradley",    title:"Product Manager", avatar:"TB", color:"#b45309", bg:"#fef9ee" },
};

const AGENT_SYSTEMS = {
  alex:   `Sen AI Corp CEO Alex Chensen. Strategiya, biznes, investorlar. Jamoa: Sarah(COO), Marcus(CTO), Tom(PM).${BASE_RULES}`,
  sarah:  `Sen AI Corp COO Sarah Parksan. Operatsiyalar, jarayonlar, KPI.${BASE_RULES}`,
  marcus: `Sen AI Corp CTO Marcus Webbsan. Texnik arxitektura, engineering.${BASE_RULES}`,
  yuki:   `Sen Senior Engineer Yuki Tanakasan. Node.js, PostgreSQL, API.${BASE_RULES}`,
  omar:   `Sen Frontend Engineer Omar Rashidsan. React, TypeScript, UI.${BASE_RULES}`,
  priya:  `Sen Data Scientist Priya Nairsan. Tahlil, metrikalar, A/B test.${BASE_RULES}`,
  leon:   `Sen ML Engineer Leon Müllersen. Model training, MLOps.${BASE_RULES}`,
  zoe:    `Sen Head of Design Zoe Laurentsan. UX strategiya, dizayn tizimi.${BASE_RULES}`,
  kai:    `Sen Brand Designer Kai Okonkwoilsan. Vizual identitet, typography.${BASE_RULES}`,
  ines:   `Sen DevOps Engineer Ines Ferreirasan. CI/CD, Docker/K8s, monitoring.${BASE_RULES}`,
  tom:    `Sen Product Manager Tom Bradleysan. Roadmap, sprint, koordinatsiya.${BASE_RULES}`,
};

// Office layout
const ZONES = [
  { id:"exec",    label:"Executive",   x:14,  y:14,  w:310, h:190, agents:["alex","sarah"] },
  { id:"eng",     label:"Engineering", x:340, y:14,  w:370, h:190, agents:["marcus","yuki","omar"] },
  { id:"data",    label:"Data & ML",   x:14,  y:220, w:260, h:180, agents:["priya","leon"] },
  { id:"design",  label:"Design",      x:290, y:220, w:240, h:180, agents:["zoe","kai"] },
  { id:"ops",     label:"Ops & PM",    x:546, y:220, w:164, h:180, agents:["ines","tom"] },
];

const DESK_OFFSETS = {
  exec:   [{x:24,y:52},{x:190,y:52}],
  eng:    [{x:16,y:52},{x:138,y:52},{x:260,y:52}],
  data:   [{x:16,y:52},{x:148,y:52}],
  design: [{x:16,y:52},{x:138,y:52}],
  ops:    [{x:16,y:44},{x:16,y:130}],
};

function agentPos(id) {
  for (const z of ZONES) {
    const i = z.agents.indexOf(id);
    if (i >= 0) return { x: z.x + DESK_OFFSETS[z.id][i].x + 43, y: z.y + DESK_OFFSETS[z.id][i].y + 18 };
  }
  return { x:380, y:210 };
}

const DEFAULT_CHANNELS = [
  { id:"general",     name:"general",     desc:"Umumiy",       members:Object.keys(AGENTS), isChannel:true },
  { id:"engineering", name:"engineering", desc:"Texnik",        members:["marcus","yuki","omar","ines"], isChannel:true },
  { id:"design",      name:"design",      desc:"Dizayn",        members:["zoe","kai","omar"], isChannel:true },
  { id:"product",     name:"product",     desc:"Product",       members:["tom","alex","sarah","priya"], isChannel:true },
];

async function callClaude(system, history, userMsg) {
  const msgs = [];
  for (const m of history) {
    const role = m.role === "assistant" ? "assistant" : "user";
    if (msgs.length && msgs[msgs.length-1].role === role)
      msgs[msgs.length-1].content += "\n" + m.content;
    else msgs.push({ role, content: m.content });
  }
  if (!msgs.length || msgs[msgs.length-1].role !== "user")
    msgs.push({ role:"user", content: userMsg });
  else msgs[msgs.length-1].content = userMsg;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:280, system, messages:msgs }),
    });
    const d = await res.json();
    return d.content?.[0]?.text || "...";
  } catch { return "Tarmoq xatosi."; }
}

function nowTime() {
  return new Date().toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"});
}

// ── SVG DESK ─────────────────────────────────────────────────────────────────
function Desk({ agentId, pos, isBusy, tick, isActive, onClick }) {
  const a = AGENTS[agentId];
  const bob = Math.sin(tick * (isBusy ? 0.13 : 0.05)) * (isBusy ? 1.4 : 0.35);
  const typing = isBusy && tick % 10 < 5;
  const kx = 12 + (tick % 7) * 4;
  return (
    <g transform={`translate(${pos.x},${pos.y})`} onClick={onClick} style={{cursor:"pointer"}}>
      {isActive && (
        <rect x="-4" y="-4" width="96" height="118" rx="8"
          fill="none" stroke={a.color} strokeWidth="1.8" strokeDasharray="5 3" opacity="0.9">
          <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      )}
      {/* Desk surface */}
      <rect x="0" y="44" width="88" height="48" rx="3" fill="#fdfcfb" stroke={isActive ? a.color : "#ddd9d4"} strokeWidth={isActive ? 1.2 : 0.6}/>
      {/* Monitor */}
      <rect x="10" y="12" width="68" height="44" rx="3" fill="#181818"/>
      <rect x="12" y="14" width="64" height="40" rx="2" fill="#080c12"/>
      {isBusy ? (
        <>
          <rect x="12" y="14" width="64" height="40" rx="2" fill={a.color} opacity="0.07"/>
          <text x="44" y="30" fontSize="5" textAnchor="middle" fill={a.color} fontFamily="IBM Plex Mono,monospace" opacity="0.8">processing</text>
          <text x="44" y="39" fontSize="4.5" textAnchor="middle" fill={a.color} fontFamily="IBM Plex Mono,monospace" opacity="0.6">● thinking...</text>
          <rect x="14" y="43" width={20 + (tick % 30)} height="3" rx="1" fill={a.color} opacity="0.4"/>
        </>
      ) : (
        <>
          <text x="16" y="26" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.3">const ai =</text>
          <text x="16" y="33" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.25">  new Agent()</text>
          <text x="16" y="40" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono,monospace" opacity="0.2">// ready</text>
        </>
      )}
      {/* Monitor stand */}
      <rect x="38" y="38" width="4" height="8" rx="1" fill="#ccc8c3"/>
      <rect x="32" y="45" width="16" height="2" rx="1" fill="#ccc8c3"/>
      {/* Keyboard */}
      <rect x="10" y="58" width="32" height="12" rx="2" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4"/>
      {typing && <rect x={kx} y="60" width="4" height="5" rx="0.8" fill={a.color} opacity="0.5"/>}
      {/* Mouse */}
      <rect x="48" y="59" width="10" height="12" rx="5" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4"/>
      {/* Person */}
      <g transform={`translate(44,${-1 + bob})`}>
        <rect x="-5" y="8" width="10" height="9" rx="3" fill={a.color} opacity="0.15"/>
        {typing
          ? <><rect x="-12" y="11" width="7" height="3" rx="1.5" fill={a.color} opacity="0.28" transform="rotate(-12,-8,12)"/>
               <rect x="5" y="10" width="7" height="3" rx="1.5" fill={a.color} opacity="0.28" transform="rotate(12,9,11)"/></>
          : <><rect x="-11" y="11" width="6" height="3" rx="1.5" fill={a.color} opacity="0.18"/>
               <rect x="5" y="11" width="6" height="3" rx="1.5" fill={a.color} opacity="0.18"/></>}
        <circle cx="0" cy="3" r="7" fill="#f2ede8"/>
        <circle cx="-2.3" cy="2.8" r="1.05" fill="#3a3530"/>
        <circle cx="2.3" cy="2.8" r="1.05" fill="#3a3530"/>
        <circle cx="-1.9" cy="2.4" r="0.3" fill="#fff" opacity="0.7"/>
        <circle cx="2.7" cy="2.4" r="0.3" fill="#fff" opacity="0.7"/>
        <path d={isBusy ? "M-2 6 Q0 8 2 6" : "M-1.5 6 Q0 7 1.5 6"} stroke="#8a7a70" strokeWidth="0.9" fill="none"/>
      </g>
      {/* Status dot */}
      <circle cx="82" cy="18" r="4" fill={isBusy ? "#22c55e" : "#ddd9d4"}>
        {isBusy && <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/>}
      </circle>
      {/* Name */}
      <text x="44" y="98" fontSize="6" textAnchor="middle" fill="#3a3530" fontFamily="IBM Plex Sans,sans-serif" fontWeight="500">{a.name.split(" ")[0]}</text>
      <text x="44" y="106" fontSize="5" textAnchor="middle" fill="#9a9490" fontFamily="IBM Plex Sans,sans-serif">{a.title.split(" ")[0]}</text>
    </g>
  );
}

// ── SVG SPEECH BUBBLE ─────────────────────────────────────────────────────────
function SpeechBubble({ agentId, text }) {
  const a = AGENTS[agentId];
  const p = agentPos(agentId);
  const W = 130, PX = 7, LH = 9.5, FZ = 7;
  const cpl = Math.floor((W - PX*2) / (FZ * 0.57));
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur+" "+w : w;
    if (t.length > cpl) { if(cur) lines.push(cur); cur = w; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  const shown = lines.slice(0,4);
  if (lines.length > 4) shown[3] = shown[3].slice(0,12)+"...";
  const BH = PX*2 + shown.length*LH + 6;
  const goRight = p.x < 420;
  const bx = goRight ? p.x + 30 : p.x - W - 20;
  const by = Math.max(4, p.y - BH/2 - 10);
  const tailX = goRight ? bx : bx + W;
  const tailY = by + BH * 0.5;
  return (
    <g style={{pointerEvents:"none"}}>
      <filter id={`sh-${agentId}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={a.color} floodOpacity="0.2"/>
      </filter>
      <rect x={bx} y={by} width={W} height={BH} rx="7"
        fill="#fff" stroke={a.color} strokeWidth="1.1" filter={`url(#sh-${agentId})`}/>
      <path d={`M${tailX},${tailY-5} L${p.x},${p.y} L${tailX},${tailY+5} Z`}
        fill="#fff" stroke={a.color} strokeWidth="1.1"/>
      <line x1={tailX} y1={tailY-4} x2={tailX} y2={tailY+4} stroke="#fff" strokeWidth="2.5"/>
      <rect x={bx+PX} y={by+PX-1} width="18" height="12" rx="3" fill={a.color} opacity="0.12"/>
      <text x={bx+PX+9} y={by+PX+7.5} fontSize="6" textAnchor="middle"
        fill={a.color} fontFamily="IBM Plex Mono,monospace" fontWeight="600">{a.avatar}</text>
      {shown.map((line, i) => (
        <text key={i} x={bx+PX+20} y={by+PX+9+i*LH} fontSize={FZ}
          fill="#2a2520" fontFamily="IBM Plex Sans,sans-serif" opacity="0.88">{line}</text>
      ))}
    </g>
  );
}

// ── OFFICE MAP ────────────────────────────────────────────────────────────────
function OfficeMap({ agentStates, bubbles, activeChannel, onAgentClick }) {
  return (
    <svg viewBox="0 0 730 415" style={{width:"100%",height:"100%",display:"block"}}
      preserveAspectRatio="xMidYMid meet">
      <rect width="730" height="415" fill="#f5f3f0"/>
      {/* Dot grid */}
      {Array.from({length:30}).map((_,i)=>Array.from({length:17}).map((_,j)=>(
        <circle key={`${i}-${j}`} cx={i*25+10} cy={j*25+10} r="0.7" fill="#d8d4cf" opacity="0.22"/>
      )))}
      {/* Dividers */}
      <line x1="14" y1="210" x2="716" y2="210" stroke="#e2ddd8" strokeWidth="0.7" strokeDasharray="4 4" opacity="0.5"/>
      <line x1="330" y1="14" x2="330" y2="210" stroke="#e2ddd8" strokeWidth="0.7" strokeDasharray="4 4" opacity="0.4"/>

      {/* Zones */}
      {ZONES.map(z => (
        <g key={z.id} transform={`translate(${z.x},${z.y})`}>
          <rect width={z.w} height={z.h} rx="6" fill="#fafaf8" stroke="#ddd9d4" strokeWidth="1"/>
          <line x1="0" y1="0" x2="0" y2={z.h} stroke="#c8c4be" strokeWidth="2.2"/>
          <line x1={z.w} y1="0" x2={z.w} y2={z.h} stroke="#c8c4be" strokeWidth="2.2"/>
          <line x1="0" y1={z.h} x2={z.w} y2={z.h} stroke="#c8c4be" strokeWidth="2.2"/>
          <rect x="10" y="8" width={z.label.length*6+12} height="14" rx="3" fill="#fff"/>
          <text x="16" y="18" fontSize="7.5" fill="#6a6460"
            fontFamily="IBM Plex Sans,sans-serif" fontWeight="600" letterSpacing="0.3">{z.label}</text>
          {z.agents.map((id, i) => (
            <Desk key={id}
              agentId={id}
              pos={DESK_OFFSETS[z.id][i]}
              isBusy={agentStates[id]?.isBusy || false}
              tick={agentStates[id]?.tick || 0}
              isActive={activeChannel?.members?.includes(id)}
              onClick={() => onAgentClick(id)}
            />
          ))}
        </g>
      ))}

      {/* Coffee corner */}
      <g transform="translate(632,14)">
        <rect width="84" height="46" rx="5" fill="#fff" stroke="#e8e4df" strokeWidth="0.8"/>
        <text x="8" y="12" fontSize="5.5" fill="#b0aca8" fontFamily="IBM Plex Sans,sans-serif" fontWeight="600" letterSpacing="0.4">COFFEE</text>
        <rect x="8" y="16" width="22" height="16" rx="2" fill="#f0ede8" stroke="#e2ddd8" strokeWidth="0.4"/>
        <circle cx="19" cy="36" r="4" fill="#f0ede8" stroke="#e2ddd8" strokeWidth="0.4"/>
        <rect x="36" y="15" width="40" height="4" rx="1.5" fill="#f0ede8"/>
        <rect x="36" y="22" width="34" height="4" rx="1.5" fill="#f0ede8"/>
        <rect x="36" y="29" width="38" height="4" rx="1.5" fill="#f0ede8"/>
      </g>
      <g transform="translate(632,68)">
        <rect width="84" height="46" rx="5" fill="#fff" stroke="#e8e4df" strokeWidth="0.8"/>
        <text x="8" y="12" fontSize="5.5" fill="#b0aca8" fontFamily="IBM Plex Sans,sans-serif" fontWeight="600" letterSpacing="0.4">LOUNGE</text>
        <rect x="8" y="16" width="64" height="20" rx="5" fill="#f0ede8"/>
        <rect x="14" y="21" width="52" height="10" rx="3" fill="#e8e4df"/>
        <rect x="24" y="38" width="28" height="7" rx="3" fill="#f0ede8"/>
      </g>

      {/* Speech bubbles — on top */}
      {Object.entries(bubbles).map(([id, text]) => (
        <SpeechBubble key={id} agentId={id} text={text}/>
      ))}
    </svg>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ channels, activeId, onSelect, onNewChannel, onOpenDM }) {
  const regular = channels.filter(c => c.isChannel);
  const dms = channels.filter(c => c.isDM);
  return (
    <div style={{
      width:"200px", background:"#111827", flexShrink:0,
      display:"flex", flexDirection:"column", overflow:"hidden",
    }}>
      <div style={{padding:"14px 14px 12px", borderBottom:"1px solid #1f2937"}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
          <div style={{
            width:"30px", height:"30px", borderRadius:"8px", background:"#5b6af0",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"13px", fontWeight:"700", color:"#fff", fontFamily:"'IBM Plex Mono',monospace",
          }}>AI</div>
          <div>
            <div style={{fontSize:"13px", fontWeight:"600", color:"#f9fafb"}}>AI Corp</div>
            <div style={{fontSize:"9px", color:"#6b7280", fontFamily:"'IBM Plex Mono',monospace"}}>workspace</div>
          </div>
        </div>
      </div>
      {/* You */}
      <div style={{padding:"10px 10px 6px"}}>
        <div style={{
          display:"flex", alignItems:"center", gap:"8px",
          padding:"6px 8px", borderRadius:"8px", background:"#1f2937",
        }}>
          <div style={{
            width:"26px", height:"26px", borderRadius:"7px", background:"#374151",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"11px", fontWeight:"700", color:"#f9fafb", fontFamily:"'IBM Plex Mono',monospace",
          }}>U</div>
          <div>
            <div style={{fontSize:"12px", fontWeight:"600", color:"#f9fafb"}}>Siz</div>
            <div style={{display:"flex", alignItems:"center", gap:"3px"}}>
              <div style={{width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e"}}/>
              <span style={{fontSize:"9px", color:"#6b7280"}}>Online</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{flex:1, overflowY:"auto", padding:"2px 0"}}>
        {/* Channels */}
        <div style={{padding:"8px 12px 3px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <span style={{fontSize:"9px", fontWeight:"600", color:"#6b7280", letterSpacing:"0.8px"}}>KANALLAR</span>
          <button onClick={onNewChannel} style={{
            background:"none", border:"none", color:"#6b7280",
            fontSize:"15px", cursor:"pointer", padding:"0 1px", lineHeight:1,
          }}>+</button>
        </div>
        {regular.map(ch => {
          const active = ch.id === activeId;
          return (
            <div key={ch.id} onClick={() => onSelect(ch.id)} style={{
              display:"flex", alignItems:"center", gap:"6px",
              padding:"5px 12px", cursor:"pointer",
              background: active ? "#1f2937" : "transparent",
              transition:"background 0.1s",
            }}
            onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#1a2332"}}
            onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
              <span style={{color:active?"#e5e7eb":"#6b7280", fontSize:"12px"}}>#</span>
              <span style={{fontSize:"12px", color:active?"#f9fafb":"#9ca3af", fontWeight:active?"500":"400", flex:1,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{ch.name}</span>
              <span style={{fontSize:"9px", color:"#4b5563", fontFamily:"'IBM Plex Mono',monospace"}}>{ch.members.length}</span>
            </div>
          );
        })}
        {/* DMs */}
        <div style={{padding:"10px 12px 3px"}}>
          <span style={{fontSize:"9px", fontWeight:"600", color:"#6b7280", letterSpacing:"0.8px"}}>DM</span>
        </div>
        {Object.keys(AGENTS).map(id => {
          const a = AGENTS[id];
          const dmId = `dm-${id}`;
          const active = dmId === activeId;
          return (
            <div key={id} onClick={() => onOpenDM(id)} style={{
              display:"flex", alignItems:"center", gap:"7px",
              padding:"4px 12px", cursor:"pointer",
              background: active ? "#1f2937" : "transparent",
              transition:"background 0.1s",
            }}
            onMouseEnter={e=>{if(!active)e.currentTarget.style.background="#1a2332"}}
            onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}>
              <div style={{
                width:"18px", height:"18px", borderRadius:"5px", flexShrink:0,
                background:a.bg, border:`1px solid ${a.color}30`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"7px", fontWeight:"600", color:a.color, fontFamily:"'IBM Plex Mono',monospace",
              }}>{a.avatar}</div>
              <span style={{fontSize:"12px", flex:1, color:active?"#f9fafb":"#6b7280",
                fontWeight:active?"500":"400",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{a.name.split(" ")[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CHAT PANEL ────────────────────────────────────────────────────────────────
function ChatMessage({ msg, prevMsg }) {
  const isUser = msg.sender === "user";
  const a = !isUser ? AGENTS[msg.sender] : null;
  const showHeader = !prevMsg || prevMsg.sender !== msg.sender
    || (msg.ts - prevMsg.ts) > 300000;
  return (
    <div style={{
      display:"flex", gap:"9px", padding:showHeader?"10px 16px 2px":"2px 16px 2px",
      alignItems:"flex-start",
    }}>
      <div style={{width:32, flexShrink:0, marginTop:"1px"}}>
        {showHeader && (
          isUser ? (
            <div style={{
              width:32, height:32, borderRadius:"8px", background:"#111827",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"12px", fontWeight:"700", color:"#fff", fontFamily:"'IBM Plex Mono',monospace",
            }}>U</div>
          ) : (
            <div style={{
              width:32, height:32, borderRadius:"8px", flexShrink:0,
              background:a.bg, border:`1.5px solid ${a.color}25`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"10px", fontWeight:"600", color:a.color, fontFamily:"'IBM Plex Mono',monospace",
            }}>{a.avatar}</div>
          )
        )}
      </div>
      <div style={{flex:1, minWidth:0}}>
        {showHeader && (
          <div style={{display:"flex", alignItems:"baseline", gap:"7px", marginBottom:"3px"}}>
            <span style={{fontSize:"13px", fontWeight:"600",
              color:isUser?"#111827":(a?.color||"#374151"), fontFamily:"'IBM Plex Sans',sans-serif"}}>
              {isUser ? "Siz" : a?.name}
            </span>
            {!isUser && a && (
              <span style={{fontSize:"10px", color:"#9ca3af", fontFamily:"'IBM Plex Mono',monospace"}}>{a.title}</span>
            )}
            <span style={{fontSize:"10px", color:"#d1d5db", fontFamily:"'IBM Plex Mono',monospace", marginLeft:"auto"}}>{msg.time}</span>
          </div>
        )}
        <div style={{fontSize:"13px", color:isUser?"#111827":"#1f2937",
          lineHeight:"1.65", fontFamily:"'IBM Plex Sans',sans-serif", wordBreak:"break-word"}}>{msg.text}</div>
      </div>
    </div>
  );
}

// ── INVITE MODAL ──────────────────────────────────────────────────────────────
function InviteModal({ channel, onClose, onInvite }) {
  const notMember = Object.keys(AGENTS).filter(id => !channel.members.includes(id));
  const [sel, setSel] = useState([]);
  const toggle = id => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"14px",width:"340px",
        boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{fontSize:"14px",fontWeight:"600",color:"#111827"}}>#{channel.name} ga invite</div>
          <div style={{fontSize:"11px",color:"#9ca3af",marginTop:"2px"}}>Xodimlarni tanlang</div>
        </div>
        <div style={{maxHeight:"260px",overflowY:"auto",padding:"8px 10px"}}>
          {notMember.length===0 ? (
            <div style={{textAlign:"center",padding:"20px",color:"#9ca3af",fontSize:"12px"}}>Barcha a'zo allaqachon</div>
          ) : notMember.map(id => {
            const a = AGENTS[id]; const s = sel.includes(id);
            return (
              <div key={id} onClick={()=>toggle(id)} style={{
                display:"flex",alignItems:"center",gap:"9px",
                padding:"8px 9px",borderRadius:"8px",cursor:"pointer",
                background:s?`${a.color}0e`:"transparent",transition:"background 0.1s",
              }}>
                <div style={{width:28,height:28,borderRadius:"7px",background:a.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"9px",fontWeight:"600",color:a.color,fontFamily:"'IBM Plex Mono',monospace",
                  border:`1px solid ${a.color}25`}}>{a.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"12px",fontWeight:"500",color:"#111827"}}>{a.name}</div>
                  <div style={{fontSize:"10px",color:"#9ca3af"}}>{a.title}</div>
                </div>
                <div style={{width:"16px",height:"16px",borderRadius:"4px",
                  border:`2px solid ${s?a.color:"#d1d5db"}`,background:s?a.color:"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.12s"}}>
                  {s && <span style={{color:"#fff",fontSize:"9px",fontWeight:"700"}}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",
          display:"flex",gap:"8px",justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 14px",borderRadius:"8px",
            border:"1px solid #e5e7eb",background:"#fff",color:"#374151",
            fontSize:"12px",cursor:"pointer"}}>Bekor</button>
          <button onClick={()=>{onInvite(sel);onClose();}} disabled={sel.length===0} style={{
            padding:"7px 16px",borderRadius:"8px",border:"none",
            background:sel.length?"#111827":"#e5e7eb",
            color:sel.length?"#fff":"#9ca3af",
            fontSize:"12px",cursor:sel.length?"pointer":"default",fontWeight:"500"}}>
            Qo'shish ({sel.length})</button>
        </div>
      </div>
    </div>
  );
}

// ── NEW CHANNEL MODAL ─────────────────────────────────────────────────────────
function NewChannelModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [sel, setSel] = useState([]);
  const toggle = id => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"14px",width:"360px",
        boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 20px 14px",borderBottom:"1px solid #f3f4f6"}}>
          <div style={{fontSize:"14px",fontWeight:"600",color:"#111827"}}>Yangi kanal</div>
        </div>
        <div style={{padding:"14px 20px"}}>
          <div style={{marginBottom:"14px"}}>
            <div style={{fontSize:"11px",fontWeight:"600",color:"#374151",marginBottom:"5px"}}>Kanal nomi</div>
            <div style={{display:"flex",alignItems:"center",gap:"5px",
              border:"1.5px solid #e5e7eb",borderRadius:"8px",padding:"0 10px",background:"#fafafa"}}>
              <span style={{color:"#9ca3af",fontSize:"13px"}}>#</span>
              <input value={name} onChange={e=>setName(e.target.value.toLowerCase().replace(/\s+/g,"-"))}
                placeholder="kanal-nomi" style={{
                  flex:1,border:"none",background:"transparent",fontSize:"13px",
                  color:"#111827",padding:"9px 0",outline:"none",fontFamily:"'IBM Plex Mono',monospace"}}/>
            </div>
          </div>
          <div style={{fontSize:"11px",fontWeight:"600",color:"#374151",marginBottom:"6px"}}>A'zolar</div>
          <div style={{maxHeight:"190px",overflowY:"auto"}}>
            {Object.keys(AGENTS).map(id => {
              const a = AGENTS[id]; const s = sel.includes(id);
              return (
                <div key={id} onClick={()=>toggle(id)} style={{
                  display:"flex",alignItems:"center",gap:"9px",
                  padding:"6px 8px",borderRadius:"7px",cursor:"pointer",
                  background:s?`${a.color}0e`:"transparent",transition:"background 0.1s"}}>
                  <div style={{width:24,height:24,borderRadius:"6px",background:a.bg,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"8px",fontWeight:"600",color:a.color,fontFamily:"'IBM Plex Mono',monospace",
                    border:`1px solid ${a.color}25`}}>{a.avatar}</div>
                  <span style={{fontSize:"12px",flex:1,color:"#111827"}}>{a.name}</span>
                  <div style={{width:"15px",height:"15px",borderRadius:"4px",
                    border:`2px solid ${s?a.color:"#d1d5db"}`,background:s?a.color:"transparent",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {s && <span style={{color:"#fff",fontSize:"8px",fontWeight:"700"}}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #f3f4f6",
          display:"flex",gap:"8px",justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"7px 14px",borderRadius:"8px",
            border:"1px solid #e5e7eb",background:"#fff",color:"#374151",fontSize:"12px",cursor:"pointer"}}>Bekor</button>
          <button onClick={()=>{if(name.trim()){onCreate(name.trim(),sel);onClose();}}} disabled={!name.trim()} style={{
            padding:"7px 16px",borderRadius:"8px",border:"none",
            background:name.trim()?"#111827":"#e5e7eb",
            color:name.trim()?"#fff":"#9ca3af",
            fontSize:"12px",cursor:name.trim()?"pointer":"default",fontWeight:"500"}}>Yaratish</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [activeId, setActiveId] = useState("general");
  const [messages, setMessages] = useState({});
  const [agentStates, setAgentStates] = useState(() =>
    Object.fromEntries(Object.keys(AGENTS).map(id => [id, {isBusy:false, tick:Math.floor(Math.random()*80)}]))
  );
  const [bubbles, setBubbles] = useState({});
  const [typingIn, setTypingIn] = useState({});
  const [input, setInput] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showNewCh, setShowNewCh] = useState(false);
  const historyRef = useRef({});
  const bottomRef = useRef(null);

  const active = channels.find(c => c.id === activeId);
  const msgs = messages[activeId] || [];
  const typingAgents = typingIn[activeId] || [];

  // Tick for animations
  useEffect(() => {
    const iv = setInterval(() => {
      setAgentStates(prev => {
        const n = {...prev};
        Object.keys(AGENTS).forEach(id => { n[id] = {...n[id], tick: (n[id].tick||0)+1}; });
        return n;
      });
    }, 100);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  }, [msgs, typingAgents]);

  const showBubble = useCallback((agentId, text) => {
    setBubbles(prev => ({...prev, [agentId]: text}));
    setTimeout(() => setBubbles(prev => { const n={...prev}; delete n[agentId]; return n; }), 6500);
  }, []);

  const addMsg = useCallback((channelId, msg) => {
    setMessages(prev => ({...prev, [channelId]: [...(prev[channelId]||[]), msg]}));
  }, []);

  const agentRespond = useCallback(async (channelId, agentId, context) => {
    const hKey = `${channelId}:${agentId}`;
    if (!historyRef.current[hKey]) historyRef.current[hKey] = [];
    const history = historyRef.current[hKey];

    setTypingIn(prev => ({...prev, [channelId]: [...(prev[channelId]||[]), agentId]}));
    setAgentStates(prev => ({...prev, [agentId]: {...prev[agentId], isBusy:true}}));

    await new Promise(r => setTimeout(r, 700 + Math.random()*1400));
    const reply = await callClaude(AGENT_SYSTEMS[agentId], history, context);

    historyRef.current[hKey] = [
      ...history,
      {role:"user", content:context},
      {role:"assistant", content:reply},
    ].slice(-24);

    setTypingIn(prev => ({...prev, [channelId]: (prev[channelId]||[]).filter(x=>x!==agentId)}));
    setAgentStates(prev => ({...prev, [agentId]: {...prev[agentId], isBusy:false}}));

    const t = nowTime();
    addMsg(channelId, {sender:agentId, text:reply, time:t, ts:Date.now()});
    showBubble(agentId, reply);
  }, [addMsg, showBubble]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !active) return;
    setInput("");
    addMsg(activeId, {sender:"user", text, time:nowTime(), ts:Date.now()});

    const mentioned = active.members.filter(id => {
      const first = AGENTS[id].name.split(" ")[0].toLowerCase();
      return text.toLowerCase().includes(`@${first}`);
    });

    const ctx = active.isChannel
      ? `[#${active.name}] Siz: "${text}"`
      : `Siz: "${text}"`;

    if (active.isDM) {
      agentRespond(activeId, active.dmAgent, ctx);
    } else if (mentioned.length > 0) {
      mentioned.forEach(id => setTimeout(() => agentRespond(activeId, id, ctx), Math.random()*200));
    } else {
      // Random 1-2 members react
      const pick = [...active.members].sort(()=>Math.random()-0.5).slice(0, Math.min(2, active.members.length));
      pick.forEach(id => setTimeout(() => agentRespond(activeId, id, ctx), Math.random()*600));
    }
  }, [input, active, activeId, agentRespond, addMsg]);

  const openDM = useCallback(id => {
    const dmId = `dm-${id}`;
    if (!channels.find(c => c.id === dmId)) {
      const a = AGENTS[id];
      setChannels(prev => [...prev, {
        id:dmId, name:a.name, desc:a.title,
        members:[id], isChannel:false, isDM:true, dmAgent:id,
      }]);
    }
    setActiveId(dmId);
  }, [channels]);

  const handleInvite = useCallback(ids => {
    setChannels(prev => prev.map(c => c.id===activeId ? {...c, members:[...c.members,...ids]} : c));
    const names = ids.map(id => AGENTS[id].name).join(", ");
    addMsg(activeId, {sender:"system", text:`${names} qo'shildi 🎉`, time:nowTime(), ts:Date.now()});
  }, [activeId, addMsg]);

  const handleCreateChannel = useCallback((name, members) => {
    const id = `ch-${name}-${Date.now()}`;
    setChannels(prev => [...prev, {id, name, desc:"", members, isChannel:true}]);
    setActiveId(id);
  }, []);

  const handleAgentMapClick = useCallback(id => {
    openDM(id);
  }, [openDM]);

  return (
    <>
      <link href={FONT} rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:0.4}30%{transform:translateY(-4px);opacity:1}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
        textarea{font-family:'IBM Plex Sans',sans-serif;}
        button{font-family:'IBM Plex Sans',sans-serif;}
      `}</style>

      <div style={{
        width:"100vw", height:"100vh", display:"flex", flexDirection:"column",
        background:"#f5f3f0", overflow:"hidden", fontFamily:"'IBM Plex Sans',sans-serif",
      }}>
        {/* TOP BAR */}
        <div style={{
          height:"46px", background:"#0d1117", borderBottom:"1px solid #1f2937",
          display:"flex", alignItems:"center", padding:"0 18px", gap:"12px", flexShrink:0,
        }}>
          <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
            <div style={{width:"26px",height:"26px",borderRadius:"7px",background:"#5b6af0",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"12px",fontWeight:"700",color:"#fff",fontFamily:"'IBM Plex Mono',monospace"}}>AI</div>
            <span style={{fontSize:"13px",fontWeight:"600",color:"#f9fafb"}}>AI Corp</span>
            <span style={{fontSize:"10px",color:"#4b5563",fontFamily:"'IBM Plex Mono',monospace"}}>Orchestrator</span>
          </div>
          <div style={{flex:1}}/>
          {Object.keys(AGENTS).map(id => (
            <div key={id} style={{
              width:"22px",height:"22px",borderRadius:"6px",
              background:agentStates[id]?.isBusy ? AGENTS[id].color : AGENTS[id].bg,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"7.5px",fontWeight:"600",
              color:agentStates[id]?.isBusy?"#fff":AGENTS[id].color,
              fontFamily:"'IBM Plex Mono',monospace",
              border:`1px solid ${AGENTS[id].color}40`,
              transition:"all 0.3s",
              title:AGENTS[id].name,
            }}>{AGENTS[id].avatar}</div>
          ))}
          <div style={{width:"1px",height:"20px",background:"#1f2937",margin:"0 4px"}}/>
          <span style={{fontSize:"10px",color:"#6b7280",fontFamily:"'IBM Plex Mono',monospace"}}>
            {Object.values(agentStates).filter(s=>s.isBusy).length} band
          </span>
        </div>

        {/* MAIN */}
        <div style={{flex:1, display:"flex", overflow:"hidden"}}>
          <Sidebar
            channels={channels}
            activeId={activeId}
            onSelect={setActiveId}
            onNewChannel={()=>setShowNewCh(true)}
            onOpenDM={openDM}
          />

          {/* MAP */}
          <div style={{
            flex:"0 0 auto", width:"50%", minWidth:"460px", maxWidth:"720px",
            background:"#f5f3f0", borderRight:"1px solid #e2ddd8",
            display:"flex", flexDirection:"column", overflow:"hidden",
          }}>
            <div style={{
              padding:"10px 14px 8px", borderBottom:"1px solid #e2ddd8",
              background:"#fff", display:"flex", alignItems:"center", gap:"8px",
            }}>
              <span style={{fontSize:"12px",fontWeight:"600",color:"#4a4540"}}>Ofis kartasi</span>
              <span style={{fontSize:"10px",color:"#b0aca8",fontFamily:"'IBM Plex Mono',monospace"}}>
                · agentni bosib DM oching
              </span>
              <div style={{marginLeft:"auto",display:"flex",gap:"5px"}}>
                {Object.keys(AGENTS).filter(id=>agentStates[id]?.isBusy).map(id=>(
                  <div key={id} style={{
                    fontSize:"10px",color:AGENTS[id].color,fontFamily:"'IBM Plex Mono',monospace",
                    display:"flex",alignItems:"center",gap:"3px",
                  }}>
                    <div style={{width:"5px",height:"5px",borderRadius:"50%",background:AGENTS[id].color,
                      animation:"typingDot 1.2s ease-in-out infinite"}}/>
                    {AGENTS[id].name.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
            <div style={{flex:1, overflow:"hidden", padding:"10px"}}>
              <OfficeMap
                agentStates={agentStates}
                bubbles={bubbles}
                activeChannel={active}
                onAgentClick={handleAgentMapClick}
              />
            </div>
          </div>

          {/* CHAT */}
          <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#fff", minWidth:"280px"}}>
            {/* Chat header */}
            <div style={{
              height:"52px", borderBottom:"1px solid #f3f4f6",
              display:"flex", alignItems:"center", padding:"0 16px", gap:"8px", flexShrink:0,
            }}>
              {active?.isChannel
                ? <span style={{fontSize:"15px",color:"#9ca3af"}}>#</span>
                : active?.dmAgent ? (
                  <div style={{
                    width:"26px",height:"26px",borderRadius:"7px",
                    background:AGENTS[active.dmAgent]?.bg,
                    border:`1.5px solid ${AGENTS[active.dmAgent]?.color}25`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"9px",fontWeight:"600",color:AGENTS[active.dmAgent]?.color,
                    fontFamily:"'IBM Plex Mono',monospace",
                  }}>{AGENTS[active.dmAgent]?.avatar}</div>
                ) : null
              }
              <div style={{flex:1}}>
                <div style={{fontSize:"13px",fontWeight:"600",color:"#111827"}}>
                  {active?.isChannel ? active.name : active?.name}
                </div>
                {active?.isChannel && (
                  <div style={{fontSize:"10px",color:"#9ca3af"}}>{active.members.length} a'zo · {active.desc}</div>
                )}
                {active?.isDM && active.dmAgent && (
                  <div style={{fontSize:"10px",color:AGENTS[active.dmAgent]?.color}}>
                    {agentStates[active.dmAgent]?.isBusy ? "● yozmoqda..." : "● online"}
                  </div>
                )}
              </div>
              {active?.isChannel && (
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  {active.members.slice(0,4).map((id,i) => (
                    <div key={id} style={{
                      width:"22px",height:"22px",borderRadius:"6px",flexShrink:0,
                      background:AGENTS[id].bg,border:`1.5px solid ${AGENTS[id].color}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"7.5px",fontWeight:"600",color:AGENTS[id].color,
                      fontFamily:"'IBM Plex Mono',monospace",marginLeft:i?"-4px":0,zIndex:4-i,
                    }}>{AGENTS[id].avatar}</div>
                  ))}
                  {active.members.length > 4 && (
                    <div style={{width:"22px",height:"22px",borderRadius:"6px",background:"#f3f4f6",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"8px",color:"#6b7280",fontWeight:"600",marginLeft:"-4px"}}>
                      +{active.members.length-4}
                    </div>
                  )}
                  <button onClick={()=>setShowInvite(true)} style={{
                    marginLeft:"4px",padding:"5px 10px",borderRadius:"7px",
                    border:"1px solid #e5e7eb",background:"#fff",
                    fontSize:"11px",color:"#374151",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:"3px",fontWeight:"500",
                  }}>+ Invite</button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{flex:1, overflowY:"auto", background:"#fff"}}>
              {msgs.length === 0 && (
                <div style={{
                  display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"center",height:"100%",gap:"10px",color:"#9ca3af",
                }}>
                  <div style={{
                    width:"44px",height:"44px",borderRadius:"12px",
                    background:"#f3f4f6",display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:"18px",
                  }}>{active?.isChannel?"#":"💬"}</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"13px",fontWeight:"600",color:"#374151",marginBottom:"3px"}}>
                      {active?.isChannel ? `#${active.name}` : active?.name}
                    </div>
                    <div style={{fontSize:"11px",lineHeight:"1.7",color:"#9ca3af"}}>
                      {active?.isChannel
                        ? "@Ism bilan mention qiling yoki oddiy yozing"
                        : `${active?.name} ga xabar yuboring`}
                    </div>
                  </div>
                </div>
              )}
              {msgs.map((msg, i) =>
                msg.sender === "system" ? (
                  <div key={i} style={{textAlign:"center",padding:"6px",
                    fontSize:"10px",color:"#9ca3af",fontFamily:"'IBM Plex Mono',monospace"}}>{msg.text}</div>
                ) : (
                  <ChatMessage key={i} msg={msg} prevMsg={msgs[i-1]}/>
                )
              )}
              {typingAgents.length > 0 && (
                <div style={{display:"flex",gap:"9px",padding:"5px 16px 8px",alignItems:"center"}}>
                  <div style={{width:32}}/>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    {typingAgents.slice(0,3).map(id=>(
                      <div key={id} style={{
                        width:"20px",height:"20px",borderRadius:"5px",
                        background:AGENTS[id].bg,border:`1px solid ${AGENTS[id].color}25`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:"7.5px",fontWeight:"600",color:AGENTS[id].color,
                        fontFamily:"'IBM Plex Mono',monospace",
                      }}>{AGENTS[id].avatar}</div>
                    ))}
                    <span style={{fontSize:"11px",color:"#9ca3af",fontStyle:"italic"}}>
                      {typingAgents.map(id=>AGENTS[id]?.name.split(" ")[0]).join(", ")} yozmoqda
                    </span>
                    <span style={{display:"inline-flex",gap:"3px",alignItems:"center"}}>
                      {[0,1,2].map(i=>(
                        <span key={i} style={{
                          width:"4px",height:"4px",borderRadius:"50%",background:"#9ca3af",
                          display:"inline-block",animation:`typingDot 1.2s ${i*0.2}s ease-in-out infinite`,
                        }}/>
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input */}
            <div style={{padding:"10px 14px 14px",borderTop:"1px solid #f3f4f6",flexShrink:0}}>
              <div style={{
                border:"1.5px solid #e5e7eb",borderRadius:"11px",
                background:"#fafafa",display:"flex",alignItems:"flex-end",
                gap:"6px",padding:"8px 12px",transition:"border-color 0.15s",
              }}
              onFocusCapture={e=>e.currentTarget.style.borderColor="#5b6af0"}
              onBlurCapture={e=>e.currentTarget.style.borderColor="#e5e7eb"}>
                <textarea value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}}
                  placeholder={active?.isChannel
                    ? `#${active?.name} · @Ism bilan mention qiling`
                    : `${active?.name||"..."} ga yozing`}
                  rows={1} style={{
                    flex:1,resize:"none",border:"none",background:"transparent",
                    fontSize:"13px",color:"#111827",lineHeight:"1.6",
                    fontFamily:"'IBM Plex Sans',sans-serif",maxHeight:"100px",overflowY:"auto",
                  }}/>
                <button onClick={handleSend} disabled={!input.trim()} style={{
                  width:"32px",height:"32px",borderRadius:"8px",flexShrink:0,
                  background:input.trim()?"#111827":"#e5e7eb",border:"none",
                  cursor:input.trim()?"pointer":"default",
                  color:input.trim()?"#fff":"#9ca3af",fontSize:"14px",
                  display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",
                }}>↑</button>
              </div>
              <div style={{marginTop:"5px",fontSize:"10px",color:"#d1d5db",
                fontFamily:"'IBM Plex Mono',monospace",paddingLeft:"3px"}}>
                Enter = yuborish · @Ism = to'g'ri javob · ofisda speech bubble chiqadi
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInvite && active && (
        <InviteModal channel={active} onClose={()=>setShowInvite(false)} onInvite={handleInvite}/>
      )}
      {showNewCh && (
        <NewChannelModal onClose={()=>setShowNewCh(false)} onCreate={handleCreateChannel}/>
      )}
    </>
  );
}
