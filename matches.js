
import express from 'express';
import { loadCache, saveCache } from '../utils/edenCache.js';
import { fetchMatchesForDate } from '../utils/edenApi.js';
import { generatePredictions } from '../utils/edenPredictor.js';

const router = express.Router();

router.get('/matches', async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const cacheKey = `matches_${date}`;
  try {
    const cached = loadCache(cacheKey);
    if (cached) {
      console.log('Serving from cache:', cacheKey);
      return res.json(cached);
    }

    const raw = await fetchMatchesForDate(date);
    const enriched = await Promise.all(raw.map(async m => {
      const normalized = {
        id: m.id || m.fixture?.id || null,
        home_team: m.home_team || m.teams?.home?.name || (m.localTeam && m.localTeam.data && m.localTeam.data.name) || 'Home',
        away_team: m.away_team || m.teams?.away?.name || (m.visitorTeam && m.visitorTeam.data && m.visitorTeam.data.name) || 'Away',
        league: m.league || (m.league && m.league.name) || null,
        avg_odds: m.avg_odds || null,
        predictions: m.predictions || []
      };
      return await generatePredictions(normalized);
    }));

    saveCache(cacheKey, enriched);
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch matches' });
  }
});

router.get('/matches/today', async (req,res)=>{
  req.query.date = req.query.date || new Date().toISOString().split('T')[0];
  return router.handle(req, res);
});

export default router;
