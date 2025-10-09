// openliga.js
export async function getMatches(league = "bl1", year = new Date().getFullYear()) {
  try {
    const url = `https://api.openligadb.de/getmatchdata/${league}/${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    return data.slice(0, 10); // 10 matchs récents
  } catch (error) {
    console.error("Erreur lors du chargement des matchs :", error);
    return [];
  }
}

export const leagues = [
  { code: "bl1", name: "🇩🇪 Bundesliga" },
  { code: "bl2", name: "🇩🇪 2. Bundesliga" },
  { code: "dfb", name: "🏆 DFB-Pokal" },
  { code: "liga1", name: "🇪🇸 La Liga" },
  { code: "seriea", name: "🇮🇹 Serie A" },
  { code: "premierleague", name: "🏴 Premier League" },
  { code: "eredivisie", name: "🇳🇱 Eredivisie" },
];
