//Create map object
var earthquakeMap = L.map("map", {
  center: [38.7649, -121.4184],
  zoom: 5,
});

//Add tile layers
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Map</a></strong>",
  tileSize: 400,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox.satellite",
  accessToken: API_KEY
});
// }).addTo(earthquakeMap);

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

//Define the base maps
var baseMaps = {
  Light: light,
  Satellite: satellite,
  
};

L.control.layers(baseMaps).addTo(earthquakeMap);

//Create circles and perform a GET request to the query URL

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", function (data) {
  var earthquakeData = (data.features);
  console.log(earthquakeData);


  for (var i = 0; i < earthquakeData.length; i++) {
    var magnitude = earthquakeData[i].properties.mag;
    var color = "";
    if (magnitude > 4) {
      color = "#ffcc33";
    }
    else if (magnitude > 5) {
      color = "#d4ee00"
    }
    else if (magnitude > 4) {
      color = "#f47136"
    }
    else if (magnitude > 3) {
      color = "#fc8c34"
    }
    else if (magnitude > 2) {
      color = "#fab009";
    }
    // else {
    //     color = "#ffcc00"
    // }

    var latitude = earthquakeData[i].geometry.coordinates[1];
    var longitude = earthquakeData[i].geometry.coordinates[0];

    var location = (`${latitude}, ${longitude}`);
    console.log(location);
    var url = earthquakeData[i].properties.url;
    var urlLink = (`<a target='_blank' href="${url}"> Click here for more Info</a>`)
    console.log(urlLink);

    L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
      fillOpacity: 0.5,
      color: "white",
      stroke: true,
      weight: 1,
      fillColor: color,
      radius: magnitude * 10000 
    }).bindPopup("<h1>Magnitude: " + magnitude + "</h1><hr><h3>Location: " + earthquakeData[i].properties.place + "<br>" + urlLink).addTo(earthquakeMap);

  };
});

// Lastly create the legend and add it to the map

var legend = L.control({ position: "topright" });

legend.onAdd = function (earthquakeMap) {
  var div = L.DomUtil.create("div", "info legend");
  var magnitudes = [0, 1, 2, 3, 4, 5];
  var colors = [
    "#ffcc33",
    "#d4ee00",
    "#f4713",
    "#fc8c34",
    "#ea822c",
    "#fab009"
  ];
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }

  return div;
};
//Add to the map 

legend.addTo(earthquakeMap); 