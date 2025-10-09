
Eden Engine - PWA connected to TheSportsDB (no API key required)

Deploy:
1. Unzip.
2. Upload all files to the root of your 'eden-engine' GitHub repo.
3. GitHub Pages: Settings -> Pages -> Branch = main, Folder = / (root). Save.
4. Wait ~1-2 minutes and open https://tshibandachris.github.io/eden-engine/

Notes:
- This version uses TheSportsDB public endpoint to fetch soccer matches by date.
- Works offline thanks to the service worker (cached shell).
- To replace icons, swap files in assets/icons/ (192x192 and 512x512 recommended).
