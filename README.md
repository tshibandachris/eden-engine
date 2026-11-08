# Eden Engine

Eden Engine est une application web de consultation des calendriers et résultats de football. Cette version utilise une seule interface React et une couche dédiée à l'accès aux données OpenLigaDB.

## Prérequis

- Node.js 20 ou supérieur
- npm

## Développement

```bash
npm install
npm start
```

## Vérification de production

```bash
npm run build
```

Le résultat de compilation est généré dans `build/`.

## Architecture

- `src/index.js` : point d'entrée React.
- `src/App.jsx` : interface et états de l'application.
- `src/api/openliga.js` : accès HTTP et normalisation des rencontres OpenLigaDB.
- `src/index.css` : styles de l'interface.
- `public/index.html` : document HTML servi par Create React App.
- `public/manifest.json` et `public/service-worker.js` : socle PWA.

Les modèles mathématiques et leur validation restent dans le dépôt distinct `eden-foot-models.`. Eden Engine ne les importe pas directement : toute intégration future devra passer par un contrat de données explicite et versionné.

## Source des données

Les calendriers et résultats affichés proviennent du service externe OpenLigaDB. Leur disponibilité, leur couverture des compétitions et leur actualisation dépendent de ce service. L'application ne produit pas encore de prédictions et ne doit pas être présentée comme un moteur de pronostics validé.

## Déploiement GitHub Pages

Le champ `homepage` du package est configuré pour le dépôt GitHub Pages. La commande `npm run deploy` publie le contenu du dossier `build/` sur la branche de publication configurée.
