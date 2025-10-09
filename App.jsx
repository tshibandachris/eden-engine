import React, { useEffect, useState } from "react";
import { getMatches, leagues } from "./openliga";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("bl1");

  async function loadMatches(league = selectedLeague) {
    setLoading(true);
    const data = await getMatches(league);
    setMatches(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMatches();
  }, [selectedLeague]);

  return (
    <div className="card" style={{ color: "white", textAlign: "center", padding: 20 }}>
      <h1>🌌 Eden Engine</h1>
      <p>Bienvenue sur ta plateforme numérique intelligente.</p>
      <p><b>Mode :</b> Hors ligne / Connecté.</p>

      {/* Sélection de ligue */}
      <div style={{ margin: "10px 0" }}>
        <label htmlFor="league">Choisir une ligue : </label>
        <select
          id="league"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          style={{
            background: "#222",
            color: "white",
            border: "1px solid #00bfff",
            padding: "5px 10px",
            borderRadius: "8px"
          }}
        >
          {leagues.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      <button onClick={() => loadMatches()} style={{
        background: "#00bfff",
        color: "black",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        marginBottom: "15px"
      }}>🔄 Rafraîchir</button>

      {loading ? (
        <p>Chargement des matchs...</p>
      ) : (
        <>
          <h3>Matchs récents ({leagues.find(l => l.code === selectedLeague)?.name})</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {matches.length > 0 ? matches.map((match) => (
              <li key={match.MatchID} style={{
                background: "#111",
                borderRadius: "10px",
                margin: "8px 0",
                padding: "10px"
              }}>
                <b>{match.Team1.TeamName}</b> vs <b>{match.Team2.TeamName}</b><br />
                {match.MatchIsFinished
                  ? `Score: ${match.MatchResults[0]?.PointsTeam1 ?? 0} - ${match.MatchResults[0]?.PointsTeam2 ?? 0}`
                  : "En cours / à venir"}
              </li>
            )) : (
              <li>Aucun match trouvé.</li>
            )}
          </ul>
        </>
      )}

      {!loading && <p>Chargement terminé ✅</p>}
      <footer style={{ marginTop: 20, fontSize: 12 }}>© 2025 Christian Tshibanda</footer>
    </div>
  );
}

export default App;
