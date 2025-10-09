// openliga.js

// 📡 Fonction pour récupérer les matchs depuis l'API OpenLigaDB
export async function getMatches(league = "bl1", year = new Date().getFullYear()) {
  try {
    const url = `https://api.openligadb.de/getmatchdata/${league}/${year}`;
    console.log("Fetching:", url);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur réseau (${response.status})`);

    const data = await response.json();

    // Vérification : données valides ?
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`Aucun match trouvé pour ${league} (${year})`);
      return [];
    }

    return data.slice(0, 10); // On affiche seulement les 10 plus récents
  } catch (error) {
    console.error("❌ Erreur lors du chargement des matchs :", error);
    return [];
  }
}

// ⚙️ Liste des ligues disponibles sur OpenLigaDB
export const leagues = [
  { code: "bl1", name: "🇩🇪 Bundesliga" },
  { code: "bl2", name: "🇩🇪 2. Bundesliga" },
  { code: "dfb", name: "🏆 DFB-Pokal" },
  { code: "bl3", name: "🇩🇪 3. Liga" },
  { code: "fbl1", name: "👩 Bundesliga Féminine" },
];
