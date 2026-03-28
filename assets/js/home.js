(function () {

  const map = L.map('homeMap').setView([41.7, 14.7], 9);

  // BASE MAP (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);


  // ------------------------
  // MOLISE (GRIGIO CHIARISSIMO)
  // ------------------------
  fetch('assets/data/molise.json')
    .then(res => res.json())
    .then(moliseData => {

      const moliseLayer = L.geoJSON(moliseData, {
        style: function () {
          return {
            color: '#bbbbbb',
            weight: 1,
            fillColor: '#eeeeee',
            fillOpacity: 0.7
          };
        }
      }).addTo(map);

      map.fitBounds(moliseLayer.getBounds(), { padding: [20, 20] });

    });


  // ------------------------
  // LOTTI (SKY BLUE)
  // ------------------------
  fetch('assets/data/lotti_home.json')
    .then(res => res.json())
    .then(lottiData => {

      L.geoJSON(lottiData, {

        style: function () {
          return {
            color: '#3fa9f5',        // bordo
            weight: 3,
            fillColor: '#87ceeb',    // sky blue
            fillOpacity: 0.4
          };
        },

        onEachFeature: function (feature, layer) {

          const nome =
            feature.properties?.nome ||
            feature.properties?.name ||
            'Lotto';

          let link = '#';
          const n = nome.toLowerCase();

          if (n.includes('1')) link = 'lotto1.html';
          if (n.includes('2')) link = 'lotto2.html';
          if (n.includes('3')) link = 'lotto3.html';

          layer.bindTooltip(nome, { sticky: true });

          layer.on('click', function () {
            window.location.href = link;
          });
        }

      }).addTo(map);

    });

})();
