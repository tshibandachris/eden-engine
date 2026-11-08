import React, { useCallback, useEffect, useState } from "react";
import { getMatches, LEAGUES } from "./api/openliga";

function formatDate(value) {
  if (!value) return "Date non communiquée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non communiquée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function App() {
  const [league, setLeague] = useState("bl1");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadMatches = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const data = await getMatches(league, new Date().getFullYear(), signal);
      setMatches(data);
      setUpdatedAt(new Date());
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Impossible de charger les matchs. Vérifiez votre connexion puis réessayez.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [league]);

  useEffect(() => {
    const controller = new AbortController();
    loadMatches(controller.signal);
    return () => controller.abort();
  }, [loadMatches]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="./" aria-label="Eden Engine - accueil">
          <span className="brand-mark">E</span>
          <span><strong>EDEN ENGINE</strong><small>Football data workspace</small></span>
        </a>
        <span className="status"><i /> Données en direct</span>
      </header>

      <section className="hero">
        <p className="eyebrow">CENTRE DE MATCHS</p>
        <h1>Le football, <span>en données.</span></h1>
        <p className="intro">Consultez les rencontres et les résultats des compétitions disponibles.</p>
      </section>

      <section className="panel" aria-labelledby="matches-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">COMPÉTITIONS</p>
            <h2 id="matches-title">Calendrier des matchs</h2>
          </div>
          <div className="controls">
            <label className="sr-only" htmlFor="league">Compétition</label>
            <select id="league" value={league} onChange={(event) => setLeague(event.target.value)}>
              {LEAGUES.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
            <button type="button" onClick={() => loadMatches()} disabled={loading}>
              {loading ? "Chargement…" : "Actualiser"}
            </button>
          </div>
        </div>

        {updatedAt && <p className="updated">Dernière mise à jour : {formatDate(updatedAt)}</p>}
        {error && <div className="notice error" role="alert">{error}</div>}
        {loading && <div className="notice" role="status">Chargement des rencontres…</div>}
        {!loading && !error && matches.length === 0 && (
          <div className="notice">Aucune rencontre disponible pour cette compétition et cette saison.</div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="match-list">
            {matches.map((match) => (
              <article className="match-card" key={match.id}>
                <div className="match-meta">
                  <span>{formatDate(match.date)}</span>
                  {match.group && <span>{match.group}</span>}
                </div>
                <div className="match-teams">
                  <strong>{match.homeTeam}</strong>
                  <span className={match.finished ? "score" : "versus"}>{match.score}</span>
                  <strong>{match.awayTeam}</strong>
                </div>
                <span className={match.finished ? "match-state finished" : "match-state"}>{match.finished ? "Résultat" : "Programmé"}</span>
              </article>
            ))}
          </div>
        )}
        <p className="source-note">Source des calendriers et résultats : OpenLigaDB. Les données dépendent de la disponibilité du service externe.</p>
      </section>

      <footer>EDEN ENGINE <span>•</span> Une solution Eden Devs</footer>
    </main>
  );
}
