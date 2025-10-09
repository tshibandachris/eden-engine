
const API_THE_SPORTS_DB = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=';
const dateInput = document.getElementById('date');
const refreshBtn = document.getElementById('refresh');
const grid = document.getElementById('grid');
const splash = document.getElementById('splash');

dateInput.value = new Date().toISOString().split('T')[0];

function formatTime(t){
  if(!t) return '';
  // if time is "20:00:00" keep it, else try to parse ISO datetime
  if(t.indexOf(':')>=0 && t.length<=8) return t;
  try{
    const d = new Date(t);
    return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }catch(e){ return t; }
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

function render(events){
  grid.innerHTML='';
  if(events === null){
    grid.innerHTML = '<div class="card">Impossible de récupérer les matchs. Vérifie ta connexion.</div>';
    return;
  }
  if(events.length===0){
    grid.innerHTML = '<div class="card">Aucun match disponible pour cette date.</div>';
    return;
  }
  events.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'card';
    const league = ev.strLeague || '';
    const time = formatTime(ev.strTime || ev.strTimestamp);
    const home = ev.strHomeTeam || 'Home';
    const away = ev.strAwayTeam || 'Away';
    const venue = ev.strVenue ? `<div class="meta">Lieu: ${ev.strVenue}</div>` : '';
    div.innerHTML = `<div class="league">${league}</div>
                     <div class="teams">${home} <span style="opacity:0.7">vs</span> ${away}</div>
                     <div class="meta">Heure: ${time} • Match ID: ${ev.idEvent}</div>
                     ${venue}`;
    grid.appendChild(div);
  });
}

refreshBtn.addEventListener('click', async ()=>{
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Chargement...';
  const date = dateInput.value;
  const list = await fetchMatches(date);
  render(list);
  refreshBtn.disabled = false;
  refreshBtn.textContent = 'Actualiser';
});

window.addEventListener('load', ()=>{
  setTimeout(()=>{ splash.classList.add('hidden'); setTimeout(()=>splash.style.display='none',600); },700);
  refreshBtn.click();
});

if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
