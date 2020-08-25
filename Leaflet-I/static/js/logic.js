// Creating map object
var myMap = L.map("map", {
    center: [37.8, -96],
    zoom: 3
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
//Data
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  var geojson;

  function getColor(d) {
    return d > 5 ? '#d73027' :
           d > 4  ? '#fc8d59' :
           d > 3  ? '#fee08b' :
           d > 2  ? '#d9ef8b' :
           d > 1   ? '#91cf60' :
                      '#1a9850';
};


//uploading info and create graph
d3.json(link, function(data) {
    L.geoJson(data,{
        pointToLayer: function(features,latlng){
            return L.circle(latlng,{
              radius: features.properties.mag *20000 + 10000 ,
              color: getColor(features.properties.mag),
              fillColor: getColor(features.properties.mag)
            });
        },
        onEachFeature:function(features,layer){
        layer.bindPopup(`Place:${features.properties.place}<br>Details:${features.properties.details}
                        <br>Magnitud:${features.properties.mag}<br>Type:${features.properties.type}`);
      }
    }).addTo(myMap)

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
  legend.addTo(myMap);

});
