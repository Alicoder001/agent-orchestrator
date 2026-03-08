import { Bot, Loader2, Send, User as UserIcon, X } from "lucide-react";
import { AGENTS } from "../data";

export default function ChatDock({
  isOpen,
  activeChannel,
  messages,
  typingAgents,
  input,
  onInputChange,
  onSend,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="chat-dock">
      <div className="chat-header">
        <div className="chat-core">
          <div className="chat-core-icon">
            <Bot size={18} />
          </div>
          <div>
            <h3>{activeChannel?.isDM ? activeChannel.name : `#${activeChannel?.name}`}</h3>
            <p><span className="status-dot" />AI Core online</p>
          </div>
        </div>
        <button className="icon-button" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          const agent = !isUser ? AGENTS[msg.sender] : null;
          return (
            <div key={`${msg.ts}-${idx}`} className={`message-row ${isUser ? "user" : "agent"}`}>
              <div className={`message-avatar ${isUser ? "user" : "agent"}`}>
                {isUser ? <UserIcon size={15} /> : agent.avatar}
              </div>
              <div className="message-bubble-wrap">
                <div className="message-meta">
                  <span>{isUser ? "Siz" : agent.name}</span>
                  <span>{msg.time}</span>
                </div>
                <div className={`message-bubble ${isUser ? "user" : "agent"}`}>{msg.text}</div>
              </div>
            </div>
          );
        })}

        {typingAgents.map((agentId) => (
          <div key={agentId} className="message-row agent">
            <div className="message-avatar agent">{AGENTS[agentId].avatar}</div>
            <div className="message-bubble agent typing">
              <Loader2 size={14} className="spin" />
              {AGENTS[agentId].name.split(" ")[0]} yozmoqda...
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          placeholder="Command the workspace..."
        />
        <button onClick={onSend} className="send-button">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
