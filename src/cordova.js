//Private
var SERVERNAME = "https://script.google.com/macros/s/AKfycbzQNcmX2CtkkYG8FhywOnNSue3r3zfwqyXlU0taEyO-rQ4NoA/exec";

function onDeviceReady() {
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	setTimeout(function() {	
		popUpCreateStatus({message:"DEBUG INFO: Device Ready, device uuid = " + device.uuid});
	}, 10000);
}

function onPause() {
    //click home button if in game
    if (Crafty.isPaused() === false) {
		Crafty.pause();
		Crafty.audio.pause('music_creepy');
    }
}

function onResume() {
    // Handle the resume event
    if (Crafty.isPaused()) {
    	Crafty.pause();
		Crafty.audio.togglePause('music_creepy');
    }
}
