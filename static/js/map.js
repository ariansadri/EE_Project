var map, infoWindow;
var marker;
var uLat = 29.7604;
var uLng = -95.3698;

function addMarker(location) {
  var our_icon = {
    url: "../static/images/EE_edited.png", // url
    scaledSize: new google.maps.Size(35, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
  };

  return new google.maps.Marker({
    position: location,
    map: map,
    icon: our_icon
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    // center: { lat: 29.7604, lng: -95.3698 },
    center: { lat: uLat, lng: uLng },
    zoom: 14,
    streetViewControl: false
  });
  infoWindow = new google.maps.InfoWindow;

  place = new google.maps.LatLng(uLat, uLng);
  marker = addMarker(place)

  console.log(marker);

  var trafficLayer = new google.maps.TrafficLayer();
  var transitLayer = new google.maps.TransitLayer();
  var bikeLayer = new google.maps.BicyclingLayer();

  d3.select('#traffic-b').on('click', () => {
    trafficLayer.setMap(map);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
  });
  d3.select('#transit-b').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(map);
    bikeLayer.setMap(null);
  });
  d3.select('#bike-b').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(map);
  });
  d3.select('#my-loc').on('click', () => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        marker.setMap(null);
        marker = addMarker(pos)
        map.setCenter(pos);
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  d3.select('#clear').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


function getVals() {
  console.log("Button clicked");

  var AddressEntry = document.getElementById("CenterBox");
  var CenterEntry = document.getElementById("RadiusBox");

  if (AddressEntry.value == null ||
    AddressEntry.value == undefined ||
    AddressEntry.value.length == 0) {
    alert("The Address or City Box is empty.\n" +
      "Please enter a place and thin clock on GO");
    return false;
  }

  var xAddress = document.getElementById("CenterBox").value;
  var xRadius = document.getElementById("RadiusBox").value;

  console.log(xAddress, xRadius);

  //Begin geocoding
  const platform = new H.service.Platform({ apikey: 't5hFrMbJixJv02I9pJWLb5ZdQbkmeiuHf5OpBGSLRdU' });
  searchText = xAddress;
  var thislat;
  var thislng;

  const geocoder = platform.getGeocodingService();
  geocoder.geocode({ searchText }, result => {
    // console.log(result);
    const location = result.Response.View[0].Result[0].Location.DisplayPosition;
    const { Latitude: thislat, Longitude: thislng } = location;

    console.log(thislat, thislng);
    ReinitMap(thislat, thislng);
    if (xRadius !== 0)
      drawCircle(thislat, thislng, xRadius);
  });
};

function drawCircle(xlat, xlng, xradius) {
  console.log(xlat, xlng, xradius);
  var center = new google.maps.LatLng(xlat, xlng);
  var circle = new google.maps.Circle
    ({
      center: center,
      map: map,
      radius: xradius * 1609.34,   //*1609.34,          // IN METERS.
      fillColor: '#FF6600',
      fillOpacity: 0.2,
      strokeColor: "#FFFF",
      strokeWeight: 1         // DON'T SHOW CIRCLE BORDER.
    });
};


function ReinitMap(xLat, xLng) {
  map = new google.maps.Map(document.getElementById('map'), {
    // center: { lat: 29.7604, lng: -95.3698 },
    center: { lat: xLat, lng: xLng },
    zoom: 14,
    streetViewControl: false
  });
  var trafficLayer = new google.maps.TrafficLayer();
  var transitLayer = new google.maps.TransitLayer();
  var bikeLayer = new google.maps.BicyclingLayer();

  d3.select('#traffic-b').on('click', () => {
    trafficLayer.setMap(map);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
  });
  d3.select('#transit-b').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(map);
    bikeLayer.setMap(null);
  });
  d3.select('#bike-b').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(map);
  });
  d3.select('#my-loc').on('click', () => {


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        marker.setMap(null);
        marker = addMarker(pos)
        map.setCenter(pos);
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  d3.select('#clear').on('click', () => {
    trafficLayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
  });
  marker.setMap(null)
  new_place = new google.maps.LatLng(xLat, xLng);
  marker = addMarker(new_place);

}
