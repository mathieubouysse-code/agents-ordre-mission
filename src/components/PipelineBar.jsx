import React from "react";
import { STEPS, AGENTS } from "../agents/definitions";

export function PipelineBar({ currentAgent, results, activeTab, onTabChange }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #e2e8f0", marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Pipeline des 6 agents</div>
      <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
        {STEPS.map((s, i) => {
          const a = AGENTS[s];
          const done = !!results[s];
          const active = currentAgent === s;
          const selected = activeTab === s;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div
                onClick={() => done && onTabChange(s)}
                style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 12, transition: "all 0.3s", cursor: done ? "pointer" : "default", background: done ? a.bg : active ? `${a.color}08` : "transparent", border: `2px solid ${done ? a.border : active ? a.border : "#e2e8f0"}`, boxShadow: selected ? `0 0 0 2px ${a.color}` : "none", transform: selected ? "translateY(-2px)" : "none" }}
              >
                <div style={{ fontSize: 20, animation: active ? "pulse 1s infinite" : "none" }}>{a.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: done ? a.color : active ? a.color : "#9ca3af", marginTop: 2 }}>{a.name.replace("Agent ", "")}</div>
                <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 1 }}>{done ? "✓ voir" : active ? "en cours…" : "attente"}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 20, height: 2, flexShrink: 0, background: results[STEPS[i+1]] || currentAgent === STEPS[i+1] ? `linear-gradient(to right, ${a.color}, ${AGENTS[STEPS[i+1]].color})` : "#e2e8f0", position: "relative" }}>
                  <div style={{ position: "absolute", right: -4, top: -4, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `5px solid ${results[STEPS[i+1]] ? AGENTS[STEPS[i+1]].color : "#e2e8f0"}` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AgentCard({ agentId, children }) {
  const a = AGENTS[agentId];
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 24, border: `1.5px solid ${a.border}`, animation: "slideUp 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${a.color}20` }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: a.bg, border: `2px solid ${a.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{a.icon}</div>
        <div>
          <div style={{ fontWeight: 800, color: a.color, fontSize: 15 }}>{a.name}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export function LoadingCard({ agentId }) {
  const a = AGENTS[agentId];
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 16, border: `2px solid ${a.border}`, animation: "slideUp 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 36 }}>{a.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: a.color }}>{a.name} travaille…</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{a.desc}</div>
        </div>
        <div style={{ width: 28, height: 28, border: `3px solid ${a.color}25`, borderTop: `3px solid ${a.color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    </div>
  );
}