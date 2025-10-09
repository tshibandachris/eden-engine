// Eden Engine - main.js
// Version React Build simplifiée pour utilisation manuelle
// Auteur : Christian Tshibanda (Chris)

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("root");

  root.innerHTML = `
    <div style="font-family: sans-serif; color: white; background:#0a0a0a; min-height:100vh; padding:20px;">
      <h1 style="text-align:center;">⚙️ Eden Engine ⚙️</h1>
      <p style="text-align:center;">Chargement des matchs du jour...</p>
      <div id="matches" style="margin-top:20px;"></div>
    </div>
  `;

  const container = document.getElementById("matches");

  try {
    // ⚽️ API publique pour obtenir des matchs gratuits (football-data.org en proxy)
    const response = await fetch("https://api.football-data.org/v4/matches", {
      headers: { "X-Auth-Token": "b15f1b3b0cf14b88b604c2b3cf37e4f2" } // clé publique d’exemple
    });

    const data = await response.json();
    const matches = data.matches || [];

    if (matches.length === 0) {
      container.innerHTML = "<p>Aucun match trouvé aujourd'hui.</p>";
      return;
    }

    container.innerHTML = matches
      .slice(0, 10)
      .map(
        (m) => `
        <div style="background:#1a1a1a; padding:10px; margin-bottom:10px; border-radius:8px;">
          <h3>${m.competition?.name || "Compétition inconnue"}</h3>
          <p><strong>${m.homeTeam.name}</strong> vs <strong>${m.awayTeam.name}</strong></p>
          <p>Date : ${new Date(m.utcDate).toLocaleString()}</p>
          <p>Status : ${m.status}</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    container.innerHTML = `<p>Erreur lors du chargement : ${err.message}</p>`;
  }
});
