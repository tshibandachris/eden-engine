
import express from 'express';
import { loadCache, saveCache } from '../utils/edenCache.js';
import { fetchMatchDetails } from '../utils/edenApi.js';
import { generatePredictions } from '../utils/edenPredictor.js';

const router = express.Router();

router.get('/match/:id', async (req, res) => {
  const id = req.params.id;
  const cacheKey = `match_${id}`;
  try {
    const cached = loadCache(cacheKey);
    if (cached) return res.json(cached);

    const raw = await fetchMatchDetails(id);
    if (!raw) return res.status(404).json({ error: 'Not found' });

    const normalized = {
      id: raw.fixture?.id || raw.id,
      home_team: raw.teams?.home?.name || raw.home_team,
      away_team: raw.teams?.away?.name || raw.away_team,
      league: raw.league?.name || raw.league || null,
      avg_odds: raw.odds?.average || null,
      predictions: raw.predictions || []
    };

    const enriched = await generatePredictions(normalized);
    saveCache(cacheKey, enriched);
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch match' });
  }
});

export default router;
