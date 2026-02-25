import React from "react";

const Tag = ({ txt, color, bg }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{txt}</span>
);

export function AuditeurResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: data.score_qualite < 70 ? "#fef2f2" : "#f0fdf4", border: `2px solid ${data.score_qualite < 70 ? "#fca5a5" : "#86efac"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: data.score_qualite < 70 ? "#dc2626" : "#16a34a" }}>{data.score_qualite}</div>
        <div>
          <div style={{ fontWeight: 700 }}>Score qualité du code original</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{data.resume}</div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 8, textTransform: "uppercase" }}>🐛 Bugs critiques</div>
        {(data.bugs_critiques || []).map(b => (
          <div key={b.id} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "3px solid #dc2626", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <Tag txt={b.id} color="#dc2626" bg="#fee2e2" />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{b.composant}</span>
            </div>
            <div style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{b.probleme}</div>
            <div style={{ fontSize: 12, color: "#9f1239" }}>💥 {b.impact}</div>
            {b.ligne_approximative && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Ligne {b.ligne_approximative}</div>}
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 8, textTransform: "uppercase" }}>⚠️ Architecture</div>
        {(data.problemes_architecture || []).map(p => (
          <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
            <Tag txt={p.severite?.toUpperCase().slice(0,4)} color={p.severite === "haute" ? "#dc2626" : "#d97706"} bg={p.severite === "haute" ? "#fee2e2" : "#fef3c7"} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.titre}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{p.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArchitecteResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  return (
    <div>
      <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#5b21b6", fontStyle: "italic" }}>💡 {data.principe_cle}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>{data.reduction_lignes}</div>
      {(data.fichiers || []).map(f => (
        <div key={f.chemin} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, background: "#f5f3ff", color: "#7c3aed", borderRadius: 4, padding: "2px 7px", flexShrink: 0 }}>{f.chemin?.split("/").pop()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "#374151" }}>{f.role}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>~{f.lignes_estimees} lignes · {f.exporte?.join(", ")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CorrectorResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", marginBottom: 8, textTransform: "uppercase" }}>✅ Corrections de bugs</div>
      {(data.corrections || []).map(c => (
        <div key={c.bug_id} style={{ border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 14px", marginBottom: 10, background: "white" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Tag txt={c.bug_id} color="#0284c7" bg="#e0f2fe" />
            <span style={{ fontWeight: 700, fontSize: 13 }}>{c.titre}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginBottom: 3 }}>AVANT</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, background: "#fef2f2", padding: "6px 8px", borderRadius: 4, color: "#7f1d1d", wordBreak: "break-all" }}>{c.avant}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#059669", fontWeight: 700, marginBottom: 3 }}>APRÈS</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, background: "#f0fdf4", padding: "6px 8px", borderRadius: 4, color: "#14532d", wordBreak: "break-all" }}>{c.apres}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#374151", fontStyle: "italic" }}>{c.explication}</div>
        </div>
      ))}
      {(data.corrections_architecture || []).map(c => (
        <div key={c.arch_id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <Tag txt={c.arch_id} color="#7c3aed" bg="#f5f3ff" />
          <div>
            <div style={{ fontSize: 12, color: "#374151" }}>{c.action}</div>
            <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>→ {c.benefice}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TesteurResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  const roleColor = { collab: "#b45309", manager: "#1d4ed8", cap: "#7c3aed", admin: "#dc2626" };
  return (
    <div>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#14532d" }}>🎯 {data.priorite_test}</div>
      {(data.scenarios || []).map(s => (
        <div key={s.id} style={{ border: "1px solid #d1fae5", borderRadius: 8, padding: "12px 14px", marginBottom: 10, background: "white" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <Tag txt={s.id} color="#059669" bg="#d1fae5" />
            <Tag txt={s.role_concerne} color={roleColor[s.role_concerne] || "#374151"} bg="#f9fafb" />
            {s.bug_couvert && <Tag txt={s.bug_couvert} color="#dc2626" bg="#fee2e2" />}
          </div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{s.titre}</div>
          {(s.etapes || []).map((e, i) => (
            <div key={i} style={{ fontSize: 12, color: "#374151", display: "flex", gap: 6, marginBottom: 3 }}>
              <span style={{ color: "#9ca3af" }}>{i + 1}.</span>{e}
            </div>
          ))}
          <div style={{ fontSize: 12, color: "#059669", background: "#f0fdf4", padding: "6px 10px", borderRadius: 4, marginTop: 8 }}>✓ {s.resultat_attendu}</div>
        </div>
      ))}
    </div>
  );
}

export function ComparateurResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  const { avant, apres } = data;
  const metrics = [
    { label: "Lignes", av: avant?.lignes, ap: apres?.lignes, lower: true },
    { label: "Fichiers", av: avant?.fichiers, ap: apres?.fichiers, lower: false },
    { label: "Bugs", av: avant?.bugs_critiques, ap: apres?.bugs_critiques, lower: true },
    { label: "Score", av: avant?.score_qualite, ap: apres?.score_qualite, lower: false },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {metrics.map(m => {
          const ok = m.lower ? m.ap < m.av : m.ap > m.av;
          return (
            <div key={m.label} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase" }}>{m.label}</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", textDecoration: "line-through" }}>{m.av}</span>
                <span style={{ color: ok ? "#059669" : "#dc2626", fontSize: 11 }}>→</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: ok ? "#059669" : "#dc2626" }}>{m.ap}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 8, fontSize: 13 }}>❌ Version originale</div>
          {(avant?.points_faibles || []).map((p, i) => <div key={i} style={{ fontSize: 12, color: "#7f1d1d", padding: "2px 0" }}>· {p}</div>)}
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, color: "#059669", marginBottom: 8, fontSize: 13 }}>✅ Version améliorée</div>
          {(apres?.points_forts || []).map((p, i) => <div key={i} style={{ fontSize: 12, color: "#14532d", padding: "2px 0" }}>· {p}</div>)}
        </div>
      </div>
      {[
        { bg: "#fffbeb", border: "#fde68a", color: "#92400e", label: "🎯 Gain principal", value: data.gain_qualitatif },
        { bg: "#f0f9ff", border: "#bae6fd", color: "#0369a1", label: "👤 Pour l'utilisateur", value: data.ce_qui_change_pour_utilisateur },
        { bg: "#f9fafb", border: "#e5e7eb", color: "#374151", label: "⚖️ Ce qui ne change pas", value: data.ce_qui_ne_change_pas },
      ].map((item, i) => (
        <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: item.color }}>
          <strong>{item.label} :</strong> {item.value}
        </div>
      ))}
    </div>
  );
}

export function GenerateurResult({ data }) {
  if (data.raw) return <pre style={{ fontSize: 12, color: "#64748b", whiteSpace: "pre-wrap" }}>{data.raw.slice(0, 400)}</pre>;
  return (
    <div>
      <div style={{ background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#0f766e" }}>
        ✅ {data.resume}
      </div>
      {(data.fichiers_corriges || []).map((f, i) => (
        <div key={i} style={{ border: "1px solid #5eead4", borderRadius: 10, padding: "14px", marginBottom: 14, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, background: "#f0fdfa", color: "#0f766e", borderRadius: 4, padding: "2px 8px", display: "inline-block", marginBottom: 4 }}>{f.chemin}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{f.description}</div>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([f.code], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = f.chemin.split("/").pop();
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{ background: "#0f766e", color: "white", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
            >
              ⬇ Télécharger
            </button>
          </div>
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", fontFamily: "monospace", fontSize: 11, color: "#7dd3fc", lineHeight: 1.6, overflowX: "auto", maxHeight: 200, overflowY: "auto" }}>
            {f.code?.slice(0, 500)}{f.code?.length > 500 ? "\n..." : ""}
          </div>
        </div>
      ))}
    </div>
  );
}