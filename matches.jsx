
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
export default function Matches(){ const [date,setDate]=useState(new Date().toISOString().split('T')[0]); const [matches,setMatches]=useState([]);
const [loading,setLoading]=useState(false); const [error,setError]=useState(null);
useEffect(()=>{ fetchForDate(date); },[]);
async function fetchForDate(d){ setLoading(true); setError(null); try{ const res=await fetch(`${API}/api/matches?date=${encodeURIComponent(d)}`); if(!res.ok) throw new Error('API'); const json=await res.json(); setMatches(json); }catch(e){ setError('Impossible de récupérer'); }finally{ setLoading(false); } }
return (<div className="min-h-screen flex"><Sidebar /><main className="flex-1 p-8"><Topbar date={date} onDateChange={(e)=>{ setDate(e.target.value); fetchForDate(e.target.value); }} /><div className="container mt-6">{loading? <div>Chargement...</div> : error? <div>{error}</div> : matches.length===0? <div>Aucun match</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{matches.map(m=>(<div key={m.id} className="p-4 eden-glass rounded-xl border"><div className="text-sm text-gray-300">{m.league}</div><div className="text-lg font-semibold">{m.home_team} vs {m.away_team}</div><div className="mt-2 text-sm">Confiance: {m.coherence_score || m.coherence?.score || '-'}</div></div>))}</div>}</div></main></div>); }
