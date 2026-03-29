(function () {
  const map = L.map('homeMap', {
    zoomControl: true
  }).setView([41.7, 14.7], 9);

  map.createPane('paneMolise');
  map.getPane('paneMolise').style.zIndex = 400;

  map.createPane('paneLotti');
  map.getPane('paneLotti').style.zIndex = 500;

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri'
    }
  );

  const light = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  );

  light.addTo(map);

  L.control.layers(
    {
      'Street Map': osm,
      'Satellite': satellite,
      'Light Gray': light
    },
    null,
    {
      collapsed: false,
      position: 'topright'
    }
  ).addTo(map);

  fetch('assets/data/molise.json')
    .then(res => res.json())
    .then(moliseData => {
      let moliseLayer;

fetch('assets/data/molise.json')
  .then(res => res.json())
  .then(moliseData => {

    moliseLayer = L.geoJSON(moliseData, {
      pane: 'paneMolise',
      style: function () {
        return {
          color: '#bfbfbf',
          weight: 1,
          fillColor: '#eeeeee',
          fillOpacity: 0.5
        };
      },
      interactive: false
    }).addTo(map);

    map.fitBounds(moliseLayer.getBounds(), { padding: [20, 20] });

    createOpacityControl();

  });
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

          const pagina =
            props.pagina ||
            props.link ||
            props.url ||
            (String(nome).toLowerCase().includes('1') ? 'lotto1.html' :
             String(nome).toLowerCase().includes('2') ? 'lotto2.html' :
             String(nome).toLowerCase().includes('3') ? 'lotto3.html' : '#');

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
            if (pagina && pagina !== '#') {
              window.location.href = pagina;
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
