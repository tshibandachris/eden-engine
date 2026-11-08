# Eden Engine

Application web progressive de consultation des matchs de football, construite avec React.

## Périmètre actuel

Cette version fournit une interface unifiée pour :
- consulter les matchs disponibles par compétition ;
- afficher les équipes, la date et le score lorsqu'un résultat est publié ;
- actualiser manuellement les données ;
- installer l'application comme PWA et conserver une interface de base accessible hors ligne.

Les données de matchs proviennent de l'API publique [OpenLigaDB](https://www.openligadb.de/). Leur disponibilité dépend de ce fournisseur et de la couverture de ses compétitions.

**Limite fonctionnelle :** cette application est un outil de consultation de calendriers et de résultats. Elle ne produit pas de prédictions, de cotes ni de recommandations de mise. Le dépôt `eden-foot-models` reste indépendant ; aucune intégration avec ce dépôt n'est créée par cette version.

## Architecture

```text
public/
  index.html
  manifest.json
  icon.svg
  service-worker.js
src/
  api/
    openliga.js
    openliga.test.js
  App.jsx
  index.js
  index.css
```

- `src/index.js` : point d'entrée React unique.
- `src/App.jsx` : interface et états de chargement.
- `src/api/openliga.js` : accès HTTP et normalisation des matchs.
- `public/` : document HTML, manifeste, icône et service worker.
- `.github/workflows/ci.yml` : tests et compilation automatisés.

Les anciennes implémentations concurrentes à la racine ont été retirées : le build React utilise désormais exclusivement l'arborescence `src/` et `public/`.

## Prérequis

- Node.js 20 ou supérieur
- npm

## Installation et développement

```bash
npm install
npm start
```

L'application est ensuite disponible sur `http://localhost:3000`.

## Vérifications

```bash
npm test -- --passWithNoTests
npm run build
```

## Déploiement GitHub Pages

```bash
npm run deploy
```

Le champ `homepage` de `package.json` et les chemins `PUBLIC_URL` tiennent compte du sous-chemin GitHub Pages `/eden-engine/`.

## Hors ligne

Le service worker met en cache uniquement les ressources statiques de l'application. Les appels à OpenLigaDB nécessitent une connexion réseau ; les données distantes ne sont pas présentées comme disponibles hors ligne.

## Gouvernance

Les modifications sont proposées sur une branche dédiée et intégrées à `main` uniquement après revue de la pull request et réussite des vérifications.
