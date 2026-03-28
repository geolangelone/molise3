(function () {
  const mapEl = document.getElementById('homeMap');
  if (!mapEl || !window.siteData) return;

  const map = L.map('homeMap', { scrollWheelZoom: true }).setView(window.siteData.homeCenter, 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  Object.values(window.siteData.lotti).forEach((lotto) => {
    const polygon = L.polygon(lotto.polygon, {
      color: lotto.color,
      weight: 3,
      fillColor: lotto.color,
      fillOpacity: 0.28
    }).addTo(map);

    polygon.bindPopup(`
      <div>
        <h3 class="popup-title">${lotto.name}</h3>
        <div>Comuni: <strong>${lotto.summary.comuni}</strong></div>
        <div>Indagini: <strong>${lotto.summary.indagini}</strong></div>
        <div>Avanzamento medio: <strong>${lotto.summary.avanzamento}</strong></div>
        <a class="popup-link" href="${lotto.link}">Apri pagina</a>
      </div>
    `);

    polygon.on('click', () => {
      window.location.href = lotto.link;
    });
  });
})();
