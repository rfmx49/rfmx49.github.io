function checkEvent(roomsExplored) {
	var eventChance = 100; //1 in 100 or 1 in (100 - rooms explored)
	var deciderSecret = Math.floor(roomRandom() * (eventChance - roomsExplored));
	var deciderEvent = Math.floor(roomRandom() * (eventChance*2));
	if (deciderSecret <= 0) {
		getSecretEvent();
	}
	if (deciderEvent < roomsExplored) {
		getEvent();
	}
}

function getSecretEvent() {
	console.log('place secret obj.');
}

function getEvent() {
	console.log('Do event.');
}

function testCheckEvent(times) {
	for (var i = 0;i < times;i++) {
		checkEvent(i);
	}
}

function theDarknessInit() {
	Crafty.e('darkness, 2D,' + renderEngine + ', Color, Tween').attr({x: -10-Crafty.viewport.x, y: -10-Crafty.viewport.y, w: 10+Crafty.viewport.width, h: 10+Crafty.viewport.height, alpha: 0,z: 1000}).color('#000000')
}

function theDarkness() {
	/*//will get darker as play goes further from center room. based on x/y values
	var currentRoomPos = rooms[currentRoom].pos;
	var distance = pythagorean(currentRoomPos.x, currentRoomPos.y);*/
	//will get darker as number of turns increase
	var darknessLevel = ((userPlayer.turns-1)*userPlayer.turns^1.025)/1750;
	if (darknessLevel > .75) { 
		darknessLevel=Math.random() * (.8 - .25) + .25;
	}
	Crafty('darkness').alpha=darknessLevel;	
}
