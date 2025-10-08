
function stdDev(values){ if(!values||values.length===0) return 0; const mean = values.reduce((a,b)=>a+b,0)/values.length; const variance = values.reduce((a,b)=>a+Math.pow(b-mean,2),0)/values.length; return Math.sqrt(variance); }

function poissonEstimate(homeStrength, awayStrength){
  const gh = Math.max(0.2, 1.1 + (homeStrength - awayStrength) * 1.1 + (Math.random()*0.4-0.2));
  const ga = Math.max(0.2, 0.9 + (awayStrength - homeStrength) * 0.9 + (Math.random()*0.4-0.2));
  return { goals_home: Number(gh.toFixed(2)), goals_away: Number(ga.toFixed(2)), winner: gh>ga ? 'home' : gh<ga ? 'away' : 'draw' };
}

function eloEstimate(homeElo=1500, awayElo=1500){
  const expectedHome = 1/(1+Math.pow(10,(awayElo-homeElo)/400));
  const expectedAway = 1-expectedHome;
  return { goals_home: Number((expectedHome*2.1).toFixed(2)), goals_away: Number((expectedAway*2.1).toFixed(2)), winner: expectedHome>expectedAway?'home':'away' };
}

function xgEstimate(homeForm=0.5, awayForm=0.5){
  const gh = Math.max(0.2, 1.2 + (homeForm-awayForm)*1.4);
  const ga = Math.max(0.2, 1.0 + (awayForm-homeForm)*1.0);
  return { goals_home: Number(gh.toFixed(2)), goals_away: Number(ga.toFixed(2)), winner: gh>ga?'home':gh<ga?'away':'draw' };
}

async function recentForm(teamName){ let h=0; for(let i=0;i<teamName.length;i++) h=(h*31+teamName.charCodeAt(i))%101; return (50 + (h%40))/100; }

export async function generatePredictions(match){
  const homeForm = await recentForm(match.home_team||'home');
  const awayForm = await recentForm(match.away_team||'away');
  const poisson = poissonEstimate(homeForm, awayForm);
  const elo = eloEstimate(1550,1500);
  const xg = xgEstimate(homeForm, awayForm);
  const formPred = { goals_home: Number((1.0+homeForm).toFixed(2)), goals_away: Number((1.0+awayForm).toFixed(2)), winner: homeForm>awayForm?'home':homeForm<awayForm?'away':'draw' };
  const preds = [{model:'Poisson',...poisson},{model:'ELO',...elo},{model:'xG',...xg},{model:'Form',...formPred}];
  const counts = preds.reduce((a,p)=>{ a[p.winner]=(a[p.winner]||0)+1; return a; },{});
  const top = Object.keys(counts).reduce((a,b)=> counts[a]>counts[b]?a:b);
  const coherence = Math.round((counts[top]/preds.length)*100);
  return { ...match, predictions: preds, coherence_score: coherence };
}
