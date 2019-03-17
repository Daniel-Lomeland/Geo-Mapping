//USGS API call to get earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function (earthquakeData) {
  createFeatures(earthquakeData.features);
});

// Magnitude 
function markerSize(magnitude) {
  return magnitude * 20000;
};

// Color Function for Magnitude

function getColor(m) {

  var colors = ['lightgreen', 'yellowgreen', 'gold', 'orange', 'pink', 'red'];

  return m > 5 ? colors[5] :
    m > 3.5 ? colors[4] :
      m > 2.5 ? colors[3] :
        m > 2 ? colors[2] :
          m > 1 ? colors[1] :
            colors[0];
};

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {

    // Each feature a popup information pertinent to it
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3 > Magnitude: " + feature.properties.mag +
        "</h3><h3>Location: " + feature.properties.place +
        "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>");
    },

    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {
          radius: markerSize(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .5,
          color: 'black',
          weight: .5
        })
    }
  });

  createMap(earthquakes);
};
//_____________________________________________________________________________________________________________
function createMap(earthquakes) {

  let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';

  let accessToken = API_KEY

   // create lightmap
  let lightmap = L.tileLayer(mapboxUrl, { id: 'mapbox.light', maxZoom: 20, accessToken: accessToken });

  // BaseMaps object layer
  var baseMaps = {
    "Grayscle": lightmap,
  };

  // Overlay object layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Set Default location, Create lightmap and earthquakes layers
  var myMap = L.map("map", {
    center: [39, -98],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });
//_____________________________________________________________________________________________________________
  // Place legend information in the right bottom 
  var legend = L.control({ position: 'bottomright' });

  // Create legend 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitudes[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
  } 
  return div;
  }; 
  legend.addTo(myMap);
}