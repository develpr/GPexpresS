$(function(){
	if(false)
	{
		chrome.browserAction.setIcon({path:'img/icon_yes.png'});
	}

	app.run();
	
});

window.app = {};

app.getClipboard = function(){
	var sandbox = $('#holding');
	var result = false;
 	sandbox.val('');
	sandbox.select();
	if (document.execCommand('paste')) {
		result = sandbox.val();
		sandbox.val('');
	}
	
	return result;

}

app.convertToGps = function ( originalCoordinates ){

	gpsCoords = {};

	gpsCoords.latitude = app.decimalToGps(originalCoordinates.latitude, true);

	gpsCoords.longitude = app.decimalToGps(originalCoordinates.longitude, false);
	
	
	return gpsCoords;
	
};

app.decimalToGps = function(toConvert, latitude){

	var convertedParts = {};	
	var scaler = 1;

	//figure out cardinality first
	//todo: put this in a decision or figure something fancier out?
	if(toConvert < 0 && latitude == true)
		convertedParts.cardinal = 'S';
	else if(toConvert >= 0 && latitude == true)
		convertedParts.cardinal = 'N';
	else if(toConvert < 0 && latitude == false)
		convertedParts.cardinal = 'W';
	else
		convertedParts.cardinal = 'E';

	//Converting to a positive number for maths stupidity
	toConvert = Math.abs(toConvert);

	convertedParts.degrees = Math.floor(toConvert);
	
	var minutesAndSeconds = toConvert - convertedParts.degrees;
	minutesAndSeconds = minutesAndSeconds * 60;
	
	convertedParts.minutes = Math.floor(minutesAndSeconds);

	var seconds = minutesAndSeconds - convertedParts.minutes;
	seconds = Math.round(seconds * 1000);

	convertedParts.seconds = seconds;

	//add the negative back on
	convertedParts.degrees = convertedParts.degrees;

	return convertedParts;
		

};

app.displayConverted = function(decimalCoords, gpsCoords){
	$('#active-display').show();
	$('#non-active-display').hide();

	//display the original coordinates
	$('#latitude .original').html(decimalCoords.latitude);
	$('#longitude .original').html(decimalCoords.longitude);

	$('#latitude .converted .cardinal').html(gpsCoords.latitude.cardinal);
	$('#latitude .converted .degrees').html(gpsCoords.latitude.degrees);
	$('#latitude .converted .minutes').html(gpsCoords.latitude.minutes);
	$('#latitude .converted .seconds').html(gpsCoords.latitude.seconds);


	$('#longitude .converted .cardinal').html(gpsCoords.longitude.cardinal);
	$('#longitude .converted .degrees').html(gpsCoords.longitude.degrees);
	$('#longitude .converted .minutes').html(gpsCoords.longitude.minutes);
	$('#longitude .converted .seconds').html(gpsCoords.longitude.seconds);

}


app.run = function(){
	var decimalCoords = {latitude: 37.399876, longitude:-5.990226};
	var clipboard = app.getClipboard();
	clipboard = clipboard.split(',');
	
	if(clipboard.length != 2)
		alert("nothing to do");

	decimalCoords.latitude = clipboard[0].trim();		
	decimalCoords.longitude = clipboard[1].trim();		

	var gpsCoords = app.convertToGps(decimalCoords);
	console.log(gpsCoords);
	app.displayConverted(decimalCoords, gpsCoords);
};
