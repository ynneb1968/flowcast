import { useState, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const A = "#00C2FF";
const A2 = "#0066FF";
const GREEN = "#00e5a0";
const AMBER = "#f59e0b";
const RED = "#ff4466";

const TENANTS = [
  { id: "pitagora", name: "Pitagora Spa", sector: "Finance", color: "#00C2FF", branches: 30 },
  { id: "remax", name: "RE/MAX Italia", sector: "Immobiliare", color: "#cc0000", branches: 86 },
  { id: "farmacia", name: "FarmaRete", sector: "Farmacia", color: "#00c27a", branches: 22 },
  { id: "auto", name: "DriveGroup", sector: "Automotive", color: "#ff9900", branches: 14 },
];

const BRANCHES = [
  { id: 1, name: "Torino Centro", status: "active", posts: 12, reach: "4.2K", fb: true, ig: true, li: true, gmb: true, tk: false, wa: true },
  { id: 2, name: "Milano Duomo", status: "active", posts: 8, reach: "6.1K", fb: true, ig: true, li: false, gmb: true, tk: true, wa: true },
  { id: 3, name: "Roma Prati", status: "pending", posts: 3, reach: "1.8K", fb: true, ig: false, li: true, gmb: false, tk: false, wa: false },
  { id: 4, name: "Venezia", status: "active", posts: 15, reach: "3.5K", fb: true, ig: true, li: true, gmb: true, tk: true, wa: true },
  { id: 5, name: "Napoli Centro", status: "inactive", posts: 0, reach: "0", fb: false, ig: false, li: false, gmb: false, tk: false, wa: false },
  { id: 6, name: "Bologna Nord", status: "active", posts: 7, reach: "2.9K", fb: true, ig: true, li: false, gmb: true, tk: false, wa: true },
];

const CHANNELS = {
  fb:  { bg: "#1877F2", label: "FB",  name: "Facebook" },
  ig:  { bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", label: "IG", name: "Instagram" },
  li:  { bg: "#0A66C2", label: "LI",  name: "LinkedIn" },
  gmb: { bg: "#34A853", label: "GMB", name: "Google My Business" },
  tk:  { bg: "#010101", label: "TK",  name: "TikTok" },
  wa:  { bg: "#25D366", label: "WA",  name: "WhatsApp" },
};

const LIBRARY = [
  { id: 1, title: "Prestito Casa", category: "Prodotto", img: "🏠", uses: 34, channels: ["fb","ig","gmb"] },
  { id: 2, title: "Benvenuto Primavera", category: "Stagionale", img: "🌸", uses: 18, channels: ["ig","tk"] },
  { id: 3, title: "Tasso Agevolato", category: "Promo", img: "💰", uses: 52, channels: ["fb","li","gmb"] },
  { id: 4, title: "Apertura Domenicale", category: "Operativo", img: "🕐", uses: 9, channels: ["gmb","wa"] },
  { id: 5, title: "Nuovo Prodotto", category: "Prodotto", img: "🚀", uses: 27, channels: ["fb","ig","li"] },
  { id: 6, title: "Testimonianza Cliente", category: "Social Proof", img: "⭐", uses: 15, channels: ["ig","fb"] },
];

const QUEUE = [
  { id: 1, title: "Promozione Prestito Casa", author: "M. Rossi", branch: "Tutte", date: "12 Mar", time: "09:00", channels: ["fb","ig","li"], status: "approved", img: "🏠" },
  { id: 2, title: "Campagna Primavera", author: "L. Bianchi", branch: "Milano", date: "13 Mar", time: "11:30", channels: ["ig","fb","tk"], status: "review", img: "🌸" },
  { id: 3, title: "Tasso Agevolato Marzo", author: "M. Rossi", branch: "Torino", date: "14 Mar", time: "10:00", channels: ["fb","gmb"], status: "draft", img: "💰" },
  { id: 4, title: "Apertura Nuova Filiale", author: "F. Verdi", branch: "Roma", date: "15 Mar", time: "08:00", channels: ["fb","ig","li","gmb"], status: "approved", img: "🎉" },
  { id: 5, title: "Weekend Finanziario", author: "L. Bianchi", branch: "Tutte", date: "16 Mar", time: "12:00", channels: ["ig","tk"], status: "rejected", img: "📊" },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Badge({ type }) {
  const c = CHANNELS[type];
  return <span style={{ background: c.bg, color: "#fff", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{c.label}</span>;
}

function Dot({ status }) {
  const m = { active: GREEN, approved: GREEN, pending: AMBER, review: AMBER, inactive: "#2a2a40", draft: "#2a2a40", rejected: RED, scheduled: A };
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: m[status] || "#ccc", flexShrink: 0 }} />;
}

function StatusPill({ status }) {
  const map = {
    approved: { color: GREEN, bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.2)", label: "Approvato" },
    review:   { color: AMBER, bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "In revisione" },
    draft:    { color: "#445", bg: "#10101e", border: "#1a1a2a", label: "Bozza" },
    rejected: { color: RED,   bg: "rgba(255,68,102,0.08)", border: "rgba(255,68,102,0.2)", label: "Rifiutato" },
    active:   { color: GREEN, bg: "rgba(0,229,160,0.08)", border: "rgba(0,229,160,0.2)", label: "Attiva" },
    pending:  { color: AMBER, bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "In attesa" },
    inactive: { color: "#445", bg: "#10101e", border: "#1a1a2a", label: "Inattiva" },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
      <Dot status={status} />{s.label}
    </span>
  );
}

function Logo({ tenant }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${A}, ${A2})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 13 Q5 7 8 10 Q11 13 14 7 Q17 1 18 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <circle cx="18" cy="13" r="2.5" fill="white" opacity="0.9"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.4px", background: `linear-gradient(90deg, #fff 60%, ${A})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>flowcast</div>
        <div style={{ fontSize: 9, color: "#3a3a5a", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: -1 }}>{tenant.name}</div>
      </div>
    </div>
  );
}

// ─── AI COMPOSE ───────────────────────────────────────────────────────────────
function AICompose({ branches }) {
  const [brief, setBrief] = useState("");
  const [sector, setSector] = useState("finance");
  const [tone, setTone] = useState("professionale");
  const [selectedCh, setSelectedCh] = useState(["fb", "ig"]);
  const [selectedBr, setSelectedBr] = useState([]);
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedDate, setSchedDate] = useState("2026-03-20");
  const [schedTime, setSchedTime] = useState("10:00");
  const [saved, setSaved] = useState(false);

  const toggleCh = (c) => setSelectedCh(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleBr = (id) => setSelectedBr(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const generate = useCallback(async () => {
    if (!brief.trim()) return;
    setLoading(true); setGenerated(""); setSaved(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Sei un esperto di social media marketing per il settore ${sector}. 
Crea un post social in italiano con tono ${tone} basato su questo brief: "${brief}".
Il post sarà pubblicato su: ${selectedCh.map(c => CHANNELS[c]?.name).join(", ")}.
Usa i campi dinamici {{nome_filiale}} e {{indirizzo}} dove appropriato.
Includi emoji pertinenti. Max 280 caratteri per Instagram/Twitter, più lungo per Facebook/LinkedIn.
Rispondi SOLO con il testo del post, nient'altro.`
          }]
        })
      });
      const data = await res.json();
      setGenerated(data.content?.[0]?.text || "Errore nella generazione.");
    } catch { setGenerated("Errore di connessione. Riprova."); }
    setLoading(false);
  }, [brief, sector, tone, selectedCh]);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Crea Post con AI</h1>
          <span style={{ fontSize: 10, fontWeight: 800, color: A, background: "rgba(0,194,255,0.1)", border: `1px solid rgba(0,194,255,0.25)`, padding: "3px 9px", borderRadius: 20, letterSpacing: "1px" }}>AI POWERED</span>
        </div>
        <p style={{ fontSize: 13, color: "#445", margin: 0 }}>Descrivi il contenuto e l'AI scriverà il post ottimizzato per ogni canale</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Brief */}
          <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 26 }}>
            <label style={lbl}>Brief del Contenuto</label>
            <textarea value={brief} onChange={e => setBrief(e.target.value)}
              placeholder="Es: Promuovi il nostro nuovo prestito casa con tasso agevolato al 2,5% per under 35. Evidenzia la semplicità della procedura e la consulenza gratuita in filiale."
              style={{ width: "100%", height: 110, background: "#07071a", border: "1px solid #14142a", borderRadius: 12, padding: 14, color: "#dde", fontSize: 13, resize: "none", lineHeight: 1.7, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <div>
                <label style={lbl}>Settore</label>
                <select value={sector} onChange={e => setSector(e.target.value)} style={sel}>
                  <option value="finance">Finance / Banking</option>
                  <option value="real_estate">Immobiliare</option>
                  <option value="pharmacy">Farmacia</option>
                  <option value="automotive">Automotive</option>
                  <option value="retail">Retail</option>
                  <option value="hospitality">Hospitality</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Tono</label>
                <select value={tone} onChange={e => setTone(e.target.value)} style={sel}>
                  <option value="professionale">Professionale</option>
                  <option value="amichevole">Amichevole</option>
                  <option value="persuasivo">Persuasivo</option>
                  <option value="informativo">Informativo</option>
                  <option value="emozionale">Emozionale</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={lbl}>Canali Target</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(CHANNELS).map(([k, v]) => (
                  <button key={k} onClick={() => toggleCh(k)} style={{
                    padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                    border: selectedCh.includes(k) ? `2px solid ${A}` : "2px solid #14142a",
                    background: selectedCh.includes(k) ? "rgba(0,194,255,0.08)" : "#07071a",
                    color: selectedCh.includes(k) ? A : "#445", transition: "all 0.15s",
                  }}>{v.label} {v.name}</button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading || !brief.trim()} style={{
              marginTop: 20, width: "100%",
              background: loading || !brief.trim() ? "#1a1a2e" : `linear-gradient(135deg, ${A}, ${A2})`,
              color: loading || !brief.trim() ? "#445" : "#fff",
              border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700,
              cursor: loading || !brief.trim() ? "not-allowed" : "pointer",
              boxShadow: loading || !brief.trim() ? "none" : `0 4px 20px rgba(0,194,255,0.3)`,
              transition: "all 0.2s",
            }}>
              {loading ? "⏳ Generazione in corso..." : "✨ Genera con AI"}
            </button>
          </div>

          {/* Generated result */}
          {(generated || loading) && (
            <div style={{ background: "#0a0a1a", border: `1px solid rgba(0,194,255,0.2)`, borderRadius: 16, padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <label style={{ ...lbl, margin: 0 }}>Testo Generato dall'AI</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={generate} style={{ fontSize: 11, color: A, background: "none", border: `1px solid rgba(0,194,255,0.2)`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>🔄 Rigenera</button>
                </div>
              </div>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#445", fontSize: 13 }}>
                  <div style={{ width: 16, height: 16, border: `2px solid ${A}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  L'AI sta scrivendo il tuo post...
                </div>
              ) : (
                <>
                  <textarea value={generated} onChange={e => setGenerated(e.target.value)}
                    style={{ width: "100%", minHeight: 120, background: "#07071a", border: "1px solid #14142a", borderRadius: 10, padding: 14, color: "#dde", fontSize: 14, resize: "vertical", lineHeight: 1.7, boxSizing: "border-box", outline: "none", fontFamily: "inherit" }} />
                  <div style={{ fontSize: 11, color: "#334", textAlign: "right", marginTop: 4 }}>{generated.length} caratteri</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                    <div>
                      <label style={lbl}>Data Pubblicazione</label>
                      <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={lbl}>Orario</label>
                      <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button onClick={handleSave} style={{ flex: 1, background: `linear-gradient(135deg, ${A}, ${A2})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 16px rgba(0,194,255,0.25)` }}>
                      {saved ? "✓ Inviato in revisione!" : "🚀 Invia in Approvazione"}
                    </button>
                    <button style={{ background: "#10101e", color: "#556", border: "1px solid #14142a", borderRadius: 10, padding: "12px 18px", fontSize: 13, cursor: "pointer" }}>Salva Bozza</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Filiali */}
        <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 22, height: "fit-content" }}>
          <label style={lbl}>Filiali di Destinazione</label>
          <button onClick={() => setSelectedBr(branches.map(b => b.id))} style={{ width: "100%", background: "transparent", border: `1px dashed rgba(0,194,255,0.2)`, color: A, borderRadius: 10, padding: "9px", fontSize: 12, cursor: "pointer", marginBottom: 10, fontWeight: 600 }}>
            ⊕ Seleziona tutte ({branches.length})
          </button>
          {branches.map(b => (
            <div key={b.id} onClick={() => toggleBr(b.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, cursor: "pointer", background: selectedBr.includes(b.id) ? "rgba(0,194,255,0.05)" : "transparent", border: `1px solid ${selectedBr.includes(b.id) ? "rgba(0,194,255,0.15)" : "transparent"}`, marginBottom: 5, transition: "all 0.12s" }}>
              <div style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0, background: selectedBr.includes(b.id) ? A : "#10101e", border: `2px solid ${selectedBr.includes(b.id) ? A : "#1a1a2a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 800 }}>
                {selectedBr.includes(b.id) ? "✓" : ""}
              </div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#ccd" }}>{b.name}</div></div>
              <Dot status={b.status} />
            </div>
          ))}
          {selectedBr.length > 0 && (
            <div style={{ marginTop: 12, padding: "9px 13px", background: "rgba(0,229,160,0.05)", borderRadius: 10, border: "1px solid rgba(0,229,160,0.15)" }}>
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>✓ {selectedBr.length} filiali selezionate</div>
            </div>
          )}

          {/* Dynamic fields */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #14142a" }}>
            <label style={lbl}>Campi Dinamici Disponibili</label>
            {["{{nome_filiale}}", "{{indirizzo}}", "{{telefono}}", "{{orari}}", "{{url}}", "{{responsabile}}"].map(f => (
              <div key={f} style={{ fontSize: 11, color: "#445", fontFamily: "monospace", padding: "4px 0", borderBottom: "1px solid #0e0e1e" }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── APPROVAL WORKFLOW ────────────────────────────────────────────────────────
function Workflow() {
  const [posts, setPosts] = useState(QUEUE);
  const update = (id, status) => setPosts(p => p.map(x => x.id === id ? { ...x, status } : x));

  const cols = [
    { key: "draft",    label: "Bozze",       color: "#445" },
    { key: "review",   label: "In Revisione", color: AMBER },
    { key: "approved", label: "Approvati",    color: GREEN },
    { key: "rejected", label: "Rifiutati",    color: RED },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Workflow Approvazione</h1>
        <p style={{ fontSize: 13, color: "#445", margin: "4px 0 0" }}>Gestisci il ciclo di vita di ogni contenuto prima della pubblicazione</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {cols.map(col => (
          <div key={col.key} style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #14142a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: col.color, letterSpacing: "0.3px" }}>{col.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: col.color, background: `${col.color}15`, padding: "2px 8px", borderRadius: 12 }}>
                {posts.filter(p => p.status === col.key).length}
              </span>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, minHeight: 200 }}>
              {posts.filter(p => p.status === col.key).map(p => (
                <div key={p.id} style={{ background: "#07071a", border: "1px solid #14142a", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{p.img}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#dde", lineHeight: 1.3 }}>{p.title}</div>
                      <div style={{ fontSize: 10, color: "#445", marginTop: 3 }}>{p.branch} · {p.date}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 10, flexWrap: "wrap" }}>
                    {p.channels.map(c => <Badge key={c} type={c} />)}
                  </div>
                  <div style={{ fontSize: 10, color: "#334", marginBottom: 10 }}>di {p.author}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {col.key !== "approved" && (
                      <button onClick={() => update(p.id, "approved")} style={{ flex: 1, background: "rgba(0,229,160,0.1)", color: GREEN, border: `1px solid rgba(0,229,160,0.2)`, borderRadius: 7, padding: "5px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✓ Approva</button>
                    )}
                    {col.key !== "rejected" && col.key !== "draft" && (
                      <button onClick={() => update(p.id, "rejected")} style={{ flex: 1, background: "rgba(255,68,102,0.08)", color: RED, border: `1px solid rgba(255,68,102,0.15)`, borderRadius: 7, padding: "5px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✗ Rifiuta</button>
                    )}
                    {col.key === "draft" && (
                      <button onClick={() => update(p.id, "review")} style={{ flex: 1, background: "rgba(245,158,11,0.08)", color: AMBER, border: `1px solid rgba(245,158,11,0.15)`, borderRadius: 7, padding: "5px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>→ Invia</button>
                    )}
                  </div>
                </div>
              ))}
              {posts.filter(p => p.status === col.key).length === 0 && (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#223", fontSize: 12 }}>Nessun contenuto</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONTENT LIBRARY ─────────────────────────────────────────────────────────
function Library() {
  const [filter, setFilter] = useState("Tutti");
  const cats = ["Tutti", "Prodotto", "Stagionale", "Promo", "Operativo", "Social Proof"];
  const filtered = filter === "Tutti" ? LIBRARY : LIBRARY.filter(i => i.category === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Libreria Contenuti</h1>
          <p style={{ fontSize: 13, color: "#445", margin: "4px 0 0" }}>Template pronti da personalizzare e pubblicare</p>
        </div>
        <button style={{ background: `linear-gradient(135deg, ${A}, ${A2})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px rgba(0,194,255,0.25)` }}>+ Nuovo Template</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700, border: filter === c ? `1px solid ${A}` : "1px solid #14142a", background: filter === c ? "rgba(0,194,255,0.08)" : "#0a0a1a", color: filter === c ? A : "#445", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, overflow: "hidden", transition: "border 0.15s", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.border = `1px solid rgba(0,194,255,0.25)`}
            onMouseLeave={e => e.currentTarget.style.border = "1px solid #14142a"}>
            <div style={{ height: 110, background: "linear-gradient(135deg, #0e0e20, #14142a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{item.img}</div>
            <div style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.title}</div>
                <span style={{ fontSize: 10, color: "#445", background: "#10101e", padding: "3px 8px", borderRadius: 12 }}>{item.category}</span>
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {item.channels.map(c => <Badge key={c} type={c} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#334" }}>Usato {item.uses} volte</span>
                <button style={{ fontSize: 11, color: A, background: "rgba(0,194,255,0.08)", border: `1px solid rgba(0,194,255,0.15)`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontWeight: 700 }}>Usa Template</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics() {
  const kpis = [
    { label: "Reach Totale", value: "128K", delta: "+18%", sub: "vs mese scorso", icon: "👁️", color: A },
    { label: "Engagement Rate", value: "4.7%", delta: "+0.8pt", sub: "media filiali", icon: "💬", color: GREEN },
    { label: "Post Pubblicati", value: "347", delta: "+42", sub: "questo mese", icon: "📤", color: AMBER },
    { label: "Filiali Attive", value: "28/30", delta: "93%", sub: "copertura rete", icon: "🏢", color: "#aa88ff" },
  ];
  const byChannel = [
    { name: "Facebook", reach: 64200, eng: "3.2%", posts: 142, pct: 50 },
    { name: "Instagram", reach: 38400, eng: "6.8%", posts: 98, pct: 30 },
    { name: "LinkedIn", reach: 16000, eng: "4.1%", posts: 67, pct: 12.5 },
    { name: "GMB", reach: 9600, eng: "2.9%", posts: 40, pct: 7.5 },
  ];
  const topBranches = [
    { name: "Venezia", posts: 15, reach: "8.2K", score: 98 },
    { name: "Torino Centro", posts: 12, reach: "4.2K", score: 84 },
    { name: "Milano Duomo", posts: 8, reach: "6.1K", score: 79 },
    { name: "Bologna Nord", posts: 7, reach: "2.9K", score: 61 },
    { name: "Roma Prati", posts: 3, reach: "1.8K", score: 32 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Analytics Avanzate</h1>
        <p style={{ fontSize: 13, color: "#445", margin: "4px 0 0" }}>Ultimi 30 giorni · Tutte le filiali · Tutti i canali</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: "22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle, ${k.color}10, transparent)` }} />
            <div style={{ fontSize: 22, marginBottom: 10 }}>{k.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "#445", marginTop: 5 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: k.color, marginTop: 8, fontWeight: 700 }}>↑ {k.delta} · {k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Trend */}
        <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 26 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 24, marginTop: 0 }}>Trend Reach 12 Mesi</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {[38, 52, 44, 68, 58, 82, 72, 91, 78, 96, 85, 110].map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: "100%", height: `${(h/110)*100}%`, background: i === 11 ? `linear-gradient(180deg, ${A}, ${A2})` : i >= 9 ? "rgba(0,194,255,0.18)" : "#10101e", borderRadius: "4px 4px 0 0", boxShadow: i === 11 ? `0 0 14px rgba(0,194,255,0.35)` : "none" }} />
                <div style={{ fontSize: 9, color: "#334" }}>{["G","F","M","A","M","G","L","A","S","O","N","D"][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Branches */}
        <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 26 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 20, marginTop: 0 }}>Top Filiali per Score</h3>
          {topBranches.map((b, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#778" }}>{b.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: b.score > 75 ? GREEN : b.score > 50 ? AMBER : "#445" }}>{b.score}</span>
              </div>
              <div style={{ height: 5, background: "#10101e", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${b.score}%`, background: b.score > 75 ? `linear-gradient(90deg, ${GREEN}, #00c27a)` : b.score > 50 ? `linear-gradient(90deg, ${AMBER}, #d97706)` : "#1a1a2a", borderRadius: 3, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Channel */}
      <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 26 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 20, marginTop: 0 }}>Performance per Canale</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {byChannel.map((c, i) => (
            <div key={i} style={{ background: "#07071a", border: "1px solid #14142a", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#dde", marginBottom: 14 }}>{c.name}</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: "#445", marginBottom: 3 }}>Reach</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{c.reach.toLocaleString()}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 10, color: "#445" }}>Eng.</div><div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>{c.eng}</div></div>
                <div><div style={{ fontSize: 10, color: "#445" }}>Post</div><div style={{ fontSize: 14, fontWeight: 700, color: "#dde" }}>{c.posts}</div></div>
              </div>
              <div style={{ marginTop: 12, height: 4, background: "#10101e", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${c.pct}%`, background: `linear-gradient(90deg, ${A}, ${A2})`, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MULTI-TENANT SWITCHER ────────────────────────────────────────────────────
function TenantSwitcher({ current, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#10101e", border: "1px solid #1a1a2a", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#ccd", fontSize: 12, fontWeight: 700 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: current.color, display: "inline-block" }} />
        {current.name}
        <span style={{ color: "#445", fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "110%", left: 0, background: "#0f0f1e", border: "1px solid #1a1a2a", borderRadius: 12, padding: 8, zIndex: 100, minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          {TENANTS.map(t => (
            <div key={t.id} onClick={() => { onChange(t); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: current.id === t.id ? "rgba(0,194,255,0.06)" : "transparent", transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"}
              onMouseLeave={e => e.currentTarget.style.background = current.id === t.id ? "rgba(0,194,255,0.06)" : "transparent"}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ccd" }}>{t.name}</div>
                <div style={{ fontSize: 10, color: "#445" }}>{t.sector} · {t.branches} filiali</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const lbl = { fontSize: 10, fontWeight: 700, color: "#445", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 };
const sel = { width: "100%", background: "#07071a", border: "1px solid #14142a", borderRadius: 10, padding: "10px 12px", color: "#dde", fontSize: 12, outline: "none", cursor: "pointer" };
const inputStyle = { background: "#07071a", border: "1px solid #14142a", borderRadius: 10, padding: "10px 14px", color: "#dde", fontSize: 13, outline: "none" };

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ tenant, onNav }) {
  const stats = [
    { label: "Filiali Attive", value: "28", delta: "+3", icon: "🏢" },
    { label: "Post Pubblicati", value: "347", delta: "+42", icon: "📤" },
    { label: "Reach Totale", value: "128K", delta: "+18%", icon: "👁️" },
    { label: "Engagement", value: "4.7%", delta: "+0.8%", icon: "💬" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Dashboard</h1>
          <span style={{ fontSize: 10, fontWeight: 800, color: A, background: "rgba(0,194,255,0.1)", border: `1px solid rgba(0,194,255,0.25)`, padding: "3px 9px", borderRadius: 20 }}>LIVE</span>
        </div>
        <p style={{ fontSize: 13, color: "#445", margin: 0 }}>Marzo 2026 · {tenant.name} · {tenant.branches} filiali nel piano</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#445", marginTop: 5 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: GREEN, marginTop: 8, fontWeight: 700 }}>↑ {s.delta} questo mese</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Coda Approvazione</span>
            <button onClick={() => onNav("workflow")} style={{ fontSize: 11, color: A, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Gestisci →</button>
          </div>
          {QUEUE.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < 3 ? "1px solid #10101e" : "none" }}>
              <span style={{ fontSize: 20 }}>{p.img}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#dde" }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "#334", marginTop: 2 }}>{p.branch} · {p.date}</div>
              </div>
              <StatusPill status={p.status} />
            </div>
          ))}
        </div>
        <div style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Stato Filiali</span>
            <button onClick={() => onNav("branches")} style={{ fontSize: 11, color: A, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Tutte →</button>
          </div>
          {BRANCHES.map((b, i) => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < BRANCHES.length - 1 ? "1px solid #10101e" : "none" }}>
              <Dot status={b.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#dde" }}>{b.name}</div>
                <div style={{ fontSize: 11, color: "#334" }}>{b.posts} post · {b.reach}</div>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {b.fb && <Badge type="fb" />}{b.ig && <Badge type="ig" />}
                {b.tk && <Badge type="tk" />}{b.wa && <Badge type="wa" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BRANCHES ─────────────────────────────────────────────────────────────────
function Branches() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Gestione Filiali</h1>
          <p style={{ fontSize: 13, color: "#445", margin: "4px 0 0" }}>6 filiali · 30 nel piano · +6 canali disponibili</p>
        </div>
        <button style={{ background: `linear-gradient(135deg, ${A}, ${A2})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px rgba(0,194,255,0.25)` }}>+ Aggiungi Filiale</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {BRANCHES.map(b => (
          <div key={b.id} style={{ background: "#0a0a1a", border: "1px solid #14142a", borderRadius: 16, padding: 22, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid rgba(0,194,255,0.25)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid #14142a"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "#10101e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
              <StatusPill status={b.status} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{b.name}</div>
            <div style={{ fontSize: 11, color: "#334", marginBottom: 14 }}>{b.posts} post · {b.reach} reach</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {b.fb && <Badge type="fb" />}{b.ig && <Badge type="ig" />}{b.li && <Badge type="li" />}
              {b.gmb && <Badge type="gmb" />}{b.tk && <Badge type="tk" />}{b.wa && <Badge type="wa" />}
              {!b.fb && !b.ig && !b.li && !b.gmb && !b.tk && !b.wa && <span style={{ fontSize: 11, color: "#334" }}>Nessun canale</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [tenant, setTenant] = useState(TENANTS[0]);

  const navItems = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "ai-compose", icon: "✨", label: "AI Compose", badge: "NEW" },
    { id: "workflow", icon: "◈", label: "Workflow" },
    { id: "library", icon: "▣", label: "Libreria" },
    { id: "branches", icon: "◎", label: "Filiali" },
    { id: "analytics", icon: "◫", label: "Analytics" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#070712", color: "#e0e0f0", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <div style={{ width: 224, background: "#0a0a1a", borderRight: "1px solid #14142a", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 22px 28px" }}>
          <Logo tenant={tenant} />
        </div>
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 14px", background: nav === item.id ? `linear-gradient(90deg, rgba(0,194,255,0.08), transparent)` : "transparent", border: "none", borderRadius: 10, color: nav === item.id ? A : "#445", fontSize: 13, fontWeight: nav === item.id ? 700 : 500, cursor: "pointer", marginBottom: 2, textAlign: "left", transition: "all 0.15s", borderLeft: `3px solid ${nav === item.id ? A : "transparent"}` }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: 8, fontWeight: 800, color: GREEN, background: "rgba(0,229,160,0.12)", border: "1px solid rgba(0,229,160,0.2)", padding: "2px 6px", borderRadius: 10, letterSpacing: "0.5px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #14142a", display: "flex", flexDirection: "column", gap: 12 }}>
          <TenantSwitcher current={tenant} onChange={setTenant} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${A}, ${A2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>BD</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#ccd" }}>Benny D'Emilio</div>
              <div style={{ fontSize: 10, color: "#334" }}>Admin · {tenant.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", padding: "36px 40px" }}>
        {nav === "dashboard"   && <Dashboard tenant={tenant} onNav={setNav} />}
        {nav === "ai-compose"  && <AICompose branches={BRANCHES} />}
        {nav === "workflow"    && <Workflow />}
        {nav === "library"     && <Library />}
        {nav === "branches"    && <Branches />}
        {nav === "analytics"   && <Analytics />}
      </div>
    </div>
  );
}
