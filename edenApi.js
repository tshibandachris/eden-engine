
import fetch from 'node-fetch';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const FOOTBALLDATA_KEY = process.env.FOOTBALLDATA_KEY;

async function tryApiFootball(date){
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${date}`;
  const res = await fetch(url, { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com' } });
  if (!res.ok) throw new Error('API-Football no response');
  const json = await res.json();
  return json.response || [];
}

async function tryFootballData(date){
  const url = `https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`;
  const res = await fetch(url, { headers: { 'X-Auth-Token': FOOTBALLDATA_KEY } });
  if (!res.ok) throw new Error('Football-Data no response');
  const json = await res.json();
  return (json.matches || []).map(m => ({ id: m.id, home_team: m.homeTeam?.name, away_team: m.awayTeam?.name, league: m.competition?.name }));
}

export async function fetchMatchesForDate(date){
  try { return await tryApiFootball(date); } catch(e){ console.warn('api-football failed', e.message); }
  if (FOOTBALLDATA_KEY) {
    try { return await tryFootballData(date); } catch(e){ console.warn('football-data failed', e.message); }
  }
  return [];
}

export async function fetchMatchDetails(id){
  try {
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${id}`;
    const res = await fetch(url, { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com' } });
    if (!res.ok) throw new Error('no');
    const json = await res.json();
    return json.response?.[0] || null;
  } catch (e) { return null; }
}
