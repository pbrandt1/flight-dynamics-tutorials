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
    name: 'Oxia Planum',
    description: 'Oxia Planum is a plain located on Mars that has been chosen as a preferred landing location for the ExoMars rover, with an elevation more than 3000 meters below the Martian mean.',
    lat: 18.275,
    lng: 335.368
  },
  {
    name: 'Mawrth Vallis',
    description: 'Mawrth Vallis (Welsh: [maurθ]) (Mawrth means "Mars" in Welsh) is a valley on Mars, located in the Oxia Palus quadrangle at 22.3°N, 343.5°E with an elevation approximately two kilometers below datum. Situated between the southern highlands and northern lowlands, the valley is a channel formed by massive flooding which occurred in Mars’ ancient past.[1] It is an ancient water outflow channel with light-colored clay-rich rocks.',
    lat: 22.3,
    lng: 343.5
  },
  {
    name: 'Curiosity Rover (2013)',
    description: 'Curiosity is a car-sized robotic rover exploring Gale Crater on Mars as part of NASA\'s Mars Science Laboratory mission (MSL).',
    lat: -4.5895,
    lng: 137.4417
  }
]

var roverIcon = L.icon({
    iconUrl: '/css/rover-icon.png',
    iconSize: [20, 20],
    iconAnchor: [10, 17],
    popupAnchor: [0, 0],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

pointsOfInterest.map(p => {
  var text = `<b>${p.name}</b><br>${p.description}`
  L.marker([p.lat, p.lng], {
    title: p.name,
    icon: roverIcon
  }).addTo(mymap).bindPopup(text)

  L.marker([p.lat, p.lng - 360], {
    title: p.name,
    icon: roverIcon
  }).addTo(mymap).bindPopup(text)
})
