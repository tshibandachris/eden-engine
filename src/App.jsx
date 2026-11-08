import { useEffect, useState } from "react";
import { getMatches, leagues } from "./api/openliga";

const currentYear = new Date().getFullYear();

function formatDate(value) {
  if (!value) return "Date non communiquée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non communiquée";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function MatchCard({ match }) {
  return (
    <article className="match-card">
      <div className="match-card__teams">
        <span>{match.homeTeam}</span>
        <span className="match-card__versus">contre</span>
        <span>{match.awayTeam}</span>
      </div>
      <div className="match-card__details">
        <time dateTime={match.date || undefined}>{formatDate(match.date)}</time>
        <span className={match.score ? "match-score" : "match-pending"}>
          {match.score || "À venir"}
        </span>
      </div>
    </article>
  );
}

export default function App() {
  const [league, setLeague] = useState("bl1");
  const [year, setYear] = useState(currentYear);
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setError("");
      try {
        const data = await getMatches(league, year, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setMatches(data);
        setLastUpdated(new Date());
        setStatus("success");
      } catch (loadError) {
        if (controller.signal.aborted || loadError.name === "AbortError") return;
        setError(loadError.message || "Une erreur est survenue pendant le chargement.");
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [league, year, refreshKey]);

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="./" aria-label="Eden Engine, accueil">
          <span className="brand-mark" aria-hidden="true">E</span>
          <span><strong>Eden Engine</strong><small>Football · Calendriers & résultats</small></span>
        </a>
        <span className="connection-indicator"><span aria-hidden="true" />Données en ligne</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">CENTRE DE MATCHS</p>
        <h1 id="page-title">Suivez le jeu.</h1>
        <p className="intro-copy">
          Retrouvez les rencontres et les résultats publiés par les compétitions disponibles.
        </p>
      </section>

      <section className="matches-panel" aria-labelledby="matches-title">
        <div className="panel-heading">
          <div><p className="eyebrow">EXPLORER</p><h2 id="matches-title">Rencontres</h2></div>
          <button className="refresh-button" type="button" onClick={() => setRefreshKey((value) => value + 1)} disabled={status === "loading"}>
            {status === "loading" ? "Chargement…" : "Actualiser"}
          </button>
        </div>

        <div className="filters">
          <label>
            <span>Compétition</span>
            <select value={league} onChange={(event) => setLeague(event.target.value)}>
              {leagues.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span>Année</span>
            <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {[currentYear - 1, currentYear, currentYear + 1].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        {status === "loading" && (
          <div className="state-message" role="status"><span className="loader" aria-hidden="true" /><p>Récupération des rencontres…</p></div>
        )}

        {status === "error" && (
          <div className="state-message state-message--error" role="alert">
            <h3>Impossible de charger les matchs</h3><p>{error}</p>
            <button className="text-button" type="button" onClick={() => setRefreshKey((value) => value + 1)}>Réessayer</button>
          </div>
        )}

        {status === "success" && matches.length === 0 && (
          <div className="state-message"><h3>Aucune rencontre disponible</h3><p>Le fournisseur ne renvoie actuellement aucun match pour cette sélection.</p></div>
        )}

        {status === "success" && matches.length > 0 && (
          <>
            <div className="results-meta">
              <span>{matches.length} rencontre{matches.length > 1 ? "s" : ""}</span>
              {lastUpdated && <span>Mis à jour à {lastUpdated.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>}
            </div>
            <div className="match-list">{matches.map((match) => <MatchCard key={match.id} match={match} />)}</div>
          </>
        )}
      </section>

      <footer className="site-footer">
        <p>Les calendriers et scores dépendent des données publiées par OpenLigaDB.</p>
        <p>Consultation informative · Aucun conseil de mise ou pronostic.</p>
      </footer>
    </main>
  );
}
