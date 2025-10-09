import React, { useEffect, useState } from "react";
import { getMatches, leagues } from "./openliga";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("bl1");
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function loadMatches(league = selectedLeague) {
    setLoading(true);
    const data = await getMatches(league);
    setMatches(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMatches();
  }, [selectedLeague]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      console.log("🔄 Mise à jour automatique des matchs...");
      loadMatches();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedLeague]);

  return (
    <div
      className="card"
      style={{
        color: "white",
        textAlign: "center",
        padding: 20,
        maxWidth: 600,
        margin: "auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1>🌌 Eden Engine</h1>
      <p>Moteur intelligent de suivi des matchs ⚽</p>

      {/* Sélecteur de ligue */}
      <div style={{ margin: "15px 0" }}>
        <label htmlFor="league">Choisir une ligue : </label>
        <select
          id="league"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          style={{
            background: "#222",
            color: "white",
            border: "1px solid #00bfff",
            padding: "6px 10px",
            borderRadius: "8px",
          }}
        >
          {leagues.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Boutons */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => loadMatches()}
          style={{
            background: "#00bfff",
            color: "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            marginRight: "10px",
          }}
        >
          🔁 Rafraîchir
        </button>

        <button
          onClick={() => setAutoRefresh((prev) => !prev)}
          style={{
            background: autoRefresh ? "#111" : "#00bfff",
            color: autoRefresh ? "white" : "black",
            padding: "10px 20px",
            border: "1px solid #00bfff",
            borderRadius: "8px",
          }}
        >
          {autoRefresh ? "⏸️ Stop Auto" : "▶️ Auto ON"}
        </button>
      </div>

      {/* Zone des matchs */}
      {loading ? (
        <p>⏳ Chargement des matchs...</p>
      ) : matches.length === 0 ? (
        <p>Aucun match trouvé.</p>
      ) : (
        <div style={{ textAlign: "left", marginTop: 20 }}>
          {matches.map((m, i) => (
            <div
              key={i}
              style={{
                background: "#111",
                border: "1px solid #00bfff",
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <strong>{m.team1}</strong> vs <strong>{m.team2}</strong>
              <br />
              <small>
                {m.score} • {new Date(m.date).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
