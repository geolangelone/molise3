# Portale Monitoraggio Indagini - demo GitHub Pages

Questo pacchetto contiene un sito statico pronto per essere pubblicato su GitHub Pages.

## Contenuto
- `index.html` = home con carta generale e 3 aree cliccabili
- `lotto1.html`, `lotto2.html`, `lotto3.html` = pagine dei lotti
- `download.html` = area download
- `assets/css/style.css` = stile grafico
- `assets/js/data.js` = dati fittizi da modificare
- `assets/js/home.js` = logica della home
- `assets/js/lotto.js` = logica delle pagine lotto

## Come pubblicarlo su GitHub Pages
1. Crea un account GitHub.
2. Crea un nuovo repository, per esempio `portale-lotti`.
3. Carica tutti questi file nel repository.
4. Vai in `Settings` > `Pages`.
5. In `Build and deployment`, scegli:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
6. Salva.
7. Dopo pochi minuti il sito sarà online con un link del tipo:
   `https://tuonome.github.io/portale-lotti/`

## Dove modificare i contenuti
Apri `assets/js/data.js` e cambia:
- nomi dei Comuni
- percentuali di avanzamento
- conteggi delle indagini
- elenco indagini programmate
- coordinate dei marker e dei poligoni

## Note
- Il sito usa Leaflet e Chart.js via CDN.
- Non serve PHP.
- È adatto a GitHub Pages, Netlify e Vercel.
