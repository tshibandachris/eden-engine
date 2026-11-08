import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Élément #root introuvable dans le document HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    const publicUrl = process.env.PUBLIC_URL || "";
    navigator.serviceWorker.register(`${publicUrl}/service-worker.js`).catch((error) => {
      console.error("Enregistrement du Service Worker impossible :", error);
    });
  });
}
