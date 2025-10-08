
import {useEffect} from 'react';
import {useRouter} from 'next/router';
export default function Home(){ const r=useRouter(); useEffect(()=>r.replace('/matches'),[]); return <div className="min-h-screen flex items-center justify-center">Redirection…</div> }
