function loadSounds() {
	//door opeing sounds
	var audioDir = "res/audio/";
	Crafty.audio.add({door_open_1 : [audioDir + "doors/door_open_1.ogg"], 
		door_open_2 : [audioDir + "doors/door_open_2.ogg"],
		door_open_3 : [audioDir + "doors/door_open_3.ogg"],
		door_open_4 : [audioDir + "doors/door_open_4.ogg"],
		door_open_5 : [audioDir + "doors/door_open_5.ogg"],
		door_open_6 : [audioDir + "doors/door_open_6.ogg"],
		menu_select : [audioDir + "menu/menu_select.ogg"],
		award_hint : [audioDir + "menu/award_hint.ogg"],
		walking : [audioDir + "player/walking.ogg"],
		music_creepy : [audioDir + "music/362670__osiruswaltz__creepy-background-noise-1-loopable.ogg"]});
}

function setVolume() {
	Crafty.audio.toggleMute()
}

function setMute() {
	Crafty.audio.toggleMute()
}

function playSound(soundId,repeat,volume) {
	if (typeof repeat === 'undefined') { repeat = 1; }
	if (typeof volume === 'undefined') { volume = 1; }
	Crafty.audio.play(soundId,repeat,volume);
}

function playMusic() {
	playSound("music_creepy",-1,".25");
}

function stopMusic() {
	Crafty.audio.stop("music_creepy");
}

