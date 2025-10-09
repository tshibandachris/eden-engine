import React, { useEffect, useState } from "react";
import { getMatches, leagues } from "./openliga";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("bl1");
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function loadMatches(league = selectedLeague) {
    setLoading(true);
    try {
      const data = await getMatches(league);
      setMatches(data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setMatches([]);
    }
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
            background: autoRefresh ? "#ffcc00" : "#555",
            color: "black",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
          }}
        >
          {autoRefresh ? "⏸️ Auto ON" : "▶️ Auto OFF"}
        </button>
      </div>

      {loading ? (
        <p>Chargement des matchs...</p>
      ) : matches.length > 0 ? (
        <div>
          {matches.map((m) => (
            <div
              key={m.MatchID}
              style={{
                borderBottom: "1px solid #333",
                padding: "10px 0",
                marginBottom: "5px",
              }}
            >
              <strong>
                {m.Team1?.TeamName} ⚔️ {m.Team2?.TeamName}
              </strong>
              <p>
                Score : {m.MatchResults?.[0]?.PointsTeam1 ?? "-"} –{" "}
                {m.MatchResults?.[0]?.PointsTeam2 ?? "-"}
              </p>
              <p>
                {new Date(m.MatchDateTime).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun match disponible pour le moment.</p>
      )}
    </div>
  );
}

export default App;
