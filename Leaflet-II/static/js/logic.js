
  // Adding tile layer
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });
  
  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });
  
//Data
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  var link2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


  function getColor(d) {
    return d > 5 ? '#d73027' :
           d > 4  ? '#fc8d59' :
           d > 3  ? '#fee08b' :
           d > 2  ? '#d9ef8b' :
           d > 1   ? '#91cf60' :
                      '#1a9850';
};

var earthquakes = L.layerGroup();
//uploading info and create graph
d3.json(link, function(data) {
    L.geoJson(data,{
      pointToLayer: function(features,latlng){
          return L.circle(latlng,{
            radius: features.properties.mag *20000 + 10000 ,
            color: getColor(features.properties.mag),
            fillColor: getColor(features.properties.mag),
            fillOpacity:1
          });
      },
      onEachFeature:function(features,layer){
        layer.bindPopup(`Place:${features.properties.place}<br>Details:${features.properties.details}
                      <br>Magnitud:${features.properties.mag}<br>Type:${features.properties.type}`);
        earthquakes.addLayer(layer);
      }
    }
  )
});

//Set Legend
var legend = L.control({position: "bottomright"});
legend.onAdd = function(){
  var div = L.DomUtil.create("div","info legend");
  var limits = ["0-1","1-2","2-3","3-4","4-5","+5"];
  var colors = ['#1a9850','#91cf60','#d9ef8b','#fee08b','#fc8d59','#d73027'];

for (var i = 0; i < limits.length; i++) {
  div.innerHTML +=
      '<i style="background:' + colors[i]+ '"></i> ' + limits[i]+ '<br>'};

return div;
};




// console.log(earthquake)
// var earthquakes = L.layerGroup(earthquake);

var faultLine = []

var myStyle = {
  "color":"#fc8d59"
}

var faultLines = L.layerGroup()
d3.json(link2, function(data) {
  L.geoJson(data,{
    style: myStyle,
    onEachFeature:function(features,layer){
      faultLines.addLayer(layer);
    }
  });
});

// var faultLines = L.layerGroup(faultLine);

// Create a baseMaps object to contain the streetmap and darkmap
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayscale,
  Outdoors: outdoors
};

// Create an overlayMaps object here to contain the "State Population" and "City Population" layers

var overlayMaps = {
  Earthquakes: earthquakes,
  FaultLines: faultLines
};

// Modify the map so that it will have the streetmap, states, and cities layers
var myMap = L.map("map", {
  center: [
      37.09, -95.71
  ],
  zoom: 3,
  layers: [satellite, earthquakes, faultLines]
});

// Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
legend.addTo(myMap)


