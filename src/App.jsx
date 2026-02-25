import React, { useState, useRef, useEffect } from "react";
import { usePipeline } from "./agents/usePipeline";
import { AGENTS, STEPS } from "./agents/definitions";
import { PipelineBar, AgentCard, LoadingCard } from "./components/PipelineBar";
import {
  AuditeurResult,
  ArchitecteResult,
  CorrectorResult,
  TesteurResult,
  ComparateurResult,
  GenerateurResult,
} from "./components/ResultRenderers";

const CONTEXTE_APP = `
Application React "Gestion des Ordres de Mission" — 1843 lignes dans un seul fichier.

ARCHITECTURE :
- Rôles : collab (crée missions), manager (valide), CAP (réservations), admin (utilisateurs)
- Flux : collab soumet → manager approuve/refuse → CAP propose réservations → collab choisit → CAP confirme
- Composants : OutlookPicker, ParticipantFields, GroupTable, VisitesTable, MissionDetailBody,
  NewMissionForm, DraftsView, HistoryView, ManagerView, CAPView, AdminView, ThreadPanel, MissionModal
- State global dans App : users, missions, drafts, form, activeRole, impersonating
- Brouillons persistés via window.storage

PROBLÈMES CONNUS :
1. MissionModal reçoit onCAPConfirm vide — ThreadPanel ne peut pas confirmer les réservations
2. managerName() accède à INITIAL_USERS global au lieu de recevoir users dynamique en prop
3. Mots de passe en clair dans le state React
4. 500+ lignes de handlers dans App sans séparation
5. 200 lignes de CSS injecté en milieu de composant
6. ThreadPanel : détection basée sur cap1 hardcodé
7. Suppression utilisateur ne vérifie pas les brouillons actifs
`;

function renderAgentResult(agentId, data) {
  if (!data) return null;
  switch (agentId) {
    case "auditeur":    return <AuditeurResult data={data} />;
    case "architecte":  return <ArchitecteResult data={data} />;
    case "correcteur":  return <CorrectorResult data={data} />;
    case "testeur":     return <TesteurResult data={data} />;
    case "comparateur": return <ComparateurResult data={data} />;
    case "generateur": return <GenerateurResult data={data} />;
    default:            return null;
  }
}

export default function App() {
  const { phase, currentAgent, results, error, launch, reset } = usePipeline();
  const [activeTab, setActiveTab] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentAgent, activeTab, results]);

  useEffect(() => {
    if (phase === "result" && !activeTab) setActiveTab("comparateur");
  }, [phase]);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "28px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#93c5fd", textTransform: "uppercase", marginBottom: 6 }}>Analyse multi-agents</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>Réécriture de ordre-mission.jsx</h1>
          <p style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: 13 }}>5 agents analysent le code, identifient les bugs et proposent une version améliorée</p>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
        <PipelineBar currentAgent={currentAgent} results={results} activeTab={activeTab} onTabChange={setActiveTab} />
        {phase === "accueil" && (
          <div style={{ background: "white", borderRadius: 16, padding: 40, border: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗂️</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#0f172a" }}>Analyse de l'application réelle</h2>
            <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 500, margin: "0 auto 24px" }}>Les 5 agents vont analyser ordre-mission.jsx et identifier ce qui aurait changé.</p>
            <button onClick={() => launch(CONTEXTE_APP)} style={{ background: "linear-gradient(135deg, #0f172a, #1e40af)", color: "white", border: "none", borderRadius: 12, padding: "14px 36px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
              🚀 Lancer l'analyse
            </button>
          </div>
        )}
        {phase === "building" && currentAgent && <LoadingCard agentId={currentAgent} />}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 20, marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
            ⚠️ <strong>Erreur :</strong> {error}
          </div>
        )}
        {Object.keys(results).length > 0 && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {STEPS.filter(s => results[s]).map(s => {
                const a = AGENTS[s];
                return (
                  <button key={s} onClick={() => setActiveTab(s)} style={{ background: activeTab === s ? a.color : "white", color: activeTab === s ? "white" : "#374151", border: `1.5px solid ${activeTab === s ? a.color : "#e2e8f0"}`, borderRadius: 10, padding: "8px 16px", fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    {a.icon} {a.name.replace("Agent ", "")}
                  </button>
                );
              })}
              {phase === "result" && (
                <button onClick={() => { reset(); setActiveTab(null); }} style={{ background: "transparent", color: "#9ca3af", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
                  ↺ Recommencer
                </button>
              )}
            </div>
            {activeTab && results[activeTab] && (
              <AgentCard agentId={activeTab}>{renderAgentResult(activeTab, results[activeTab])}</AgentCard>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}