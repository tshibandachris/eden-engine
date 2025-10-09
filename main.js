// === Eden Engine - Main.js ===
// Auteur : Christian Tshibanda (Chris)
// Description : Script principal de l'application Eden Engine (avec affichage de matchs)

console.log("⚙️ Initialisation d’Eden Engine...");

// === Configuration du thème sombre ===
document.body.style.backgroundColor = "#0a0a0a";
document.body.style.color = "#f5f5f5";
document.body.style.fontFamily = "Inter, sans-serif";
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";

// === Création du contenu principal ===
const container = document.getElementById("root");
container.innerHTML = `
  <div style="text-align:center; max-width:500px;">
    <h1 style="color:#00d4ff; font-size:2.5em;">🌌 Eden Engine</h1>
    <p style="font-size:1.1em; color:#ccc;">
      Bienvenue sur ta plateforme numérique intelligente.<br>
      <b>Mode :</b> Hors ligne / Connecté.
    </p>
    <button id="refreshBtn" style="
      background:#00d4ff;
      color:#0a0a0a;
      border:none;
      padding:10px 20px;
      border-radius:8px;
      font-weight:bold;
      cursor:pointer;
      transition:0.3s;
    ">Rafraîchir</button>
    <div id="matches" style="margin-top:20px; text-align:left;"></div>
    <p id="status" style="margin-top:20px; color:#888;">Chargement terminé ✅</p>
  </div>
`;

// === Fonction pour récupérer les matchs depuis OpenLiga ===
async function getMatches(league = "bl1", year = new Date().getFullYear()) {
  try {
    const url = `https://api.openligadb.de/getmatchdata/${league}/${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    return data.slice(0, 5).map((m) => ({
      team1: m.Team1.TeamName,
      team2: m.Team2.TeamName,
      date: new Date(m.MatchDateTime).toLocaleDateString("fr-FR"),
      score: m.MatchResults?.[0]
        ? `${m.MatchResults[0].PointsTeam1} - ${m.MatchResults[0].PointsTeam2}`
        : "à venir",
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des matchs :", error);
    return [];
  }
}

// === Affiche les matchs à l’écran ===
async function afficherMatchs() {
  const zone = document.getElementById("matches");
  zone.innerHTML = "<p>Chargement des matchs ⚽...</p>";

  const matchs = await getMatches();
  if (matchs.length === 0) {
    zone.innerHTML = "<p>Aucun match trouvé 😕</p>";
    return;
  }

  zone.innerHTML = matchs
    .map(
      (m) => `
      <div style="margin-bottom:10px; border-bottom:1px solid #333; padding:5px;">
        <b>${m.team1}</b> vs <b>${m.team2}</b><br>
        📅 ${m.date}<br>
        🔢 Score : ${m.score}
      </div>
    `
    )
    .join("");
}

// === Rafraîchissement manuel ===
document.getElementById("refreshBtn").addEventListener("click", afficherMatchs);

// === Service Worker / PWA ===
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("✅ Service Worker enregistré"))
    .catch((err) => console.error("❌ Erreur SW:", err));
}

// === Détection du mode offline ===
window.addEventListener("offline", () => {
  document.getElementById("status").textContent = "⚠️ Mode hors ligne activé";
  document.getElementById("status").style.color = "#ff9900";
});
window.addEventListener("online", () => {
  document.getElementById("status").textContent = "✅ Connexion rétablie";
  document.getElementById("status").style.color = "#00ff99";
});

// === Chargement initial ===
afficherMatchs();

console.log("🌐 Eden Engine prêt !");
