
import React, {useEffect, useState} from 'react';

const API_THE_SPORTS_DB = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=';

function formatTime(t){
  if(!t) return '';
  if(t.indexOf(':')>=0 && t.length<=8) return t;
  try{ const d = new Date(t); return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }catch(e){ return t; }
}

async function fetchMatches(date){
  try{
    const url = `${API_THE_SPORTS_DB}${date}&s=Soccer`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('network');
    const json = await res.json();
    return json.events || [];
  }catch(e){
    console.warn('fetchMatches failed', e);
    return null;
  }
}

export default function App(){
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(date); /* eslint-disable-next-line */ },[]);

  async function load(d){
    setLoading(true);
    const list = await fetchMatches(d);
    setMatches(list);
    setLoading(false);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">E</div>
          <div>
            <h1>Eden Engine</h1>
            <div className="subtitle">Prédictions de paris football</div>
          </div>
        </div>
      </header>
      <main className="container">
        <section className="controls">
          <label htmlFor="date">Date :</label>
          <input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <button onClick={()=>load(date)}>{loading ? 'Chargement...' : 'Actualiser'}</button>
        </section>
        <section className="grid">
          {matches === null && <div className="card">Impossible de récupérer les matchs.</div>}
          {Array.isArray(matches) && matches.length===0 && <div className="card">Aucun match pour cette date.</div>}
          {Array.isArray(matches) && matches.map(ev=>(
            <article key={ev.idEvent || ev.id || Math.random()} className="card">
              <div className="team-logo"><img src={ev.strHomeTeamBadge || '%PUBLIC_URL%/icons/checklist.png'} alt="home" /></div>
              <div className="info">
                <div className="league">{ev.strLeague}</div>
                <div className="teams">{ev.strHomeTeam} <span style={{opacity:0.7}}>vs</span> {ev.strAwayTeam}</div>
                <div className="meta">Heure: {formatTime(ev.strTime||ev.dateEvent)} • ID: {ev.idEvent}</div>
              </div>
              <div className="team-logo"><img src={ev.strAwayTeamBadge || '%PUBLIC_URL%/icons/user.png'} alt="away" /></div>
            </article>
          ))}
        </section>
      </main>
      <footer className="footer">Eden Engine — © 2025 Christian Tshibanda</footer>
    </div>
  );
}
