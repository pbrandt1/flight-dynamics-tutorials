var mymap = L.map('coverage-map', {
}).setView([0, 180], 1);
var token = 'pk.eyJ1IjoicGJyYW5kdDEiLCJhIjoiY2lmeDRsY25pM29yaXV1bTAzZXc3cnY3bSJ9.26vjnG9YuDapjlXB8ebHvg' // you can get your own for free at mapbox.com
const mapboxURL = 'https://a.tiles.mapbox.com/v4/matt.72ca085f/{z}/{x}/{y}.png?access_token=' + token
L.tileLayer(mapboxURL, {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    maxZoom: 10,
}).addTo(mymap);

//
// Satellite coverate is 70.59°
// Mars has a radius of 3,390 km
// The arc distance of 70.59/360 * 2 * PI * r
//
const coverageRadius = 70.59 / 360 * 2 * Math.PI * 3390 * 1000 // meters
const coverageZone = L.circle([0, 180], {radius: coverageRadius}).addTo(mymap);
document.querySelector('#lng').innerHTML = 'Longitude: 180'

coverageZone.on({
  mousedown: function () {
    mymap.dragging.disable();
    mymap.on('mousemove', function (e) {
      coverageZone.setLatLng([0, e.latlng.lng])
      document.querySelector('#lng').innerHTML = 'Longitude: ' + e.latlng.lng.toFixed(0)
    })
  }
})

mymap.on('mouseup', function() {
  mymap.dragging.enable()
  mymap.removeEventListener('mousemove')
})

//
// Plot some interesting points
//
const pointsOfInterest = [
  {
    name: 'Elysium Planitia',
    description: 'Elysium Planitia, located in the Elysium and Aeolis quadrangles, is a broad plain that straddles the equator of Mars, centered at 3.0°N 154.7°E. It lies to the south of the volcanic province of Elysium, the second largest volcanic region on the planet, after Tharsis.',
    lat: 4.5,
    lng: 136,
    icon: 'nasa'
  },
  {
    name: 'Oxia Planum',
    description: 'Oxia Planum is a plain located on Mars that has been chosen as a preferred landing location for the ExoMars rover, with an elevation more than 3000 meters below the Martian mean.',
    lat: 18.275,
    lng: 335.368,
    icon: 'esa'
  },
  {
    name: 'Mawrth Vallis',
    description: 'Mawrth Vallis (Welsh: [maurθ]) (Mawrth means "Mars" in Welsh) is a valley on Mars, located in the Oxia Palus quadrangle at 22.3°N, 343.5°E with an elevation approximately two kilometers below datum. Situated between the southern highlands and northern lowlands, the valley is a channel formed by massive flooding which occurred in Mars’ ancient past.[1] It is an ancient water outflow channel with light-colored clay-rich rocks.',
    lat: 22.3,
    lng: 343.5,
    icon: 'esa'
  },
  {
    name: 'Jezero Crater',
    description: 'Jezero is a crater on Mars located at 18.855°N 77.519°E[1] in the Syrtis Major quadrangle. The diameter of the crater is about 49.0 km (30.4 mi). Thought to have once been flooded with water, the crater contains a fan-delta deposit rich in clays.',
    lat: 18.855,
    lng: 77.519,
    icon: 'nasa'
  },
  {
    name: 'NE Syrtis',
    description: 'The landing site is located within the rings of the Early/Middle Noachian Isidis impact basin that excavated and exposed Fe/Mg-clay and pyroxene-rich crust forming a basement unit.',
    lat: 18,
    lng: 77,
    icon: 'nasa'
  },
  {
    name: 'Columbia Hills',
    description: 'The Columbia Hills are a range of low hills inside Gusev crater on Mars. They were observed by the Mars Exploration Rover Spirit when it landed within the crater in 2004. It is a candidate site for the Mars 2020 rover.',
    lat: -15.1942,
    lng: 175.4856,
    icon: 'nasa'
  },
  {
    name: 'Curiosity Rover (2013)',
    description: 'Curiosity is a car-sized robotic rover exploring Gale Crater on Mars as part of NASA\'s Mars Science Laboratory mission (MSL).',
    lat: -4.5895,
    lng: 137.4417,
    icon: 'nasa'
  },
]

const icons = ['nasa', 'esa', 'china', 'india'].reduce((icons, style) => {
  icons[style] = L.icon({
    iconUrl: '/css/map-marker-' + style + '.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [10, 0],
  })
  return icons
}, {})

pointsOfInterest.map(p => {
  var text = `<b>${p.name}</b><br>${p.description}`
  L.marker([p.lat, p.lng], {
    title: p.name,
    icon: icons[p.icon]
  }).addTo(mymap).bindPopup(text)

  L.marker([p.lat, p.lng - 360], {
    title: p.name,
    icon: icons[p.icon]
  }).addTo(mymap).bindPopup(text)
})
