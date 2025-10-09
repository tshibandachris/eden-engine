// openliga.js — fusion Eden Engine

// --- ⚙️ Ligues disponibles ---
export const leagues = [
  { code: "bl1", name: "🇩🇪 Bundesliga", source: "openliga" },
  { code: "bl2", name: "🇩🇪 2. Bundesliga", source: "openliga" },
  { code: "dfb", name: "🏆 DFB-Pokal", source: "openliga" },
  { code: "PL", name: "🏴 Premier League", source: "sportsdb" },
  { code: "PD", name: "🇪🇸 La Liga", source: "sportsdb" },
  { code: "SA", name: "🇮🇹 Serie A", source: "sportsdb" },
  { code: "FL1", name: "🇫🇷 Ligue 1", source: "sportsdb" },
];

// --- 📡 Fonction principale ---
export async function getMatches(leagueCode = "bl1", year = new Date().getFullYear()) {
  const league = leagues.find((l) => l.code === leagueCode);
  if (!league) return [];

  if (league.source === "openliga") {
    return await getMatchesFromOpenLiga(league.code, year);
  } else {
    return await getMatchesFromSportsDB(league.code);
  }
}

// --- 🇩🇪 API OpenLigaDB ---
async function getMatchesFromOpenLiga(league = "bl1", year) {
  try {
    const url = `https://api.openligadb.de/getmatchdata/${league}/${year}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.slice(0, 10).map((m) => ({
      league: m.LeagueName,
      team1: m.Team1.TeamName,
      team2: m.Team2.TeamName,
      score: m.MatchResults?.[0]
        ? `${m.MatchResults[0].PointsTeam1} - ${m.MatchResults[0].PointsTeam2}`
        : "vs",
      date: m.MatchDateTime,
    }));
  } catch (err) {
    console.error("OpenLiga Error:", err);
    return [];
  }
}

// --- 🌍 API TheSportsDB ---
async function getMatchesFromSportsDB(leagueCode) {
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${getSportsDBLeagueId(leagueCode)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data?.events) return [];

    return data.events.slice(0, 10).map((m) => ({
      league: m.strLeague,
      team1: m.strHomeTeam,
      team2: m.strAwayTeam,
      score: "à venir",
      date: m.dateEvent,
    }));
  } catch (err) {
    console.error("SportsDB Error:", err);
    return [];
  }
}

// --- 🧩 ID de ligues pour TheSportsDB ---
function getSportsDBLeagueId(code) {
  switch (code) {
    case "PL": return 4328; // Premier League
    case "PD": return 4335; // La Liga
    case "SA": return 4332; // Serie A
    case "FL1": return 4334; // Ligue 1
    default: return 4328;
  }
}
