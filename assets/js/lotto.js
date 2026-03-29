(function () {
  const body = document.body;
  const key = body.dataset.lotto;
  if (!key || !window.siteData || !window.siteData.lotti[key]) return;

  const data = window.siteData.lotti[key];
  let geoLayer;

  document.getElementById('lotTitle').textContent = `${data.name} - carta di sintesi`;

  const summaryEl = document.getElementById('lotSummary');
  [
    ['Comuni', data.summary.comuni],
    ['Indagini censite', data.summary.indagini],
    ['Avanzamento medio', data.summary.avanzamento]
  ].forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    summaryEl.appendChild(card);
  });

  const availableEl = document.getElementById('availableInvestigations');
  const block = document.createElement('div');
  block.className = 'list-block';
  block.innerHTML = '<h3>Categorie</h3>';
  const ul = document.createElement('ul');
  ul.className = 'badge-list';

  Object.entries(data.available).forEach(([name, value]) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><span class="badge-count">${value}</span>`;
    ul.appendChild(li);
  });

  block.appendChild(ul);
  availableEl.appendChild(block);

  const plannedEl = document.getElementById('plannedInvestigations');
  data.planned.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.title}</strong><span>${item.note}</span>`;
    plannedEl.appendChild(li);
  });

  const map = L.map('lotMap', {
    zoomControl: true
  });

  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri' }
  );

  const light = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    { attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
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

  const jsonMap = {
    lotto1: 'assets/data/lotto1_shapes.json',
    lotto2: 'assets/data/lotto2_shapes.json',
    lotto3: 'assets/data/lotto3_shapes.json'
  };

  const jsonFile = jsonMap[key];
  if (!jsonFile) return;

  const iconSondaggi = L.icon({
    iconUrl: 'assets/images/sondaggio.png',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  const iconDownHole = L.icon({
    iconUrl: 'assets/images/downhole.png',
    iconSize: [28, 20],
    iconAnchor: [10, 10]
  });

  const iconHVSR = L.icon({
    iconUrl: 'assets/images/hvsr.png',
    iconSize: [24, 20],
    iconAnchor: [12, 10]
  });

  function drawPoint(indagine, layerGroup) {
    let marker;

    if (indagine.tipo === 'Sondaggi') {
      marker = L.marker([indagine.lat, indagine.lng], { icon: iconSondaggi });
    } else if (indagine.tipo === 'Down Hole') {
      marker = L.marker([indagine.lat, indagine.lng], { icon: iconDownHole });
    } else if (indagine.tipo === 'HVSR') {
      marker = L.marker([indagine.lat, indagine.lng], { icon: iconHVSR });
    } else {
      marker = L.circleMarker([indagine.lat, indagine.lng], {
        radius: 6,
        color: '#666666',
        fillColor: '#666666',
        fillOpacity: 0.9,
        weight: 2
      });
    }

    marker.bindPopup(`<strong>${indagine.nome}</strong><br>${indagine.tipo}`);
    layerGroup.addLayer(marker);
  }

  function drawLine(indagine, layerGroup) {
    let style = {
      color: '#666666',
      weight: 3
    };

    if (indagine.tipo === 'MASW') {
      style = {
        color: '#000000',
        weight: 4
      };
    }

    if (indagine.tipo === 'Rifrazione') {
      style = {
        color: '#c62828',
        weight: 3,
        dashArray: '6,4'
      };
    }

    const line = L.polyline(indagine.coords, style);
    line.bindPopup(`<strong>${indagine.nome}</strong><br>${indagine.tipo}`);
    layerGroup.addLayer(line);
  }

  function drawIndagini(layerGroup) {
    if (!Array.isArray(data.indagini)) return;

    data.indagini.forEach((indagine) => {
      if (Array.isArray(indagine.coords)) {
        drawLine(indagine, layerGroup);
      } else if (
        typeof indagine.lat === 'number' &&
        typeof indagine.lng === 'number'
      ) {
        drawPoint(indagine, layerGroup);
      }
    });
  }

  fetch(jsonFile)
    .then(res => res.json())
    .then(geojsonData => {
      geoLayer = L.geoJSON(geojsonData, {
        style: function () {
          return {
            color: '#5a5a5a',
            weight: 1,
            fillColor: '#d8efcc',
            fillOpacity: 0.7
          };
        },
        onEachFeature: function (feature, layer) {
          let nome = 'Elemento cartografico';
          if (feature.properties) {
            nome =
              feature.properties.nome ||
              feature.properties.NAME ||
              feature.properties.Comune ||
              feature.properties.COMUNE ||
              feature.properties.id ||
              nome;
          }
          layer.bindPopup(`<strong>${nome}</strong>`);
        }
      }).addTo(map);

      const indaginiLayer = L.layerGroup().addTo(map);
      drawIndagini(indaginiLayer);

   
try {
  const boundsGroup = L.featureGroup([geoLayer, indaginiLayer]);

  if (boundsGroup.getBounds().isValid()) {
    map.fitBounds(boundsGroup.getBounds(), { padding: [20, 20] });
  } else if (geoLayer.getBounds().isValid()) {
    map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
  } else {
    map.setView(data.center, 11);
  }
} catch (e) {
  map.setView(data.center, 11);
        } else if (geoLayer.getBounds().isValid()) {
          map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
        } else {
          map.setView(data.center, 11);
        }
      } catch (e) {
        map.setView(data.center, 11);
      }

      createOpacityControl();
    })
    .catch(err => {
      console.error('Errore caricamento GeoJSON:', err);
      map.setView(data.center, 11);
    });

  const colors = [
    '#174e8c',
    '#31a3dd',
    '#2e7d32',
    '#ef6c00',
    '#7b1fa2',
    '#c62828',
    '#6a9bd1',
    '#3f51b5',
    '#009688',
    '#8bc34a',
    '#ff9800',
    '#795548'
  ];

  const ctx = document.getElementById('progressChart');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.comuni.map(c => c.name),
      datasets: [{
        data: data.comuni.map(c => c.progress),
        backgroundColor: colors.slice(0, data.comuni.length),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}%`
          }
        }
      }
    }
  });

  const legendEl = document.getElementById('progressLegend');
  data.comuni.forEach((comune, index) => {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = `
      <div class="legend-left">
        <span class="legend-dot" style="background:${colors[index]}"></span>
        <span>${comune.name}</span>
      </div>
      <strong>${comune.progress}%</strong>
    `;
    legendEl.appendChild(row);
  });

  function createOpacityControl() {
    const control = L.control({ position: 'bottomleft' });

    control.onAdd = function () {
      const div = L.DomUtil.create('div', 'opacity-control');
      div.innerHTML = `
        <div style="background:white;padding:8px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          <label style="font-size:12px;">Trasparenza layer</label><br>
          <input type="range" min="0" max="1" step="0.05" value="0.7" id="opacitySliderLotto">
        </div>
      `;
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);
      return div;
    };

    control.addTo(map);

    setTimeout(() => {
      const slider = document.getElementById('opacitySliderLotto');
      if (!slider || !geoLayer) return;

      slider.addEventListener('input', function () {
        const val = parseFloat(this.value);
        geoLayer.setStyle({
          fillOpacity: val
        });
      });
    }, 200);
  }
})();
