
import fs from 'fs';
import path from 'path';
const CACHE_DIR = path.join(process.cwd(),'cache');
const TTL = 10 * 60 * 1000;
function filePath(key){ return path.join(CACHE_DIR, `${key}.json`); }
export function saveCache(key,data){ if(!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR,{recursive:true}); fs.writeFileSync(filePath(key), JSON.stringify({ts:Date.now(),data},null,2)); }
export function loadCache(key){ const p=filePath(key); if(!fs.existsSync(p)) return null; try{ const raw=JSON.parse(fs.readFileSync(p,'utf8')); if(Date.now()-raw.ts>TTL) return null; return raw.data; }catch(e){ return null; } }
