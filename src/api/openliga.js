export const leagues = [
  { code: "bl1", name: "Bundesliga" },
  { code: "bl2", name: "2. Bundesliga" },
  { code: "bl3", name: "3. Liga" },
  { code: "dfb", name: "DFB-Pokal" },
];

export function normalizeMatch(match) {
  if (!match || !match.Team1?.TeamName || !match.Team2?.TeamName) return null;

  const results = Array.isArray(match.MatchResults) ? match.MatchResults : [];
  const finalResult = results.find((result) =>
    String(result?.ResultName ?? "").toLowerCase().includes("end")
  ) ?? results[results.length - 1];

  const homeScore = finalResult?.PointsTeam1;
  const awayScore = finalResult?.PointsTeam2;
  const hasScore = Number.isFinite(Number(homeScore)) && Number.isFinite(Number(awayScore));

  return {
    id: String(match.MatchID ?? match.MatchDateTime ?? [match.Team1.TeamName, match.Team2.TeamName].join("-")),
    homeTeam: match.Team1.TeamName,
    awayTeam: match.Team2.TeamName,
    date: match.MatchDateTime ?? match.MatchDateTimeUTC ?? null,
    score: hasScore ? String(homeScore) + " – " + String(awayScore) : null,
  };
}

export async function getMatches(league = "bl1", year = new Date().getFullYear(), options = {}) {
  const response = await fetch(
    "https://api.openligadb.de/getmatchdata/" + encodeURIComponent(league) + "/" + encodeURIComponent(year),
    { headers: { Accept: "application/json" }, signal: options.signal }
  );

  if (!response.ok) {
    throw new Error("Le fournisseur de matchs a répondu avec le statut " + response.status + ".");
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error("Le format des données reçues est inattendu.");

  return payload.map(normalizeMatch).filter(Boolean).sort((a, b) => {
    const first = Date.parse(a.date ?? "");
    const second = Date.parse(b.date ?? "");
    if (!Number.isFinite(first)) return 1;
    if (!Number.isFinite(second)) return -1;
    return first - second;
  });
}
