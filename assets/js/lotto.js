(function () {
  const body = document.body;
  const key = body.dataset.lotto;
  if (!key || !window.siteData || !window.siteData.lotti[key]) return;

  const data = window.siteData.lotti[key];
  let geoLayer;
  let pickingPoint = false;

  const storageKey = `indagini_${key}`;

  function loadSavedPoints() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  }

  function savePoints(points) {
    localStorage.setItem(storageKey, JSON.stringify(points));
  }

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
    {
      attribution: 'Tiles &copy; Esri'
    }
  );

  const light = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{y}/{x}{r}.png',
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

  const jsonMap = {
    lotto1: 'assets/data/lotto1_shapes.json',
    lotto2: 'assets/data/lotto2_shapes.json',
    lotto3: 'assets/data/lotto3_shapes.json'
  };

  const jsonFile = 'assets/data/lotto1_shapes.json';
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

  function getPointMarker(indagine) {
    if (indagine.tipo === 'Sondaggi') {
      return L.marker([indagine.lat, indagine.lng], { icon: iconSondaggi });
    }
    if (indagine.tipo === 'Down Hole') {
      return L.marker([indagine.lat, indagine.lng], { icon: iconDownHole });
    }
    if (indagine.tipo === 'HVSR') {
      return L.marker([indagine.lat, indagine.lng], { icon: iconHVSR });
    }

    return L.circleMarker([indagine.lat, indagine.lng], {
      radius: 6,
      color: '#666666',
      fillColor: '#666666',
      fillOpacity: 0.9,
      weight: 2
    });
  }

  const indaginiLayer = L.layerGroup().addTo(map);

  function redrawSavedPoints() {
    indaginiLayer.clearLayers();
    const points = loadSavedPoints();

    points.forEach((indagine) => {
      const marker = getPointMarker(indagine);
      marker.bindPopup(`<strong>${indagine.nome}</strong><br>${indagine.tipo}`);
      indaginiLayer.addLayer(marker);
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

geoLayer.eachLayer(function (layer) {
  layer.on('click', function (e) {
    if (!pickingPoint) return;

    L.DomEvent.stop(e); // blocca il click del poligono

    latEl.value = e.latlng.lat.toFixed(6);
    lngEl.value = e.latlng.lng.toFixed(6);

    pickingPoint = false;
    pickBtn.textContent = 'Scegli con click';
    map.getContainer().style.cursor = '';
  });
});

      
      redrawSavedPoints();

     if (geoLayer && geoLayer.getBounds().isValid()) {
  map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
} else {
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

  const tipoEl = document.getElementById('indagineTipo');
  const nomeEl = document.getElementById('indagineNome');
  const latEl = document.getElementById('indagineLat');
  const lngEl = document.getElementById('indagineLng');
  const pickBtn = document.getElementById('pickPointBtn');
  const saveBtn = document.getElementById('savePointBtn');

function applyPickedPoint(latlng) {
  latEl.value = latlng.lat.toFixed(6);
  lngEl.value = latlng.lng.toFixed(6);
  pickingPoint = false;
  pickBtn.textContent = 'Scegli con click';
  map.getContainer().classList.remove('picking-point');
}

if (pickBtn) {
  pickBtn.addEventListener('click', function () {
    pickingPoint = true;
    pickBtn.textContent = 'Clicca sulla mappa...';
    map.getContainer().classList.add('picking-point');
  });
}

map.on('click', function (e) {
  if (!pickingPoint) return;
  applyPickedPoint(e.latlng);
});

  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const tipo = tipoEl.value;
      const nome = nomeEl.value.trim();
      const lat = parseFloat(latEl.value);
      const lng = parseFloat(lngEl.value);

      if (!nome || isNaN(lat) || isNaN(lng)) {
        alert('Compila nome, latitudine e longitudine.');
        return;
      }

      const points = loadSavedPoints();
      points.push({ tipo, nome, lat, lng });
      savePoints(points);
      redrawSavedPoints();

      nomeEl.value = '';
      latEl.value = '';
      lngEl.value = '';
    });
  }

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
