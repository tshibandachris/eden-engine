import React, { useEffect, useState } from "react";
import { getMatches } from "./openliga";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      const data = await getMatches();
      setMatches(data);
      setLoading(false);
    }
    loadMatches();
  }, []);

  return (
    <div className="card" style={{ color: "white", textAlign: "center", padding: 20 }}>
      <h1>⚽ Eden Engine</h1>
      <p>Bienvenue sur ta plateforme numérique intelligente.</p>
      <p><b>Mode :</b> Hors ligne / Connecté.</p>
      <button onClick={() => window.location.reload()} style={{
        background: "#00bfff",
        color: "black",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        marginBottom: "15px"
      }}>Rafraîchir</button>

      {loading ? (
        <p>Chargement des matchs...</p>
      ) : (
        <>
          <h3>Matchs récents (Bundesliga)</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {matches.map((match) => (
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
            ))}
          </ul>
        </>
      )}

      {!loading && <p>Chargement terminé ✅</p>}
      <footer style={{ marginTop: 20, fontSize: 12 }}>© 2025 Christian Tshibanda</footer>
    </div>
  );
}

export default App;
