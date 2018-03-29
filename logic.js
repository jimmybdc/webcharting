
// Creating map object
var myMap = L.map('map', {
  center: [40.7, -73.95],
  zoom: 4,
});

// Adding tile layer to the map
//L.tileLayer(mapbox).addTo(myMap);
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ").addTo(myMap);


// Assembling API query URL
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';


function chooseColor(mag) {
  if (mag <= 1) return '#b7f34d';
  if (mag <= 2) return '#9fa039';
  if (mag <= 3) return '#dec61e';
  if (mag <= 4) return '#8e5b43';
  if (mag > 4) return '#c11b1b';
}

d3.json(url, function(data) {
  L.geoJson(data, {

    pointToLayer: function (feature, latLng) {

      var popup = "<p>Place: " + feature.properties.place+"<br> Time: " + feature.properties.time + "</p>";
      var pointStyle= {
        radius: feature.properties.mag*3,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      console.log(L.circleMarker(latLng, pointStyle));

      return L.circleMarker(latLng, pointStyle).bindPopup(popup);
    }
  }).addTo(myMap);
});

var url2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
d3.json(url2, function(data) {
  L.geoJson(data,{
    style: function (feature) {
      return {color: '#391421'};
    }

  }).addTo(myMap);
});





var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i]+1) + '"></i> ' +
            grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br><br>' : '+');
    }

    return div;
};

legend.addTo(myMap);