(function () {
  const map = L.map('homeMap', {
    zoomControl: true
  }).setView([41.7, 14.7], 9);

  // PANES: ordine dei layer
  map.createPane('paneMolise');
  map.getPane('paneMolise').style.zIndex = 400;

  map.createPane('paneLotti');
  map.getPane('paneLotti').style.zIndex = 500;

  // BASEMAP SOTTO
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    opacity: 0.55
  }).addTo(map);

  // LAYER MOLISE: SEMPRE GRIGIO CHIARO UNIFORME
  fetch('assets/data/molise.json')
    .then(res => res.json())
    .then(moliseData => {
      const moliseLayer = L.geoJSON(moliseData, {
        pane: 'paneMolise',
        style: function () {
          return {
            color: '#bfbfbf',
            weight: 1,
            fillColor: '#eeeeee',
            fillOpacity: 0.85
          };
        },
        interactive: false
      }).addTo(map);

      map.fitBounds(moliseLayer.getBounds(), { padding: [20, 20] });
    })
    .catch(err => {
      console.error('Errore caricamento molise.json:', err);
    });

  // LAYER LOTTI: SOPRA IL MOLISE
  fetch('assets/data/lotti_home.json')
    .then(res => res.json())
    .then(lottiData => {
      const lottiLayer = L.geoJSON(lottiData, {
        pane: 'paneLotti',

        style: function () {
          return {
            color: '#3fa9f5',
            weight: 3,
            fillColor: '#87ceeb',
            fillOpacity: 0.45
          };
        },

        onEachFeature: function (feature, layer) {
          const nome =
            feature.properties?.nome ||
            feature.properties?.name ||
            feature.properties?.NOME ||
            'Lotto';

          let link = '#';
          const n = nome.toLowerCase();

          if (n.includes('lotto 1') || n.includes('lotto1') || n === '1') link = 'lotto1.html';
          if (n.includes('lotto 2') || n.includes('lotto2') || n === '2') link = 'lotto2.html';
          if (n.includes('lotto 3') || n.includes('lotto3') || n === '3') link = 'lotto3.html';

          layer.bindTooltip(nome, { sticky: true });

          layer.on('mouseover', function () {
            layer.setStyle({
              weight: 4,
              fillOpacity: 0.65
            });
          });

          layer.on('mouseout', function () {
            lottiLayer.resetStyle(layer);
          });

          layer.on('click', function () {
            window.location.href = link;
          });
        }
      }).addTo(map);

      lottiLayer.bringToFront();
    })
    .catch(err => {
      console.error('Errore caricamento lotti_home.json:', err);
    });
})();
