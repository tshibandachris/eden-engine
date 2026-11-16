# Eden Engine

Eden Engine est une application web de consultation des calendriers et résultats de football. Cette version utilise une interface React et une couche dédiée à l'accès aux données OpenLigaDB.

## Prérequis

- Node.js 24 LTS
- npm fourni avec Node.js

## Développement

```bash
npm ci
npm start
```

## Vérification

```bash
npm run test:ci
npm run build
```

Le résultat de compilation est généré dans `build/`. Le fichier `package-lock.json` est la référence de résolution des dépendances ; toute modification de `package.json` doit être suivie d'une mise à jour du lockfile.

## Architecture

- `src/index.js` : point d'entrée React et enregistrement du Service Worker.
- `src/App.jsx` : interface et états de l'application.
- `src/api/openliga.js` : accès HTTP, calcul de l'année de saison et normalisation des rencontres OpenLigaDB.
- `src/api/openliga.test.js` : tests du calcul de saison.
- `src/index.css` : styles de l'interface.
- `public/index.html` : document HTML servi par Create React App.
- `public/manifest.json` et `public/service-worker.js` : socle PWA.

Les modèles mathématiques et leur validation restent dans le dépôt distinct `eden-foot-models`. Eden Engine ne les importe pas directement : toute intégration future devra passer par un contrat de données explicite et versionné.

## Source des données

Les calendriers et résultats affichés proviennent du service externe OpenLigaDB. Leur disponibilité, leur couverture des compétitions et leur actualisation dépendent de ce service. L'application ne produit pas encore de prédictions et ne doit pas être présentée comme un moteur de pronostics validé.

## Publication GitHub Pages

Le workflow de publication construit l'application React puis publie exclusivement le dossier `build/`. Dans les paramètres du dépôt, la source GitHub Pages doit être réglée sur **GitHub Actions**. La publication automatique est déclenchée par les changements sur `main` ; les branches de correction servent à la validation et ne publient pas le site.
