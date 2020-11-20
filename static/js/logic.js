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
            weight: .3,
            fillColor: getColor(depth),
            fillOpacity: 1,
            radius: mag * 25000
          }).addTo(myMap);

          var info = L.control();

          info.onAdd = function (myMap) {
              this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
              this.update();
              return this._div;
          };
          
          // method that we will use to update the control based on feature properties passed
          info.update = function (obj) {
              this._div.innerHTML = '<h4>lat</h4>' +  (obj ?
                  '<b>' + lat + '</b><br />' + lat + ' people / mi<sup>2</sup>'
                  : 'Hover over a state');
          };
          
          info.addTo(myMap);
          





    });
    // Create a circle and pass in some initial options
})


function getColor(depth) {
    return depth > 140 ? '#800026' :
           depth > 120  ? '#BD0026' :
           depth > 100  ? '#E31A1C' :
           depth > 80  ? '#FC4E2A' :
           depth > 60   ? '#FD8D3C' :
           depth > 40   ? '#FEB24C' :
           depth > 20   ? '#FED976' :
                      '#FFEDA0';
}

// var info = L.control();

// info.onAdd = function (myMap) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// };

// info.addTo(myMap);










  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mag = [0, 20, 40, 60, 80, 100, 120, 140],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mag.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
              mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);