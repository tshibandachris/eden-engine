// openliga.js
export async function getMatches(league = "bl1", year = new Date().getFullYear()) {
  try {
    const url = `https://api.openligadb.de/getmatchdata/${league}/${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    return data.slice(0, 10); // limite à 10 matchs récents
  } catch (error) {
    console.error("Erreur lors du chargement des matchs :", error);
    return [];
  }
}
