import { useMemo, useState } from "react";
import {
  Blocks,
  BriefcaseBusiness,
  Building2,
  Layers,
  LayoutGrid,
  MessageSquare,
  Orbit,
  Plus,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import ChatDock from "./components/ChatDock";
import OfficeMap2D from "./components/OfficeMap2D";
import Scene3D from "./components/Scene3D";
import { AGENTS, DEPARTMENTS, ORGANIZATIONS, buildAgentReply, nowTime } from "./data";

const NAV_ITEMS = [
  { id: "workspace", label: "Workspace", icon: LayoutGrid },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "agents", label: "Agents", icon: Users },
  { id: "departments", label: "Departments", icon: Blocks },
  { id: "settings", label: "Settings", icon: Settings }
];

function createInitialState() {
  return Object.fromEntries(Object.keys(AGENTS).map((id) => [id, { isBusy: false, tick: Math.floor(Math.random() * 80) }]));
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <button onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState("2D");
  const [chatOpen, setChatOpen] = useState(true);
  const [activeOrgId, setActiveOrgId] = useState(ORGANIZATIONS[0].id);
  const [activeProjectId, setActiveProjectId] = useState(ORGANIZATIONS[0].projects[0].id);
  const [activeSection, setActiveSection] = useState("workspace");
  const [messages, setMessages] = useState({
    general: [
      { sender: "tom", text: "Product shell'ni endi professional workspace tizimiga o'tkazdik.", time: nowTime(), ts: Date.now() - 8000 },
      { sender: "marcus", text: "Keyingi bosqich: section-based navigation va entity actions.", time: nowTime(), ts: Date.now() - 6000 }
    ]
  });
  const [activeId, setActiveId] = useState("general");
  const [typingIn, setTypingIn] = useState({});
  const [bubbles, setBubbles] = useState({});
  const [agentStates, setAgentStates] = useState(createInitialState);
  const [input, setInput] = useState("");
  const [modalType, setModalType] = useState(null);

  const activeOrg = useMemo(() => ORGANIZATIONS.find((org) => org.id === activeOrgId), [activeOrgId]);
  const activeProject = useMemo(
    () => activeOrg.projects.find((project) => project.id === activeProjectId) || activeOrg.projects[0],
    [activeOrg, activeProjectId]
  );
  const channels = activeProject.channels;
  const activeChannel = useMemo(() => channels.find((channel) => channel.id === activeId), [channels, activeId]);
  const activeMessages = messages[activeId] || [];
  const typingAgents = typingIn[activeId] || [];
  const activeMembers = activeChannel?.members || [];
  const focusedAgent = activeChannel?.isDM ? activeChannel.dmAgent : null;

  function ensureDm(agentId) {
    const dmId = `dm-${agentId}`;
    const existing = channels.find((item) => item.id === dmId);
    if (existing) return dmId;
    activeProject.channels = [...activeProject.channels, { id: dmId, name: AGENTS[agentId].name, members: [agentId], isDM: true, dmAgent: agentId }];
    return dmId;
  }

  function addMessage(channelId, message) {
    setMessages((prev) => ({ ...prev, [channelId]: [...(prev[channelId] || []), message] }));
  }

  function showBubble(agentId, text) {
    setBubbles((prev) => ({ ...prev, [agentId]: text }));
    window.setTimeout(() => {
      setBubbles((prev) => {
        const next = { ...prev };
        delete next[agentId];
        return next;
      });
    }, 5200);
  }

  function scheduleAgentReply(channelId, agentId, promptText) {
    setTypingIn((prev) => ({ ...prev, [channelId]: [...(prev[channelId] || []), agentId] }));
    setAgentStates((prev) => ({ ...prev, [agentId]: { ...prev[agentId], isBusy: true } }));
    window.setTimeout(() => {
      const channel = channels.find((item) => item.id === channelId);
      const reply = buildAgentReply(agentId, promptText, channel?.name || "workspace");
      addMessage(channelId, { sender: agentId, text: reply, time: nowTime(), ts: Date.now() });
      setTypingIn((prev) => ({ ...prev, [channelId]: (prev[channelId] || []).filter((item) => item !== agentId) }));
      setAgentStates((prev) => ({ ...prev, [agentId]: { ...prev[agentId], isBusy: false } }));
      showBubble(agentId, reply);
    }, 900 + Math.random() * 1100);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || !activeChannel) return;
    setInput("");
    addMessage(activeId, { sender: "user", text, time: nowTime(), ts: Date.now() });
    if (activeChannel.isDM) {
      scheduleAgentReply(activeId, activeChannel.dmAgent, text);
      return;
    }
    const mentioned = activeChannel.members.filter((id) => text.toLowerCase().includes(`@${AGENTS[id].name.split(" ")[0].toLowerCase()}`));
    const respondents = mentioned.length > 0 ? mentioned : [...activeChannel.members].sort(() => Math.random() - 0.5).slice(0, Math.min(2, activeChannel.members.length));
    respondents.forEach((agentId, index) => window.setTimeout(() => scheduleAgentReply(activeId, agentId, text), index * 180));
  }

  const agentCount = Object.keys(AGENTS).length;

  return (
    <div className="app-shell pro-shell product-shell">
      <header className="topbar topbar-dark topbar-product">
        <div className="brand brand-dark">
          <div className="brand-mark brand-mark-dark"><Layers size={18} /></div>
          <div>
            <h1>{activeOrg.name}</h1>
            <p>{activeProject.name} / {activeProject.environment}</p>
          </div>
        </div>

        <div className="workspace-tabs">
          <button className={viewMode === "2D" ? "active" : ""} onClick={() => setViewMode("2D")}>2D Workspace</button>
          <button className={viewMode === "3D" ? "active" : ""} onClick={() => setViewMode("3D")}>3D Environment</button>
        </div>

        <div className="topbar-actions">
          <div className="topbar-chip"><Sparkles size={14} /> Professional Shell</div>
          <button className="header-action" onClick={() => setModalType("firm")}><Plus size={14} /> Firm</button>
          <button className="header-action" onClick={() => setModalType("project")}><Plus size={14} /> Project</button>
          <button className="header-action" onClick={() => setModalType("agent")}><Plus size={14} /> Agent</button>
          <button className={`round-button dark ${chatOpen ? "active" : ""}`} onClick={() => setChatOpen((prev) => !prev)}>
            <MessageSquare size={16} />
          </button>
        </div>
      </header>

      <aside className="sidebar sidebar-dark sidebar-product">
        <div className="switcher-group">
          <div className="switcher-label">Organization</div>
          <div className="switcher-card">
            <Building2 size={16} />
            <select value={activeOrgId} onChange={(e) => {
              const orgId = e.target.value;
              setActiveOrgId(orgId);
              const org = ORGANIZATIONS.find((item) => item.id === orgId);
              setActiveProjectId(org.projects[0].id);
              setActiveId(org.projects[0].channels[0].id);
            }}>
              {ORGANIZATIONS.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
            </select>
          </div>
          <div className="switcher-label">Project</div>
          <div className="switcher-card">
            <BriefcaseBusiness size={16} />
            <select value={activeProjectId} onChange={(e) => {
              setActiveProjectId(e.target.value);
              const nextProject = activeOrg.projects.find((item) => item.id === e.target.value);
              setActiveId(nextProject.channels[0].id);
            }}>
              {activeOrg.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </div>
        </div>

        <div className="sidebar-group">
          <div className="sidebar-title dark">NAVIGATION</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`sidebar-nav-link ${activeSection === item.id ? "active" : ""}`} onClick={() => setActiveSection(item.id)}>
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-title dark">CHANNELS</div>
          {channels.filter((channel) => channel.isChannel).map((channel) => (
            <button key={channel.id} className={`channel-link dark ${activeId === channel.id ? "active" : ""}`} onClick={() => setActiveId(channel.id)}>
              <span>#</span>
              <span className="channel-name">{channel.name}</span>
              <span className="channel-count">{channel.members.length}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-title dark">TEAMS</div>
          {DEPARTMENTS.map((dep) => (
            <div key={dep.id} className="department-row">
              <span className="department-dot" style={{ background: dep.color }} />
              <span>{dep.name}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className="main-stage">
        {viewMode === "2D" ? (
          <OfficeMap2D activeChannel={activeChannel} agentStates={agentStates} bubbles={bubbles} onAgentClick={(id) => setActiveId(ensureDm(id))} />
        ) : (
          <Scene3D activeMembers={activeMembers} busyAgents={typingAgents} focusedAgent={focusedAgent} onAgentClick={(id) => setActiveId(ensureDm(id))} />
        )}
      </main>

      <div className="status-panel refined">
        <div className="panel-card emphasis">
          <span>Section</span>
          <strong>{NAV_ITEMS.find((item) => item.id === activeSection)?.label}</strong>
        </div>
        <div className="panel-card">
          <span>Project</span>
          <strong>{activeProject.name}</strong>
        </div>
        <div className="panel-card">
          <span>Agents</span>
          <strong>{agentCount} active profiles</strong>
        </div>
      </div>

      <ChatDock
        isOpen={chatOpen}
        activeChannel={activeChannel}
        messages={activeMessages}
        typingAgents={typingAgents}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onClose={() => setChatOpen(false)}
      />

      {modalType === "firm" && (
        <Modal title="Create New Firm" onClose={() => setModalType(null)}>
          <div className="modal-body">
            <label>Firm Name<input placeholder="New organization name" /></label>
            <label>Industry<input placeholder="AI, SaaS, Fintech..." /></label>
            <button className="modal-primary">Create Firm</button>
          </div>
        </Modal>
      )}

      {modalType === "project" && (
        <Modal title="Create New Project" onClose={() => setModalType(null)}>
          <div className="modal-body">
            <label>Project Name<input placeholder="Project name" /></label>
            <label>Environment<input placeholder="Production, Staging, Design..." /></label>
            <button className="modal-primary">Create Project</button>
          </div>
        </Modal>
      )}

      {modalType === "agent" && (
        <Modal title="Create New Agent" onClose={() => setModalType(null)}>
          <div className="modal-body">
            <label>Agent Name<input placeholder="Agent name" /></label>
            <label>Role<input placeholder="CTO, Designer, DevOps..." /></label>
            <button className="modal-primary">Create Agent</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
