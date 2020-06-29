// map object with center at center of US
var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4
});

//  tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// geojson data
var geoData = "static/data/Tribal_Lands.geojson";

var geojson;

// using d3
d3.json(geoData, function(data) {

  // adding choropleth layer
  geojson = L.choropleth(data, {


    // feature property
    valueProperty: "TribalCededLandsTableCessNum",

    // color scale
    scale: ["#33FFFC","#F333FF"],

    // number of breaks in color scale
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
     
      layer.bindPopup("Name of Tribes: " + feature.properties.TribalCededLandsTableSchdTrb + "<br>Year:</br>" + feature.properties.TribalCededLandsTableCessDate1);
    }
  }).addTo(myMap);

  // legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];
    console.log(limits)
    // Add min & max
    var legendInfo = "<h1>Earliest to Latest</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});
