// This was intended as a small script to just update my position
// using the geolocation API. I set aside a couple of hours for it,
// but when that had passed and I was still confused, I dropped the
// ambition of making it work, rather writing a rough sketch of what
// it should look like.

// I would prefer if everything was initialised without global
// variables, but I suppose I can live with this.
var kb = $rdf.graph();

const base_uri = 'https://solid.example.org/position/';

// This is the agent actually doing requests against the remote server.
const agent = new Agent(base_uri);

// It should suffice to name the prefix, which should be looked up in
// a curated set of mappings, or a crowdsources one if it doesn't
// exist there.
var ns = new Namespaces(['geo', 'rdf']);


// This is cutnpaste from MDN Geolocation docs
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


    // We might want to display something like this, but not by sending our coordinates to someone else
    // var img = new Image();
    // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
    // output.appendChild(img);


    // Now, we should build the RDF response. Here I think we should
    // experiment with small trees to see if it can be made more
    // intuitive for people not used to triples. This is just a
    // brainstorm example, we should do a lot of them
    kb.add({
	about:'whereami#latestpos',
	claim: [
	    [ ns.a,           ns.geo('Point') ],
	    [ ns.geo('lat'),  latitude ],
	    [ ns.geo('long'), longitude ]
	]
    });

      
    // There shouldn't be more to it than this. This should figure out
    // the serialization and therefore the content type, that
    // 'replace' means PUT in HTTP context, resolve relative to
    // base_uri, make reasonable default actions with regards to
    // authentication, etc
    const response = agent.replace('whereami', kb);

    // And then handle errors that agent.replace couldn't handle itself based on the response.
      
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
