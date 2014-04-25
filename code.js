// Object containing destinations with their latitude and longitude
var dests = {};
dests['Lassonde Building'] = {lat: "43.773943", lon: "-79.505269"}; 
dests['Scott Library'] = {lat: "43.772391", lon: "-79.505533"}; 
dests['Curtis Lecture Hall'] = {lat: "43.773162", lon: "-79.505232"}; 
dests['Student Centre'] = {lat: "43.77389", lon: "-79.50294"}; 
dests['Vari Hall'] = {lat: "43.772757", lon: "-79.503423"}; 
dests['Steacie Science and Engineering Library'] = {lat: "43.773753", lon: "-79.505993"}; 
dests['Technology Enhanced Learning'] = {lat: "43.771291", lon: "-79.500694"}; 
dests['Accolade East Bldg'] = {lat: "43.772959", lon: "-79.500077"};
dests['Central Square'] = {lat: "43.772868", lon: "-79.504677"};
dests['Chemistry Bldg'] = {lat: "43.773354", lon: "-79.507791"};
dests['Petrie Science and Engineering Bldg'] = {lat: "43.773567", lon: "-79.506970"};
dests['Health Nursing and Environmental '] = {lat: "43.771224", lon: "-79.504984"};
dests['Osgoode Hall Law school'] = {lat: "43.770610", lon: "-79.504524"};
dests['Life Science Bldg'] = {lat: "43.774255", lon: "-79.508318"};
dests['York Lanes'] = {lat: "43.774545", lon: "-79.501520"};
dests['Schulic School of Business'] = {lat: "43.773519", lon: "-79.498866"};
dests['Ross Building'] = {lat: "43.773157", lon: "-79.504319"};
dests['Tait McKenzie'] = {lat: "43.774856", lon: "-79.507959"};
dests['Stedman Lecture Halls'] = {lat: "43.774327", lon: "-79.503312"};
dests['Seneca@York'] = {lat: "43.771865", lon: "-79.499211"};
dests['William Small Centre'] = {lat: "43.772999", lon: "-79.507622"};
dests['Winter College'] = {lat: "43.776519", lon: "-79.501977"};
dests['Stong College'] = {lat: "43.772434", lon: "-79.508190"};
dests['Tennis Canada'] = {lat: "43.771894", lon: "-79.511575"};
dests['Mclaughlin College'] = {lat: "43.776810", lon: "-79.502482"};
dests['Norman Bethune College'] = {lat: "43.773000", lon: "-79.509081"};




// Wait for phonegap to load.
document.addEventListener("deviceready", onDeviceReady, false);

// Phonegap is ready.
function onDeviceReady() {}


// Function to populate destinations list.
function populateDests()
{
	for (var key in dests) {
		if (key === 'length' || !dests.hasOwnProperty(key)) continue;
		$("#destinations").append('<li><a href="#" onClick="findDest(\'' + key + '\',' + dests[key].lat + ',' + dests[key].lon + ')";>' + key + '</a></li>');
	}
}
navigator.geolocation.getCurrentPosition (function (pos)
{
  var lat = pos.coords.latitude;
  var lng = pos.coords.longitude;
  $("#lat").text (lat);
  $("#lng").text (lng);
});

// Global variables.
var destinationPosition;
var destinationBearing;
var positionId;
var headingId;
var currentPosition;
var currentHeading;

// Function to start tracking position and compass when user selects a destination.
function findDest(destination, lat, lon)
{
	$('#destinationText').html(destination);
	
	$('#navView').show();
	$('#mainView').hide();
	
    watchPosition();            
	watchHeading();

	destinationPosition = new LatLon(lat, lon);
    updateScreen();
}

// Switches from navigation screen to main screen and disables compass and GPS tracking.
function switchView(){
	$('#navView').hide();
	$('#mainView').show();
	
	if(positionId) navigator.geolocation.clearWatch(positionId);
	if(headingId) navigator.compass.clearWatch(headingId);
}

// Function for position tracking.
function watchPosition(){
    if(positionId) navigator.geolocation.clearWatch(positionId); 
    positionId = navigator.geolocation.watchPosition(onPositionUpdate, onError, {
        enableHighAccuracy: true,
        timeout: 1000,
        maxiumumAge: 0
    });
}

// Function for compass tracking.
function watchHeading(){
    if(headingId) navigator.compass.clearWatch(headingId);
    headingId = navigator.compass.watchHeading(onCompassUpdate, onError, {
        frequency: 100 
    });
}

// Event handler for position change.
function onPositionUpdate(position){
    currentPosition = new LatLon(position.coords.latitude, position.coords.longitude);
    updateScreen();
}

// Event handler for compass change.
function onCompassUpdate(heading){
    currentHeading = heading.trueHeading >= 0 ? Math.round(heading.trueHeading) : Math.round(heading.magneticHeading);
	updateScreen();
}

// Function to update information on navigation screen.
function updateScreen(){
	destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition)); 
	$('#distance').html(Math.round(currentPosition.distanceTo(destinationPosition)*1000) + " Meters");
	
    var degreesOfDiff = destinationBearing - currentHeading; // The difference between destination bearing and current heading is the direction of the arrow.
    
    $('#arrow').css("-webkit-transform", "rotate(" + degreesOfDiff + "deg)");         
}

// Error handler function.
function onError()
{
	console.log('Error');
}
