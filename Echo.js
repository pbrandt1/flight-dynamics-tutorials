//
// A little conversion tool for the historical data
//
var mjd0 = 37238
var date0 = new Date('1960-11-01')
var date2mjd = function (d) {
  return mjd0 + (+d - date0) / (24 * 60 * 60 * 1000)
}
var mjd2date = function (mjd) {
  return +date0 + (mjd - mjd0) * 24 * 60 * 60 * 1000
}


//
// Plot the ground track of Echo 1
//
Plotly.d3.csv('/output/Echo-first-orbit.csv', function(err, rows) {
  if (err) {
    document.querySelector('#echo_ground_track').innerHTML = '<pre>data file "/output/Echo-first-orbit.csv" not found</pre>'
  }

  var echo_ground_track = {
    type: 'scattergeo',
    hoverinfo: 'none',
    lon: rows.map(row => parseFloat(row['DefaultSC.Earth.Longitude'])),
    lat: rows.map(row => parseFloat(row['DefaultSC.Earth.Latitude'])),
    mode: 'lines',
    line: {
      width: 2
    }
  }

  //
  // Plotly layout for a movable globe view
  //
  var globe_layout = {
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0
    },
    geo: {
      projection: {
        type: 'orthographic',
        rotation: {
          lon: -100,
          lat: 40
        }
      },
      showocean: true,
      oceancolor: 'rgb(255, 255, 255)', // for more color use 'rgb(0, 255, 255)',
      showland: true,
      landcolor: 'rgb(255, 255, 255)', // for more color use 'rgb(230, 145, 56)',
      showlakes: true,
      lakecolor: 'rgb(255, 255, 255)', // for more color use 'rgb(0, 255, 255)',
      showcountries: true,
      lonaxis: {
        showgrid: true,
        gridcolor: 'rgb(102, 102, 102)'
      },
      lataxis: {
        showgrid: true,
        gridcolor: 'rgb(102, 102, 102)'
      }
    }
  };

  Plotly.plot(document.querySelector("#echo_ground_track"), [echo_ground_track], globe_layout, {showLink: false});
})

//
// Plot the eccentricity
//
Plotly.d3.csv('/output/Echo-150-days.csv', function(err, rows) {
  if (err) {
    document.querySelector('#echo_eccentricity').innerHTML = '<pre>data file "/output/Echo-150-days.csv" not found</pre>'
  }

  var echo_eccentricity = {
    x: rows.map(row => new Date(row['DefaultSC.UTCGregorian'])),
    y: rows.map(row => parseFloat(row['DefaultSC.Earth.ECC'])),
    name: 'eccentricity - GMAT simulation',
    type: 'scatter'
  };

  // Simple smoothing function because the eccentricity has strong cyclic variation
  // over short periods, but we're only interested in the long-term trend
  function smooth(points) {
    var forward_smoothed = [points[0]]
    for (var i = 1; i < points.length - 1; i++) {
      forward_smoothed[i] = (forward_smoothed[i - 1] + points[i + 1]) / 2
    }
    forward_smoothed[points.length - 1] = points[points.length - 1]

    var backward_smoothed = [points[0]]
    backward_smoothed[points.length - 1] = points[points.length - 1]
    for (var i = points.length - 2; i > 0; i--) {
      backward_smoothed[i] = (backward_smoothed[i + 1] + points[i - 1]) / 2
    }

    // return the average of the forward and backward smoothed points
    return backward_smoothed.map((p, i) => (p + forward_smoothed[i]) / 2)
  }

  var smoothed_eccentricity = {
    x: echo_eccentricity.x,
    y: smooth(echo_eccentricity.y),
    name: 'eccentricity - GMAT simulation',
    type: 'scatter'
  }

  var measuredPoints = [
    {"mjd":37159,"e":0.01029,"q":7.898038},
    {"mjd":37169,"e":0.01443,"q":7.865889},
    {"mjd":37179,"e":0.02029,"q":7.817934},
    {"mjd":37189,"e":0.02689,"q":7.763138},
    {"mjd":37199,"e":0.03318,"q":7.71},
    {"mjd":37209,"e":0.03877,"q":7.663189},
    {"mjd":37219,"e":0.04282,"q":7.629019},
    {"mjd":37229,"e":0.04722,"q":7.591145},
    {"mjd":37239,"e":0.05218,"q":7.547844},
    {"mjd":37249,"e":0.05752,"q":7.501487},
    {"mjd":37259,"e":0.06239,"q":7.458014},
    {"mjd":37269,"e":0.06708,"q":7.416509},
    {"mjd":37279,"e":0.0742,"q":7.368322},
    {"mjd":37289,"e":0.07739,"q":7.323543},
    {"mjd":37299,"e":0.07864,"q":7.310673},
    {"mjd":37309,"e":0.07529,"q":7.334491}
  ]

  const measured_eccentricity = {
    x: measuredPoints.map(p => mjd2date(p.mjd)),
    y: measuredPoints.map(p => p.e),
    name: 'eccentricity - observed',
    type: 'scatter'
  }

  var data = [smoothed_eccentricity, measured_eccentricity];

  Plotly.newPlot(document.querySelector('#echo_eccentricity'), data);
});
