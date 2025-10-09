export async function getMatches(league = "bl1", year = new Date().getFullYear()) {
  try {
    const proxy = "https://api.allorigins.win/get?url=";
    const url = encodeURIComponent(`https://api.openligadb.de/getmatchdata/${league}/${year}`);
    const response = await fetch(proxy + url);
    if (!response.ok) throw new Error("Erreur réseau");
    const raw = await response.json();
    const data = JSON.parse(raw.contents);
    return data.slice(0, 10).map((m) => ({
      team1: m.Team1.TeamName,
      team2: m.Team2.TeamName,
      score: m.MatchResults?.[0]
        ? `${m.MatchResults[0].PointsTeam1} - ${m.MatchResults[0].PointsTeam2}`
        : "à venir",
      date: m.MatchDateTime,
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des matchs :", error);
    return [];
  }
}
