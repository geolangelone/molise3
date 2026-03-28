(function () {
  const map = L.map('homeMap', {
    zoomControl: true
  }).setView([41.7, 14.7], 9);

  map.createPane('paneMolise');
  map.getPane('paneMolise').style.zIndex = 400;

  map.createPane('paneLotti');
  map.getPane('paneLotti').style.zIndex = 500;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    opacity: 0.55
  }).addTo(map);

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

  fetch('assets/data/lotti_home.json')
    .then(res => res.json())
    .then(lottiData => {
      const lottiLayer = L.geoJSON(lottiData, {
        pane: 'paneLotti',
        style: function () {
          return {
            color: '#87ceeb',
            weight: 4,
            fillColor: '#87ceeb',
            fillOpacity: 0
          };
        },

        onEachFeature: function (feature, layer) {
          const props = feature.properties || {};

          const nome =
            props.nome ||
            props.name ||
            props.NOME ||
            props.NAME ||
            props.lotto ||
            props.LOTTO ||
            'Lotto';

          let link = '#';

          const testo = String(nome).toLowerCase();

          if (testo.includes('1')) link = 'lotto1.html';
          else if (testo.includes('2')) link = 'lotto2.html';
          else if (testo.includes('3')) link = 'lotto3.html';

          layer.bindTooltip(nome, { sticky: true });

          layer.on('mouseover', function () {
            layer.setStyle({
              color: '#3fa9f5',
              weight: 5,
              fillColor: '#87ceeb',
              fillOpacity: 0.22
            });
          });

          layer.on('mouseout', function () {
            lottiLayer.resetStyle(layer);
          });

          layer.on('click', function () {
            if (link !== '#') {
              window.location.href = link;
            } else {
              alert('Il lotto è visibile ma non ha un nome riconosciuto nel file JSON.');
            }
          });
        }
      }).addTo(map);

      lottiLayer.bringToFront();
    })
    .catch(err => {
      console.error('Errore caricamento lotti_home.json:', err);
    });
})();
