window.siteData = {
  homeCenter: [41.72, 14.72],
  lotti: {
    lotto1: {
      name: 'Lotto 1',
      color: '#2e7d32',
      link: 'lotto1.html',
      center: [41.63, 14.16],
      polygon: [
        [41.72, 14.00],
        [41.74, 14.18],
        [41.66, 14.34],
        [41.52, 14.40],
        [41.45, 14.24],
        [41.50, 13.98]
      ],
      summary: {
        comuni: 2,
        indagini: 27,
        avanzamento: '68%'
      },
      available: {
        'Sondaggi': 8,
        'Prospezioni a rifrazione': 3,
        'MASW': 5,
        'Down Hole': 2,
        'HVSR': 6,
        'Altro': 3
      },
      planned: [
        {
          title: 'Integrazione geognostica su dorsale comunale',
          note: 'Previsti 2 sondaggi e 1 prova penetrometrica in area urbana di espansione.'
        },
        {
          title: 'Campagna HVSR aggiuntiva',
          note: 'Acquisizioni di controllo nelle aree con maggiore variabilità litotecnica.'
        },
        {
          title: 'Verifica rifrazione tratto stradale',
          note: 'Ricalibrazione delle sezioni geofisiche in corrispondenza di un nodo viario.'
        }
      ],
      comuni: [
        { name: 'Campobasso', progress: 82, coords: [41.56, 14.67] },
        { name: 'Ripalimosani', progress: 67, coords: [41.61, 14.66] }
      ],
      indagini: [
        { tipo: 'Sondaggi', nome: 'S1', lat: 41.56, lng: 14.67 },
        { tipo: 'Down Hole', nome: 'DH1', lat: 41.61, lng: 14.66 },
        { tipo: 'HVSR', nome: 'HVSR1', lat: 41.58, lng: 14.65 },
        {
          tipo: 'MASW',
          nome: 'MASW1',
          coords: [
            [41.55, 14.64],
            [41.56, 14.66],
            [41.57, 14.68]
          ]
        },
        {
          tipo: 'Rifrazione',
          nome: 'SR1',
          coords: [
            [41.60, 14.62],
            [41.61, 14.64],
            [41.62, 14.66]
          ]
        }
      ]
    },

    lotto2: {
      name: 'Lotto 2',
      color: '#ef6c00',
      link: 'lotto2.html',
      center: [41.88, 15.02],
      polygon: [
        [41.98, 14.58],
        [42.01, 14.93],
        [41.94, 15.18],
        [41.79, 15.16],
        [41.72, 14.95],
        [41.79, 14.64]
      ],
      summary: {
        comuni: 8,
        indagini: 31,
        avanzamento: '56%'
      },
      available: {
        'Sondaggi': 6,
        'Prospezioni a rifrazione': 7,
        'MASW': 4,
        'Down Hole': 5,
        'HVSR': 4,
        'Altro': 5
      },
      planned: [
        {
          title: 'Down-hole in area di fondovalle',
          note: 'Programmata perforazione con logging per verifica delle velocità di dettaglio.'
        },
        {
          title: 'Nuove MASW lungo infrastruttura principale',
          note: 'Acquisizioni lineari su tre sezioni strategiche.'
        },
        {
          title: 'Saggi geotecnici integrativi',
          note: 'Pianificati in corrispondenza di due aree di futura cantierizzazione.'
        }
      ],
      comuni: [
        { name: 'Campomarino', progress: 72, coords: [41.96, 15.04] },
        { name: 'Guglionesi', progress: 61, coords: [41.91, 14.91] },
        { name: 'Mafalda', progress: 41, coords: [41.67, 14.72] },
        { name: 'Portocannone', progress: 54, coords: [41.91, 15.01] },
        { name: 'San Giacomo degli Schiavoni', progress: 52, coords: [42.00, 14.95] },
        { name: 'San Martino in Pensilis', progress: 49, coords: [41.87, 14.92] },
        { name: 'Termoli', progress: 78, coords: [41.99, 14.99] },
        { name: 'Ururi', progress: 43, coords: [41.82, 15.03] }
      ],
      indagini: [
        { tipo: 'Sondaggi', nome: 'S2-1', lat: 41.96, lng: 15.04 },
        { tipo: 'Down Hole', nome: 'DH2-1', lat: 41.91, lng: 14.91 },
        { tipo: 'HVSR', nome: 'HVSR2-1', lat: 41.87, lng: 14.92 },
        {
          tipo: 'MASW',
          nome: 'MASW2-1',
          coords: [
            [41.90, 14.88],
            [41.92, 14.93],
            [41.95, 14.98]
          ]
        },
        {
          tipo: 'Rifrazione',
          nome: 'SR2-1',
          coords: [
            [41.82, 14.96],
            [41.86, 14.99],
            [41.90, 15.03]
          ]
        }
      ]
    },

    lotto3: {
      name: 'Lotto 3',
      color: '#7b1fa2',
      link: 'lotto3.html',
      center: [41.62, 14.12],
      polygon: [
        [41.77, 13.95],
        [41.77, 14.28],
        [41.66, 14.34],
        [41.50, 14.31],
        [41.45, 14.06],
        [41.53, 13.90]
      ],
      summary: {
        comuni: 9,
        indagini: 28,
        avanzamento: '60%'
      },
      available: {
        'Sondaggi': 5,
        'Prospezioni a rifrazione': 4,
        'MASW': 6,
        'Down Hole': 3,
        'HVSR': 5,
        'Altro': 5
      },
      planned: [
        {
          title: 'Monitoraggio integrato di settore',
          note: 'Serie di controlli geofisici e geotecnici nelle aree a maggiore variabilità litostratigrafica.'
        },
        {
          title: 'Prospezioni di dettaglio su area urbana',
          note: 'Campagna a rifrazione con controlli puntuali MASW.'
        },
        {
          title: 'Aggiornamento quadro conoscitivo',
          note: 'Verifica documentale e rilievi speditivi su siti già indagati.'
        }
      ],
      comuni: [
        { name: 'Colli a Volturno', progress: 76, coords: [41.60, 14.10] },
        { name: 'Conca Casale', progress: 58, coords: [41.56, 13.98] },
        { name: 'Filignano', progress: 46, coords: [41.68, 14.05] },
        { name: 'Montaquila', progress: 63, coords: [41.57, 14.11] },
        { name: 'Monteroduni', progress: 69, coords: [41.55, 14.14] },
        { name: 'Pozzilli', progress: 81, coords: [41.52, 14.15] },
        { name: 'Scapoli', progress: 44, coords: [41.61, 14.06] },
        { name: 'Sesto Campano', progress: 57, coords: [41.42, 14.07] },
        { name: 'Venafro', progress: 84, coords: [41.49, 14.05] }
      ],
      indagini: [
        { tipo: 'Sondaggi', nome: 'S3-1', lat: 41.60, lng: 14.10 },
        { tipo: 'Down Hole', nome: 'DH3-1', lat: 41.55, lng: 14.14 },
        { tipo: 'HVSR', nome: 'HVSR3-1', lat: 41.49, lng: 14.05 },
        {
          tipo: 'MASW',
          nome: 'MASW3-1',
          coords: [
            [41.52, 14.08],
            [41.56, 14.12],
            [41.60, 14.16]
          ]
        },
        {
          tipo: 'Rifrazione',
          nome: 'SR3-1',
          coords: [
            [41.46, 14.02],
            [41.50, 14.06],
            [41.54, 14.10]
          ]
        }
      ]
    }
  }
};
