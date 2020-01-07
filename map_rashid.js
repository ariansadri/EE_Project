var map, infoWindow; 
var marker; 
var circle;
var FullAddress;
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

function FindAddress(alat, alng)
{
  console.log("from FindAddress", alat, alng);
  //var lat = parseFloat(document.getElementById("txtLatitude").value);
  //var lng = parseFloat(document.getElementById("txtLongitude").value);
  var latlng = new google.maps.LatLng(alat, alng);
  var geocoder = geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                alert("Location: " + results[1].formatted_address);
                document.getElementById("CenterBox").value = results[1].formatted_address;
            }
        }
    });
};


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
  console.log("My Location Clicked");
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
        drawCircle(pos.lat, pos.lng, "1", "my-loc2");
        FullAddress=FindAddress(pos.lat, pos.lng);
      }, function () { 
        handleLocationError(true, infoWindow, map.getCenter()); 
      }); 
    } else { 
      // Browser doesn't support Geolocation 
     handleLocationError(false, infoWindow, map.getCenter()); 
    } 
  }); 

  d3.select('#clear').on('click', () => { 
    console.log("clear Button Clicked");
    trafficLayer.setMap(null); 
    transitLayer.setMap(null); 
    bikeLayer.setMap(null); 
    circle.setMap(null);
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
  console.log("getVals Button clicked ", uLat, uLng); 
 
  var noAddress=true;
  var noRadius=true;

  var AddressEntry = document.getElementById("CenterBox"); 
  var CenterEntry = document.getElementById("RadiusBox"); 
  var okayAddress = false;
  var okayRadius = false;
 
  if (AddressEntry.value == null || 
    AddressEntry.value == undefined || 
    AddressEntry.value.length == 0) 
  { 
    alert("The Address or City Box is empty.\n" + 
      "Please enter a place and then click on GO."); 
  } 
  else
  { okayAddress=true}

  if (CenterEntry.value == null || 
    CenterEntry.value == undefined || 
    CenterEntry.value.length == 0) 
  { okayRadius=false} 
  else
  { okayRadius=true}
 
  var xAddress = document.getElementById("CenterBox").value; 
  var xRadius = document.getElementById("RadiusBox").value; 
 
  console.log("Before okayAddress: ", xAddress, xRadius, okayAddress, okayRadius); 
 
  if (okayAddress)
  {
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
      uLat=thislat;
      uLng=thislng;
      console.log("Within okayAddress: ", thislat, thislng, uLat, uLng); 
      ReinitMap(thislat, thislng);
      if (xRadius !== 0) drawCircle(uLat, uLng, xRadius, "ID-1");
    }); 
  }
 
  if (okayRadius) 
  {
    console.log("Radius: ", uLat, uLng, xRadius); 
    if (xRadius !== 0) drawCircle(uLat, uLng, xRadius, "ID-2"); 
  }
}; 
 
function drawCircle(xlat, xlng, xradius, xfrom) { 
  console.log("from drawCircle ", xlat, xlng, xradius, xfrom); 
  var center = new google.maps.LatLng(xlat, xlng); 
  circle = new google.maps.Circle 
    ({ 
      center: center, 
      map: map, 
      radius: xradius * 1609.34,   //*1609.34,          // IN METERS. 
      fillColor: '#FF6600', 
      fillOpacity: 0.2, 
      strokeColor: "#FFFF", 
      strokeWeight: 1         // DON'T SHOW CIRCLE BORDER. 
    }); 
    pois(xlat, xlng, xradius);

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
    drawCircle(uLat,uLng,0, "ID-3");
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
        drawCircle(pos.lat, pos.lng, "1", "my-loc");
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
    circle.setMap(null);
  }); 
  marker.setMap(null) 
  new_place = new google.maps.LatLng(xLat, xLng); 
  marker = addMarker(new_place); 
 
} 

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function pois(tlat, tlng, tradius)
{
  console.log("At pois: ", tlat, tlng, tradius);
  
//   $(document).ready(function(){
//     // type_holder
//     // <div><label><input type="checkbox" class="types" value="mosque" />Mosque</label></div>

//     var types=['airport', 'atm', 'bakery', 'bank', 'bar', 'church', 'dentist', 'doctor', 'florist', 'gas_station', 'hospital', 'pharmacy', 'school', 'shopping_mall']
//     var html = '';

//     $.each(types, function( index, value ) {
//         var name = value.replace(/_/g, " ");
//         html += '<div><label><input type="checkbox" class="types" value="'+ value +'" />'+ capitalizeFirstLetter(name) +'</label></div>';
//     });

//     $('#type_holder').html(html);
// });

function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1);}

var map;
var infowindow;
var autocomplete;
var countryRestrict = {'country': 'in'};
var types=['airport', 'atm', 'bakery', 'bank', 'bar', 'church', 'dentist', 'doctor', 'florist', 'gas_station', 'hospital', 'pharmacy', 'school', 'shopping_mall']
var selectedTypes = [];

// function initialize()
// {
//     autocomplete = new google.maps.places.Autocomplete((document.getElementById('address')), {
//         types: ['(regions)'],
//        // componentRestrictions: countryRestrict
//     });

    var pyrmont = new google.maps.LatLng(29.63297, -95.60067);    //29.63297 -95.60067

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 12
    });
// }

// function renderMap()
// {
//     // Get the user defined values
//     var address = document.getElementById('address').value;
//     var radius  = parseInt(document.getElementById('radius').value) * 1609.34;
    
//     // get the selected type
//     selectedTypes = [];
//     $('.types').each(function(){
//         if($(this).is(':checked'))
//         {
//             selectedTypes.push($(this).val());
//         }
//     });

    var geocoder    = new google.maps.Geocoder();
    var selLocLat   = 0;
    var selLocLng   = 0;

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK')
        {
            //console.log(results[0].geometry.location.lat() + ' - ' + results[0].geometry.location.lng());

            selLocLat   = results[0].geometry.location.lat();
            selLocLng   = results[0].geometry.location.lng();

            //var pyrmont = new google.maps.LatLng(52.5666644, 4.7333304);

            var pyrmont = new google.maps.LatLng(selLocLat, selLocLng);

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 11
            });

            //console.log(selectedTypes);

            var request = {
                location: pyrmont,
                //radius: 5000,
                //types: ["atm"]
                radius: radius,
                types: selectedTypes
            };

            infowindow = new google.maps.InfoWindow();

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }
        else
        {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function callback(results, status)
{
    if (status == google.maps.places.PlacesServiceStatus.OK)
    {
        for (var i = 0; i < results.length; i++)
        {
            createMarker(results[i], results[i].icon);
        }
    }
}

function createMarker(place, icon) {
    var placeLoc = place.geometry.location;

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: icon,
            scaledSize: new google.maps.Size(20, 20) // pixels
        },
        animation: google.maps.Animation.DROP
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name+ '<br>' +place.vicinity);
        infowindow.open(map, this);
    });
}
