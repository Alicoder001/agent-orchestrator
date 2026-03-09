import { useEffect, useRef, useState } from "react";
import { AGENTS, TEAMS, agentAbsPos } from "../data";

const MIN_Z = 0.15;
const MAX_Z = 3;

function Desk({ agentId, x, y, isBusy, tick, isActive, onClick }) {
  const agent = AGENTS[agentId];
  const bob = Math.sin(tick * (isBusy ? 0.13 : 0.05)) * (isBusy ? 1.4 : 0.35);
  const typing = isBusy && tick % 10 < 5;
  const keyX = 12 + (tick % 7) * 4;

  return (
    <g transform={`translate(${x},${y})`} onClick={onClick} style={{ cursor: "pointer" }}>
      {isActive && (
        <rect x="-4" y="-4" width="96" height="118" rx="8" fill="none" stroke={agent.color} strokeWidth="1.8" strokeDasharray="5 3" opacity="0.9">
          <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.2s" repeatCount="indefinite" />
        </rect>
      )}
      <rect x="0" y="44" width="88" height="48" rx="3" fill="#fdfcfb" stroke={isActive ? agent.color : "#ddd9d4"} strokeWidth={isActive ? 1.2 : 0.6} />
      <rect x="10" y="12" width="68" height="44" rx="3" fill="#181818" />
      <rect x="12" y="14" width="64" height="40" rx="2" fill="#080c12" />
      {isBusy ? (
        <>
          <rect x="12" y="14" width="64" height="40" rx="2" fill={agent.color} opacity="0.07" />
          <text x="44" y="30" fontSize="5" textAnchor="middle" fill={agent.color} fontFamily="IBM Plex Mono, monospace" opacity="0.82">processing</text>
          <text x="44" y="39" fontSize="4.5" textAnchor="middle" fill={agent.color} fontFamily="IBM Plex Mono, monospace" opacity="0.6">thinking...</text>
          <rect x="14" y="43" width={20 + (tick % 30)} height="3" rx="1" fill={agent.color} opacity="0.4" />
        </>
      ) : (
        <>
          <text x="16" y="26" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono, monospace" opacity="0.3">const agent =</text>
          <text x="16" y="33" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono, monospace" opacity="0.25">  new Worker()</text>
          <text x="16" y="40" fontSize="4.5" fill="#1a3a2a" fontFamily="IBM Plex Mono, monospace" opacity="0.2">ready</text>
        </>
      )}
      <rect x="38" y="38" width="4" height="8" rx="1" fill="#ccc8c3" />
      <rect x="32" y="45" width="16" height="2" rx="1" fill="#ccc8c3" />
      <rect x="10" y="58" width="32" height="12" rx="2" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4" />
      {typing && <rect x={keyX} y="60" width="4" height="5" rx="0.8" fill={agent.color} opacity="0.5" />}
      <rect x="48" y="59" width="10" height="12" rx="5" fill="#ece8e3" stroke="#d8d4cf" strokeWidth="0.4" />
      <g transform={`translate(44,${-1 + bob})`}>
        <rect x="-5" y="8" width="10" height="9" rx="3" fill={agent.color} opacity="0.15" />
        <circle cx="0" cy="3" r="7" fill="#f2ede8" />
        <circle cx="-2.3" cy="2.8" r="1.05" fill="#3a3530" />
        <circle cx="2.3" cy="2.8" r="1.05" fill="#3a3530" />
        <circle cx="-1.9" cy="2.4" r="0.3" fill="#fff" opacity="0.7" />
        <circle cx="2.7" cy="2.4" r="0.3" fill="#fff" opacity="0.7" />
        <path d={isBusy ? "M-2 6 Q0 8 2 6" : "M-1.5 6 Q0 7 1.5 6"} stroke="#8a7a70" strokeWidth="0.9" fill="none" />
      </g>
      <circle cx="82" cy="18" r="4" fill={isBusy ? "#22c55e" : "#ddd9d4"}>
        {isBusy && <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />}
      </circle>
      <text x="44" y="98" fontSize="6" textAnchor="middle" fill="#3a3530" fontFamily="IBM Plex Sans, sans-serif" fontWeight="500">
        {agent.name.split(" ")[0]}
      </text>
      <text x="44" y="106" fontSize="5" textAnchor="middle" fill="#9a9490" fontFamily="IBM Plex Sans, sans-serif">
        {agent.title.split(" ")[0]}
      </text>
    </g>
  );
}

function SpeechBubble({ agentId, text }) {
  const agent = AGENTS[agentId];
  const pos = agentAbsPos(agentId);
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 24) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  const shown = lines.slice(0, 4);
  if (lines.length > 4) shown[3] = `${shown[3].slice(0, 16)}...`;
  const bubbleH = 26 + shown.length * 10;
  const bx = pos.x + 30;
  const by = Math.max(4, pos.y - bubbleH / 2 - 10);

  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x={bx} y={by} width="150" height={bubbleH} rx="8" fill="#fff" stroke={agent.color} strokeWidth="1.1" />
      <path d={`M${bx},${by + bubbleH * 0.5 - 5} L${pos.x},${pos.y} L${bx},${by + bubbleH * 0.5 + 5} Z`} fill="#fff" stroke={agent.color} strokeWidth="1.1" />
      <rect x={bx + 8} y={by + 7} width="20" height="14" rx="4" fill={agent.color} opacity="0.12" />
      <text x={bx + 18} y={by + 17} textAnchor="middle" fontSize="6" fill={agent.color} fontFamily="IBM Plex Mono, monospace" fontWeight="600">
        {agent.avatar}
      </text>
      {shown.map((line, idx) => (
        <text key={idx} x={bx + 34} y={by + 17 + idx * 10} fontSize="7" fill="#2a2520" fontFamily="IBM Plex Sans, sans-serif">
          {line}
        </text>
      ))}
    </g>
  );
}

export default function OfficeMap2D({ activeChannel, agentStates, bubbles, onAgentClick }) {
  const [cam, setCam] = useState({ x: 0, y: 0, s: 0.8 });
  const [tick, setTick] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      setCam((prev) => {
        const ns = Math.min(MAX_Z, Math.max(MIN_Z, prev.s * delta));
        const ratio = ns / prev.s;
        return { s: ns, x: mx - ratio * (mx - prev.x), y: my - ratio * (my - prev.y) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const worldW = 1600;
  const worldH = 900;
  const miniW = 150;
  const miniH = 90;
  const scaleX = miniW / worldW;
  const scaleY = miniH / worldH;

  return (
    <div
      ref={ref}
      className="office-map"
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onMouseMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
        setCam((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      }}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
    >
      <svg className="grid-backdrop">
        <defs>
          <pattern id="dots" x={cam.x % (24 * cam.s)} y={cam.y % (24 * cam.s)} width={24 * cam.s} height={24 * cam.s} patternUnits="userSpaceOnUse">
            <circle cx={cam.s} cy={cam.s} r={Math.max(0.4, cam.s * 0.5)} fill="#c8c4be" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#f0ede8" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <svg className="world-svg">
        <g transform={`translate(${cam.x},${cam.y}) scale(${cam.s})`}>
          {TEAMS.map((team) => (
            <g key={team.id} transform={`translate(${team.x},${team.y})`}>
              <rect x="4" y="4" width={team.w} height={team.h} rx="14" fill="#000" opacity="0.06" />
              <rect width={team.w} height={team.h} rx="12" fill="#fafaf8" stroke={team.color} strokeWidth="1.5" opacity="0.72" />
              <rect width={team.w} height="36" rx="12" fill={team.color} opacity="0.13" />
              <rect y="24" width={team.w} height="12" fill={team.color} opacity="0.13" />
              <circle cx="16" cy="18" r="6" fill={team.color} opacity="0.6" />
              <text x="30" y="23" fontSize="10" fill={team.color} fontFamily="IBM Plex Sans, sans-serif" fontWeight="700" letterSpacing="0.4">
                {team.label.toUpperCase()}
              </text>
              <line x1="16" y1="42" x2={team.w - 16} y2="42" stroke={team.color} strokeWidth="0.5" opacity="0.3" />
              {team.desks.map((desk) => (
                <Desk
                  key={desk.id}
                  agentId={desk.id}
                  x={desk.x}
                  y={desk.y}
                  tick={(agentStates[desk.id]?.tick ?? 0) + tick}
                  isBusy={agentStates[desk.id]?.isBusy ?? false}
                  isActive={activeChannel?.members?.includes(desk.id)}
                  onClick={() => onAgentClick(desk.id)}
                />
              ))}
            </g>
          ))}
          {Object.entries(bubbles).map(([id, text]) => (
            <SpeechBubble key={id} agentId={id} text={text} />
          ))}
        </g>
      </svg>

      <div className="map-controls">
        <button onClick={() => setCam((prev) => ({ ...prev, s: Math.min(MAX_Z, prev.s * 1.2) }))}>+</button>
        <button onClick={() => setCam((prev) => ({ ...prev, s: Math.max(MIN_Z, prev.s / 1.2) }))}>-</button>
        <button onClick={() => setCam({ x: 20, y: 20, s: 0.8 })}>*</button>
        <div className="map-zoom-label">{Math.round(cam.s * 100)}%</div>
      </div>

      <div className="minimap-shell">
        <div className="minimap-label">MINIMAP</div>
        <svg width={miniW} height={miniH}>
          <rect width={miniW} height={miniH} fill="#f5f3f0" />
          {TEAMS.map((team) => (
            <rect key={team.id} x={team.x * scaleX} y={team.y * scaleY} width={team.w * scaleX} height={team.h * scaleY} rx="2" fill={team.color} opacity="0.3" stroke={team.color} strokeWidth="0.6" />
          ))}
          {ref.current && (
            <rect
              x={(-cam.x / cam.s) * scaleX}
              y={(-cam.y / cam.s) * scaleY}
              width={(ref.current.clientWidth / cam.s) * scaleX}
              height={(ref.current.clientHeight / cam.s) * scaleY}
              fill="none"
              stroke="#5b6af0"
              strokeWidth="1.2"
              rx="1"
              opacity="0.8"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
