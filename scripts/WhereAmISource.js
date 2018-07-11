
var kb = $rdf.graph();
var fetcher = new $rdf.Fetcher(kb); // store, timeout)

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    // var img = new Image();
    // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    // output.appendChild(img);

    var options = { 
	body: '@prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> .\n\n<#posnow> a geo:Point ;\n\tgeo:long ' + longitude + ' ;\n\tgeo:lat ' + latitude +' .\n',
	contentType: 'text/turtle'

    }; 
    fetcher.webOperation('PUT', './whereami.ttl', options);
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
