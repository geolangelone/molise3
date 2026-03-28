(function () {
  const body = document.body;
  const key = body.dataset.lotto;
  if (!key || !window.siteData || !window.siteData.lotti[key]) return;

  const data = window.siteData.lotti[key];
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

  const map = L.map('lotMap').setView(data.center, 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const polygon = L.polygon(data.polygon, {
    color: data.color,
    weight: 3,
    fillColor: data.color,
    fillOpacity: 0.18
  }).addTo(map);
  map.fitBounds(polygon.getBounds(), { padding: [20, 20] });

  data.comuni.forEach((comune) => {
    const marker = L.circleMarker(comune.coords, {
      radius: 8,
      color: data.color,
      fillColor: data.color,
      fillOpacity: 0.95,
      weight: 2
    }).addTo(map);
    marker.bindPopup(`<strong>${comune.name}</strong><br>Avanzamento: ${comune.progress}%`);
  });

  const colors = ['#174e8c', '#31a3dd', '#2e7d32', '#ef6c00', '#7b1fa2', '#c62828'];
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
})();
