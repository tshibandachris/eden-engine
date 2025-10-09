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

  // Charger les matchs au démarrage et lors du changement de ligue
  useEffect(() => {
    loadMatches();
  }, [selectedLeague]);

  // Rafraîchissement automatique toutes les 60 secondes
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
        maxWidth: 500,
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

      {/* Boutons de contrôle */}
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
