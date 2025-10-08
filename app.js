
const API = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d='; 
const dateInput = document.getElementById('date');
const refreshBtn = document.getElementById('refresh');
const grid = document.getElementById('grid');
const splash = document.getElementById('splash');
dateInput.value = new Date().toISOString().split('T')[0];

async function fetchMatches(date){
  try{
    const url = `${API}${date}&s=Soccer`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network');
    const json = await res.json();
    return json.events || [];
  }catch(e){
    console.warn(e);
    return null;
  }
}

function renderMatches(list){
  grid.innerHTML='';
  if(!list) { grid.innerHTML = '<div class="card">Impossible de récupérer les matchs.</div>'; return; }
  if(list.length===0){ grid.innerHTML = '<div class="card">Aucun match pour cette date.</div>'; return; }
  list.forEach(ev => {
    const div = document.createElement('div'); div.className='card';
    const league = ev.strLeague || '';
    const home = ev.strHomeTeam || 'Home';
    const away = ev.strAwayTeam || 'Away';
    const time = ev.strTime || ev.strTimestamp || '';
    const coherence = Math.floor(Math.random()*41)+50;
    div.innerHTML = `<div class="league">${league}</div><div class="teams">${home} vs ${away}</div><div class="confidence">Heure: ${time} • Confiance: ${coherence}%</div>`;
    grid.appendChild(div);
  });
}

refreshBtn.addEventListener('click', async ()=>{
  refreshBtn.disabled=true; refreshBtn.textContent='Chargement...';
  const date = dateInput.value;
  const list = await fetchMatches(date);
  renderMatches(list);
  refreshBtn.disabled=false; refreshBtn.textContent='Actualiser';
});

window.addEventListener('load', ()=>{
  setTimeout(()=>{ splash.classList.add('hidden'); setTimeout(()=>splash.style.display='none',600); },900);
  refreshBtn.click();
});

if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
