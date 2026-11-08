const API_BASE = "https://api.openligadb.de";

export const LEAGUES = [
  { code: "bl1", name: "Bundesliga" },
  { code: "bl2", name: "2. Bundesliga" },
];

export async function getMatches(league = "bl1", year = new Date().getFullYear(), signal) {
  if (!LEAGUES.some((item) => item.code === league)) {
    throw new Error("Compétition non prise en charge.");
  }

  const response = await fetch(
    `${API_BASE}/getmatchdata/${encodeURIComponent(league)}/${year}`,
    { headers: { Accept: "application/json" }, signal }
  );

  if (!response.ok) {
    throw new Error(`OpenLigaDB a répondu avec le statut ${response.status}.`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("La réponse OpenLigaDB est invalide.");
  }

  return payload.map((match) => {
    const results = Array.isArray(match.MatchResults) ? match.MatchResults : [];
    const finalResult = results.find((result) => result.ResultTypeID === 2)
      || results.find((result) => result.ResultName === "Endergebnis");

    return {
      id: match.MatchID,
      homeTeam: match.Team1?.TeamName || "Équipe domicile",
      awayTeam: match.Team2?.TeamName || "Équipe extérieure",
      date: match.MatchDateTime,
      score: finalResult
        ? `${finalResult.PointsTeam1} – ${finalResult.PointsTeam2}`
        : "À venir",
      finished: Boolean(match.MatchIsFinished && finalResult),
      group: match.Group?.GroupName || "",
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}
