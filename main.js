// === Eden Engine - Main.js ===
// Auteur : Christian Tshibanda (Chris)
// Description : Script principal de l'application Eden Engine

// Vérifie si le navigateur supporte les modules ES
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
    <p id="status" style="margin-top:20px; color:#888;">Chargement terminé ✅</p>
  </div>
`;

// === Événement du bouton Rafraîchir ===
document.getElementById("refreshBtn").addEventListener("click", () => {
  location.reload();
});

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

console.log("🌐 Eden Engine prêt !");
