var myMap = L.map("map", {
    center: [0, -40],
    zoom: 2
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

var url ='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson'
d3.json(url, jsonData => {
    data = jsonData.features;

    data.forEach(obj => {
        var lat = obj.geometry.coordinates[1];
        var lng = obj.geometry.coordinates[0];
        var depth = obj.geometry.coordinates[2];
        var mag = obj.properties.mag;
        var place = obj.properties.place;


        L.circle([lat, lng], {
            color: 'black',
            fillColor: getColor(depth),
            fillOpacity: 1,
            radius: mag * 25000
          }).addTo(myMap);
    });
    // Create a circle and pass in some initial options
})

function getColor(depth) {
    switch (true) {
        case depth > 60:
            return 'red';
        case depth > 30:
            return 'yellow';
        case depth < 31:
            return 'green';
    
        default:
            break;
    }
}

  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 20, 50, 100, 200, 500, 1000],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(map);