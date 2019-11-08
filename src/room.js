function generateRoom() {
	originDoors = [];
	objectMap = [[]];
	floorMap = null;
	//console.log("clear")
	Crafty('FloorGround').destroy();
	var firstRoom = false;
	if ((typeof (Crafty('PlayerCharacter')[0]) != "undefined")) { 
		Crafty(Crafty('PlayerCharacter')[0]).destroy();
	}
	var existingRoom = checkRoom(userPlayer.pos.x,userPlayer.pos.y,userPlayer.pos.z);
	////console.log("EXISTING room STATUS == " + existingRoom + " " + (existingRoom == false) + (typeof existingRoom =="boolean"));
	if (originDoorSuccess) {
		//this is not a recreation of a room
		lastRoom = currentRoom; 
		userPlayer.scoreVisible ++;
	}
	else {
		if (deleteRoom){
			//this is a recreated room remove room from array
			//check first if this room has other doors though.
			if (rooms[currentRoom].doors.length == 0){
				rooms.splice(currentRoom,1);
			}
			userPlayer.score.actual --;
		}
	}
	if (existingRoom === false) {
		userPlayer.score.actual ++;
		roomRandom = new Math.seedrandom(gameSeed + " . " + userPlayer.pos.x + "." + userPlayer.pos.y + "." + userPlayer.pos.z);
		//push new room to room list
		rooms['x' + userPlayer.pos.x + 'y' + userPlayer.pos.y + 'z' + userPlayer.pos.z] = new Room(userPlayer.pos.x, userPlayer.pos.y, userPlayer.pos.z)
		currentRoom = 'x' + userPlayer.pos.x + 'y' + userPlayer.pos.y + 'z' + userPlayer.pos.z
		var floorWidth = Math.floor(roomRandom() * (maxWidth-2)) + 1;
		var floorHeight = Math.floor(roomRandom() * (maxHeight-2)) + 1;
		var decider = Math.floor(roomRandom() * 2) + 1;
		floorMap = [];
		objectMap = [[]];
		floorMap[0] = [];
		if (decider == 2){
			if (floorWidth > 1 && floorHeight > 1) {
				//decide wether to take out corner or put in wall.
				//or is a wall even possible.
				//decider = Math.floor(Math.random() * 2) + 1;
				//if (decider == 1 || ((floorWidth <= 2) || (floorHeight <= 2))){
				if (1 == 1) {
					//make corner
					//pick a wall top/right/left/bottom
					//pick sizes
					/*
					var wallDecided = Math.floor(Math.random() * 4) + 1;

					var cornerWidth = Math.floor(Math.random() * (floorWidth-1)) + 1;
					var cornerHeight = Math.floor(Math.random() * (floorHeight-1)) + 1;
					*/
					var wallDecided = Math.floor(roomRandom() * 4) + 1;
					var cornerWidth = Math.floor(roomRandom() * (floorWidth-1)) + 1;
					var cornerHeight = Math.floor(roomRandom() * (floorHeight-1)) + 1;
					//console.log("Make room W:" + floorWidth + " H: " + floorHeight + " With corner OnWall: " + wallDecided + "  Dimensions W:" + cornerWidth + " H:" +cornerHeight);
					//drawmap
					for (var row = 1; row <= floorHeight; row++) {
						floorMap[row] = [];
						for (var col = 1; col <= floorWidth; col++) {
							floorMap[row][col] = "f";
							switch (wallDecided) {
								 case 1:
								 	//top right
								 	if ((cornerHeight-row) > (-1)) {
										//corner is on this row but also this coloumn?
										if ((col+cornerWidth) > floorWidth) {
											//yes this tile is part of the corner chunk.
											floorMap[row][col] = null;
										}
									}
								    break;
								 case 2:
								 	//bot right
								 	if ((row+cornerHeight) > floorHeight) {
										//corner is on this row but also this coloumn?
										if ((col+cornerWidth) > floorWidth) {
											//yes this tile is part of the corner chunk.
											floorMap[row][col] = null;
										}
									}
								    break;
								 case 3:
								 	//bot left
								 	if ((row+cornerHeight) > floorHeight) {
										//corner is on this row but also this coloumn?
										if ((cornerWidth-col) > (-1)) {
											//yes this tile is part of the corner chunk.
											floorMap[row][col] = null;
										}
									}
								    break;
								 case 4:
								 	//top left
								 	if ((cornerHeight-row) > (-1)) {
										//corner is on this row but also this coloumn?
										if ((cornerWidth-col) > (-1)) {
											//yes this tile is part of the corner chunk.
											floorMap[row][col] = null;
										}
									}
								    break;
	 						}
						}
					}
				}
				else {
					//console.log("make room with divider wall");
					//make wall
					//pick a wall top/right/left/bottom
					//pick sizes
				}
			}
			else {
				//console.log('narrow room ' + floorWidth + 'x' + floorHeight);
				for (var row = 1; row <= floorHeight; row++) {
					floorMap[row] = [];
					for (var col = 1; col <= floorWidth; col++) {
						floorMap[row][col] = "f";
					}
				}
			}
		}
		else {
			//square Room
			//console.log("Make room W:" + floorWidth + " H: " + floorHeight);
			for (var row = 1; row <= floorHeight; row++) {
				floorMap[row] = []
				for (var col = 1; col <= floorWidth; col++) {
					floorMap[row][col] = "f"
				}
			}
		}
		////console.log("Fill blanks");
		floorMap[floorHeight+1] = []
		for (var row = 0; row <= floorHeight+1; row++) {
			for (var col = 0; col <= floorWidth+1; col++) {
				if (floorMap[row][col] != "f") {
					floorMap[row][col] = "x"
				}
			}
		}
		fillWalls();
		//get floor style
		var floorStyle = new Math.seedrandom(gameSeed + " . " + userPlayer.pos.x + "." + userPlayer.pos.y + "." + userPlayer.pos.z + "floor");
		var decider = Math.floor(floorStyle() * numOfFloorStyles) + 1; //number of floor Styles
		rooms[currentRoom].floorStyle = decider;
		//get room center
		roomCenter.y = (Math.floor(floorMap.length/2));
		roomCenter.x = (Math.floor(floorMap[0].length/2));
		drawRoom();
		//set floorMap in rooms aray
		rooms[currentRoom].map = floorMap;
	}
	else { 
		console.log("this room has already been generated: " + existingRoom);
		currentRoom = existingRoom;
		floorMap = rooms[currentRoom].map;
		//convert o's to F's
		var rows = floorMap.length;
		var cols;
		var variant;
		//fix centering
	
		for (var row = 0; row < rows; row++) {
			cols = floorMap[row].length;
			for (var col = 0; col < cols; col++) {
				if (floorMap[row][col] == "o") {
					floorMap[row][col] = "f";
				}
			}
		}
		roomCenter.y = (Math.floor(floorMap.length/2));
		roomCenter.x = (Math.floor(floorMap[0].length/2));
		drawRoom();
	}
	var doorsValid = locateOriginDoor();
	var doorZero = getAllDoors()[0];
	if ((firstRun && typeof doorZero === 'undefined')) {
		//this seed has no doors on first room.
		gameSeed = gameSeed + "x";
		userPlayer = new playerObj;
		rooms = [];
		Crafty.scene("Game");
		return false;	
	}
	else {
		if (doorsValid) {
			//create player on room
			createPlayerEnt();
			if (firstRun == false) {
				playerEnterRoom();
			}
		}
		centerRoom();
		return floorMap;
	}
}

function centerRoom(){
	if (floorMap[0].length % 2 === 0) {
		Crafty('FloorGround').x = centerPoint._x;//+ (_tileSize/2); // This will center the room but movement is then broken :(
	}
	else {
		Crafty('FloorGround').x = centerPoint._x
	}
	Crafty('FloorGround').y = centerPoint._y
}

function setDoor(tileX, tileY){
	var createdDoor = rooms[currentRoom].doors.push(new Door(lastPos.x,lastPos.y,lastPos.z,tileX,tileY,rooms[lastRoom].doors[lastDoor].style));
	//set door style to previous door and update floormap

	var offsetDoor = Crafty('Tile' + tileY + '_' + tileX).offset;
	var tileRotation = Crafty('Tile' + tileY + '_' + tileX).rotation;
	Crafty('Tile' + tileY + '_' + tileX).destroy();
	
	//Door creation
	style = floorMap[tileY][tileX].substring(3,2)
	Crafty.e('Tile' + tileY + '_' + tileX +', floorMap, doorSprite' + rooms[lastRoom].doors[lastDoor].style + '_reel, wallDoorAnimate')
		.attr({y: tileY*_tileSize, x: tileX*_tileSize, w: _tileSize, h: _tileSize, xTile: tileX, yTile: tileY});

	Crafty(Crafty('FloorGround')[0]).attach(Crafty('Tile' + tileY + '_' + tileX));
	Crafty('Tile' + tileY + '_' + tileX).origin("center");
	Crafty('Tile' + tileY + '_' + tileX).offset = offsetDoor;
	Crafty('Tile' + tileY + '_' + tileX).rotation = tileRotation;
	//get door colour floorMap[row][col].substring(3,2)
	floorMap[tileY][tileX] = "d" + floorMap[tileY][tileX].substring(2,1) + rooms[lastRoom].doors[lastDoor].style;
	rooms[lastRoom].maps = floorMap;	
	rooms[currentRoom].doors[createdDoor - 1].toRoomPos = new Position(rooms[lastRoom].doors[lastDoor].roomPos.x,rooms[lastRoom].doors[lastDoor].roomPos.y,0);
	//also set this matching doors destination door info.
	rooms[lastRoom].doors[lastDoor].toRoomPos = new Position(tileX,tileY,0);
}

function positionPlayer(x,y) {
	playerRoomPos = new Position(x,y,0)
}

function locateOriginDoor() {
	//need to check originDoors array and remove any that are already used for passage to other rooms. 
	//Major issue will be if there is alrady a door to this room but then a new way is added but there is no room for it
	//filter origin doors if origin doors are already taken do reassign them.
	//check if this is the first room.
	console.log(originDoors);
	deleteRoom = false
	var originDoorReq = true;
	var newRoomReq = false;
	originDoorSuccess = true;
	if (Object.keys(rooms).length != 1) {
		var filterdDoors = [];
		var existingDoor = false;
		//check if we are returning through door.
		//loop through originDoors and check to see if they match the last door information.
		if (originDoors.length >= 1) {
			positionPlayer(originDoors[0].x,originDoors[0].y);
			for (var i = 0; i < originDoors.length; i++) {
				//check if door exists in the door array
				existingDoor=checkDoor(currentRoom,originDoors[i].x,originDoors[i].y)
				if (existingDoor !== false) {
					//compare this door to the last door infor to see if it is this doors match.
					if ((rooms[currentRoom].doors[existingDoor].toPos.x == rooms[lastRoom].pos.x) && (rooms[currentRoom].doors[existingDoor].toPos.y == rooms[lastRoom].pos.y)) {
						//this origindoor points to last room
						if (rooms[currentRoom].doors[existingDoor].toRoomPos.x == rooms[lastRoom].doors[lastDoor].roomPos.x) {
							if (rooms[currentRoom].doors[existingDoor].toRoomPos.y == rooms[lastRoom].doors[lastDoor].roomPos.y) {
								//Door is a match to an already created door.
								console.log("Revisting room no need for new origin door.");
								originDoorReq = false;	
								buildRoom(); // buildRoom as it is valid					
								positionPlayer(originDoors[i].x,originDoors[i].y);					
							}
						}
						else if ((originDoorReq == true) && ((originDoors.length-1) == i)) {
							newRoomReq = true;
							buildRoom(false); // destroy queue as it is invalid
							console.log('New Room Required');
						}
					}
				}			
		 	}		
		}
		else {
			originDoorSuccess = false;
			newRoomReq = true;
			deleteRoom = true;
			buildRoom(false); // destroy queue as it is invalid
		}
		if (originDoorReq) {
			//remove the origin doors which have already been used.
			for (var i = 0; i < originDoors.length; i++) {
				existingDoor=checkDoor(currentRoom,originDoors[i].x,originDoors[i].y)
				if ((existingDoor == false) && (typeof existingDoor =="boolean")) {
					filterdDoors.push(originDoors[i]);
				}			
		 	}
			originDoors = filterdDoors;		

			if ((originDoors.length) == 0) {
				newRoomReq = true;
				console.log('New Room Required');
				originDoorSuccess = false;
				buildRoom(false); // destroy queue as it is invalid
			}
			else {
				buildRoom(); // buildRoom as it is valid
				var decider = Math.floor(roomRandom() * originDoors.length);
				console.log("DEBUG originDoors=" + JSON.stringify(originDoors) +" Decider=" + decider);
				setDoor(originDoors[decider].x, originDoors[decider].y);
				//drawRoomQueue.push('setDoor(' + originDoors[decider].x + ', ' + originDoors[decider].y + ');');
				positionPlayer(originDoors[decider].x,originDoors[decider].y);
				DEBUGinstructions.push("To get back to " + lastPos.x + ":" + lastPos.y + " go through door " + originDoors[decider].x + ":" + originDoors[decider].y)
				DEBUGreplay.push(DEBUGreplay.lenght + "- Col: " + userPlayer.last.door.x + " Row: " + userPlayer.last.door.y)
			}
		}
		if (newRoomReq) {
			console.log("NO DOORS AVAILIBLE MAKING NEW ROOM??" + originDoors);
			switch (userPlayer.rotation) {
				case 360:
				case 0:
				case -0:
					//last move was moving forward so move y+ a point.
					userPlayer.pos.y = userPlayer.pos.y + 0.01;
					rooms[lastRoom].doors[lastDoor].toPos.y = userPlayer.pos.y;
					break;
				case 90:
				case 450:
					//last move was moving left so move x+ a point.
					userPlayer.pos.x = userPlayer.pos.x + 0.01;
					rooms[lastRoom].doors[lastDoor].toPos.x = userPlayer.pos.x;
					break;
				case 180:
				case -180:
					//last move was moving down so move y- a point.
					userPlayer.pos.y = userPlayer.pos.y - 0.01;
					rooms[lastRoom].doors[lastDoor].toPos.y = userPlayer.pos.y;
					break;
				case 270:
				case -90:
					//last move was moving right so move x- a point.
					userPlayer.pos.x = userPlayer.pos.x - 0.01;
					rooms[lastRoom].doors[lastDoor].toPos.x = userPlayer.pos.x;
					break;
			}
			//create new room
			
			Crafty(Crafty('FloorGround')[0]).destroy();
			originDoorSuccess = false;
			generateRoom();
			originDoorReq == false;
			return false;
		}
	}
	else {
		buildRoom(); // buildRoom as it is valid and is the first room
	}
	return true;
}

function fillWalls() {
	////console.log("Fill walls");
	var rows = floorMap.length - 1;
	var cols;
	for (var row = 0; row <= rows; row++) {
		cols = floorMap[row].length - 1;
		for (var col = 0; col <= cols; col++) {
			//check this tile
			if (floorMap[row][col] != "f") {
				//check tile above
				//protect against under/overflow
				if (!((row-1) < 0)) {
					if (floorMap[row-1][col] == "f") {
						//floor above make a wall
						if (floorMap[row][col].substring(2,3) != "i") { floorMap[row][col] = "wb"; }
						//check inside corners
						if (!((col-1) < 0)) {
							if (floorMap[row][col-1] == "f") {
								//inside corner top left
								////console.log("inside corner tl");
								floorMap[row][col] = "tli";
							}
						}
						if (!((col+1) > cols)) {
							if (floorMap[row][col+1] == "f") {
								//inside corner top right
								////console.log("inside corner tr");
								floorMap[row][col] = "tri";
							}
						}
					}
					else {
						if (!((row-1) < 0)) {
							if (!((col-1) < 0)) {
								if (floorMap[row-1][col-1] == "f") {
									//corner to top left
									if ((floorMap[row][col].substring(0,1) != "w")&&(floorMap[row][col-1] != "f")) { floorMap[row][col] = "tlc"; }
								}
							}
						}
						if (!((row-1) < 0)) {
							if (!((col+1) > cols)) {
								if (floorMap[row-1][col+1] == "f") {
									//corner to top right
									if ((floorMap[row][col].substring(0,1) != "w")&&(floorMap[row][col+1] != "f")) { floorMap[row][col] = "trc"; }
								}
							}
						}
					}
				}
				if (!((row+1) > rows)) {
					if (floorMap[row+1][col] == "f") {
						//floor below make a wall
						if (floorMap[row][col].substring(2,3) != "i") { floorMap[row][col] = "wa"; }
						//check inside corners
						if (!((col-1) < 0)) {
							if (floorMap[row][col-1] == "f") {
								//inside corner bot left
								////console.log("inside corner bl");
								floorMap[row][col] = "bli";
							}
						}
						if (!((col+1) > cols)) {
							if (floorMap[row][col+1] == "f") {
								//inside corner bot right
								////console.log("inside corner br");
								floorMap[row][col] = "bri";
							}
						}
					}
					else {
						if (!((row+1) > rows)) {
							if (!((col-1) < 0)) {
								if (floorMap[row+1][col-1] == "f") {
									//corner to bot left
									//check left else its not a corner
									if ((floorMap[row][col].substring(0,1) != "w")&&(floorMap[row][col-1] != "f")) { floorMap[row][col] = "blc"; }
								}
							}
						}
						if (!((row+1) > rows)) {
							if (!((col+1) > cols)) {
								if (floorMap[row+1][col+1] == "f") {
									//corner to bot right
									if ((floorMap[row][col].substring(0,1) != "w")&&(floorMap[row][col+1] != "f")) { floorMap[row][col] = "brc"; }
								}
							}
						}
					}
				}
				if (!((col-1) < 0)) {
					if (floorMap[row][col-1] == "f") {
						//floor to left make a wall
						if (floorMap[row][col].substring(2,3) != "i") { floorMap[row][col] = "wr"; }

					}
				}
				if (!((col+1) > cols)) {
					if (floorMap[row][col+1] == "f") {
						//floor to right make a wall
						if (floorMap[row][col].substring(2,3) != "i") { floorMap[row][col] = "wl"; }
					}
				}
			}
		}
	}
}
function buildRoom() {
	//go thorugh build loop.
	while (drawRoomQueue.length != 0) {
		eval(drawRoomQueue.shift());
	}
}

function drawRoom() {
	////console.log('draw room ' + floorMap);
	var rows = floorMap.length;
	var cols;
	var decider;
	var oppisiteRotation;
	var tileRotation;
	var offsetDoor = {};
	var style;
	//Draw ground/parent
	//console.log("roomCenter.x = " + roomCenter.x);
	drawRoomQueue.push('Crafty.e("FloorGround, 2D, ' + renderEngine + ', Color") \
		.attr({x: ' +((roomCenter.x*_tileSize)+(_tileSize/2)) + ', y: ' + ((roomCenter.y*_tileSize)+(_tileSize/2)) + ', w: 1, h: 1, alpha: 0}) \
		.color("#FFFFFF")\
		.objectMap = [[]];');
	
	
	for (var row = 0; row < rows; row++) {
		cols = floorMap[row].length;
		//create objectMap array.
		objectMap[row] = [];
		for (var col = 0; col < cols; col++) {
			switch (floorMap[row][col].substring(2,0)) {
				case "da":
				case "wa":
					tileRotation = 0;
					break;
				case "db":
				case "wb":
					tileRotation = 180;
					break;
				case "dl":
				case "wl":
					tileRotation = 270;
					break;
				case "dr":
				case "wr":
					tileRotation = 90;
					break;
				case "tl":
					tileRotation = 180;
					break;
				case "tr":
					tileRotation = 270;
					break;
				case "bl":
					tileRotation = 90;
					break;
				case "br":
					tileRotation = 0;
					break;
			}
			offsetDoor = {};
			switch (floorMap[row][col].substring(2,0)) {
				case "da":
				case "db":
				case "dl":
				case "dr":
					switch (floorMap[row][col].substring(2,1)) {
						case "a":
							offsetDoor.y = _tileSize/2;
							offsetDoor.x = 0;
							break;
						case "b":
							offsetDoor.y = Math.abs(_tileSize/2) * -1;
							offsetDoor.x = 0;
							break;
						case "l":
							offsetDoor.y = 0;
							offsetDoor.x = _tileSize/2;
							break;
						case "r":
							offsetDoor.y = 0;
							offsetDoor.x = Math.abs(_tileSize/2) * -1;
							break;
					}
					//Door creation
					style = floorMap[row][col].substring(3,2);
					//Add Door Frame
					
					
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', floorMap, doorSprite' + style + '_reel, wallDoorAnimate")\
						.attr({y: ' + row*_tileSize + ', x: ' + col*_tileSize + ', w: ' + _tileSize + ', h: + ' + _tileSize + ' , xTile: ' + col + ', yTile: ' + row +'});\
					Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col + '"));\
					Crafty("Tile' + row + '_' + col + '").origin("center");\
					Crafty("Tile' + row + '_' + col + '").offset = {x: ' + offsetDoor.x + ', y:' + offsetDoor.y + '};\
					Crafty("Tile' + row + '_' + col + '").rotation = ' + tileRotation + ';')

					drawRoomQueue.push('Crafty.e("TileFrame' + row + '_' + col +', wallMap, door_frame")\
							.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("TileFrame' + row + '_' + col +'"));\
						Crafty("TileFrame' + row + '_' + col + '").origin("center");\
						Crafty("TileFrame' + row + '_' + col + '").rotation = ' + tileRotation + ';');
					
					
					//find origin door
					oppisiteRotation = tileRotation + 180
					if (oppisiteRotation == 450) { oppisiteRotation = 90; }
					if (oppisiteRotation == 360) { oppisiteRotation = 0; }
					////console.log(oppisiteRotation + " " + userPlayer.rotation);
					if ((oppisiteRotation == userPlayer.rotation) || ((oppisiteRotation == 270) && (userPlayer.rotation == -90)) || ((oppisiteRotation == 0) && (userPlayer.rotation == 360))) {
						originDoors.push({x: col,y: row});
						//console.log("Door added");
					}
					/*else {
						////console.log("rotation did not match" + oppisiteRotation + "/" + userPlayer.rotation);
					}*/
					//change floor map to door instead of wall
					//Add door colour here. Math.floor(roomRandom() * numOfDoorStyles) + 1
					//get door colour floorMap[row][col].substring(3,2)
					floorMap[row][col] = "d" + floorMap[row][col].substring(2,1) + style;
					//rooms[currentRoom-1].doors.push(new Door(newDoor.x,newDoor.y,0)); //TODO make new currentfloor varible.
					
					break;
			}
			switch (floorMap[row][col]) {
				case "f":
				case "o":
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', floorMap, floor_' + rooms[currentRoom].floorStyle + '")\
						.attr({y: ' + row*_tileSize + ', x: ' + col*_tileSize + ', w: ' + _tileSize + ' , h: ' + _tileSize + ', xTile: ' + col + ', yTile:' + row +'}); \
					Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col + '"));')

					break;
				case "x":
					break;
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col + ', floorMap, Color")\
						.attr({y: ' + row*_tileSize + ', x: ' + col*_tileSize + ', w: ' + _tileSize + ', h: + ' + _tileSize + '})\
						.color("#000000");\
					Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col +'"));');
					
					
					break;
				case "wa":
				case "wb":
				case "wl":
				case "wr":
					//check if room has been created already
					if (rooms[currentRoom].map == "") {
						decider = Math.floor(roomRandom() * doorChance) + 1;
					}
					else { 
						decider = 3; 
						//console.log('Room already exitst dont regendoors.');
					}
					if (decider > 2) {	
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', wallMap, wall_straight")\
							.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col +'"));\
						Crafty("Tile' + row + '_' + col + '").origin("center");\
						Crafty("Tile' + row + '_' + col + '").rotation = ' + tileRotation + ';');

					}
					else {
						//room directions major direction ++ minor direction  1/2 sparseness +/-
						switch (floorMap[row][col].substring(2,1)) {
							case "a":
								offsetDoor.y = _tileSize/2;
								offsetDoor.x = 0;
								break;
							case "b":
								offsetDoor.y = Math.abs(_tileSize/2) * -1;
								offsetDoor.x = 0;
								break;
							case "l":
								offsetDoor.y = 0;
								offsetDoor.x = _tileSize/2;
								break;
							case "r":
								offsetDoor.y = 0;
								offsetDoor.x = Math.abs(_tileSize/2) * -1;
								break;
						}
						//Door creation
						style = (Math.floor(roomRandom() * numOfDoorStyles) + 1)
						drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', floorMap, doorSprite' + style + '_reel, wallDoorAnimate")\
							.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col + '"));\
						Crafty("Tile' + row + '_' + col + '").origin("center");\
						Crafty("Tile' + row + '_' + col + '").style = ' + style + ';\
						Crafty("Tile' + row + '_' + col + '").offset = {x:' + offsetDoor.x + ', y:' + offsetDoor.y + '};\
						Crafty("Tile' + row + '_' + col + '").rotation = ' + tileRotation + ';');

						//Door Frame 
						drawRoomQueue.push('Crafty.e("TileFrame' + row + '_' + col +', wallMap, door_frame")\
							.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("TileFrame' + row + '_' + col +'"));\
						Crafty("TileFrame' + row + '_' + col + '").origin("center");\
						Crafty("TileFrame' + row + '_' + col + '").rotation = ' + tileRotation + ';');

						//find origin door
						oppisiteRotation = tileRotation + 180
						if (oppisiteRotation == 450) { oppisiteRotation = 90; }
						if (oppisiteRotation == 360) { oppisiteRotation = 0; }
						////console.log(oppisiteRotation + " " + userPlayer.rotation);
						if ((oppisiteRotation == userPlayer.rotation) || ((oppisiteRotation == 270) && (userPlayer.rotation == -90)) || ((oppisiteRotation == 0) && (userPlayer.rotation == 360))) {
							originDoors.push({x: col,y: row});
							//console.log("Door added");
						}
						/*else {
							////console.log("rotation did not match" + oppisiteRotation + "/" + userPlayer.rotation);
						}*/
						//change floor map to door instead of wall
						//Add door colour here. Math.floor(roomRandom() * numOfDoorStyles) + 1
						//get door colour floorMap[row][col].substring(3,2)
						floorMap[row][col] = "d" + floorMap[row][col].substring(2,1) + style;
						//rooms[currentRoom-1].doors.push(new Door(newDoor.x,newDoor.y,0)); //TODO make new currentfloor varible.
					}
					break;
				case "tli":
				case "tri":
				case "bli":
				case "bri":
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', wallMap, wall_corner_in")\
						.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col +'"));\
						Crafty("Tile' + row + '_' + col + '").origin("center");\
						Crafty("Tile' + row + '_' + col + '").rotation = ' + tileRotation + ';');

					break;
				case "tlc":
				case "trc":
				case "blc":
				case "brc":
					drawRoomQueue.push('Crafty.e("Tile' + row + '_' + col +', wallMap, wall_corner_out")\
						.attr({y:' + row*_tileSize + ', x:' + col*_tileSize + ', w:' + _tileSize + ', h:' + _tileSize + ', xTile:' + col + ', yTile:' + row + ' });\
						Crafty(Crafty("FloorGround")[0]).attach(Crafty("Tile' + row + '_' + col +'"));\
						Crafty("Tile' + row + '_' + col + '").origin("center");\
						Crafty("Tile' + row + '_' + col + '").rotation = ' + tileRotation + ';');
					
					break;
			}
		}
	}
}

/*
function getRoomMeasurements() {
	//check if top row has any empty space
	if ($.inArray("x",floorMap[1]) == -1) {
		//Top has No empty Space
		//draw top measure
		drawRoomMeasurements(1, floorMap[1].length/2, floorMap[1].length)
		//check if bottom row has any empty space
		if ($.inArray("x",floorMap[floorMap.length-1]) == -1) {
			//Top and bottom have no empty space (square or rectangle
			//draw bottom and side measure
			drawRoomMeasurements(2, floorMap[1].length/2, floorMap[1].length)
			drawRoomMeasurements(3, floorMap.length/2, floorMap.length)
			drawRoomMeasurements(4, floorMap.length/2, floorMap.length)
		}
		else {
			//bottom has a gap
		}
	}
	else {
		//Top has a gap
	}
}

function drawRoomMeasurements(wallID, middleBlock, wallSize) {
	//which wall
	switch (wallID) {
		case 1:
			//get middle block locaiton
			if (Number.isInteger(middleBlock)) {
				Crafty.e("2D, DOM, Text, " + wallID + "measure")
					.attr({ x: (Crafty('Tile0_' + middleBlock).x)-10, y: (Crafty('Tile0_' + middleBlock).y)-15 })
					.textColor('#f1f1d9') 
					.textFont({ size: '8px', weight: 'italic' })
					.text((wallSize * 3.14 + "Top"));
			}
			else {
				//middle block is halved
				Crafty.e("2D, DOM, Text, " + wallID + "measure")
					.attr({ x: Crafty('Tile0_' + Math.floor(middleBlock)).x +(_tileSize *0.5), y: Crafty('Tile0_' + Math.floor(middleBlock)).y-15 })
					.textColor('#f1f1d9') 
					.textFont({ size: '8px', weight: 'italic' })
					.text((wallSize * 3.14 + "Top"));
			}
			Crafty(Crafty("FloorGround")[0]).attach(Crafty(wallID + "measure"));
			break;
		case 2:
			if (Number.isInteger(middleBlock)) {
				Crafty.e("2D, DOM, Text, " + wallID + "measure")
					.attr({ x: (Crafty('Tile' + (floorMap.length-1) + '_' + middleBlock).x +10), y: Crafty('Tile' + (floorMap.length-1) + '_' + Math.floor(middleBlock)).y+15 })
					.textColor('#f1f1d9') 
					.textFont({ size: '8px', weight: 'italic' })
					.text((wallSize * 3.14 + "Bot"));
			}
			else {
				//middle block is halved
				Crafty.e("2D, DOM, Text, " + wallID + "measure")
					.attr({ x: Crafty('Tile' + (floorMap.length-1) + '_' + Math.floor(middleBlock)).x +(_tileSize *0.5), y: Crafty('Tile' + (floorMap.length-1) + '_' + Math.floor(middleBlock)).y+15 })
					.textColor('#f1f1d9') 
					.textFont({ size: '8px', weight: 'italic' })
					.text((wallSize * 3.14 + "Bot"));
			}
			Crafty(Crafty("FloorGround")[0]).attach(Crafty(wallID + "measure"));
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break
	}
}
*/

function changeDoor(doorPosRow,doorPosCol, action) {
	thisDoor = Crafty('Tile' + doorPosRow + '_' + doorPosCol)

	if (action == "open") {
		thisDoor.openDoor();		
	}
	else if (action == "close") {
		thisDoor.closeDoor();
	}
	else if (action == "opened") {
		thisDoor.openedDoor();
	}
	
	//return thisDoor;
}

function checkRoom(sX,sY,sZ) {
	//console.log("searching.. z: " + sZ + " x: " + sX + " y: " + sY);
	var roomFound=false;
	if (typeof rooms['x' + sX + 'y' + sY + 'z' + sZ] != 'undefined') {
		roomFound = 'x' + sX + 'y' + sY + 'z' + sZ;
	}
	/*for (var i = 0; i < rooms.length; i++) {
		if (rooms[i] != "") {
			if (rooms[i].pos.z == sZ) {
				////console.log('Room ' + i +' has same z:' + sZ);
				if (rooms[i].pos.x == sX) {
					////console.log('Room ' + i +' has same x:' + sX);
					if (rooms[i].pos.y == sY) {
						////console.log('Room ' + i +' has same y:' + sY);
						//console.log('Room EXISTS');
						roomFound=i;
						return i;
						break;
					}
				}
			}
		}
 	}*/
 	if (roomFound == false) {
		//console.log('Room not Found');
	}
 	return roomFound;
}

function checkDoor(sRoom,sX,sY) {
	console.log("searching.. x: " + sX + " y: " + sY + " in Room: " + sRoom);
	var doorFound=false;
	for (var i = 0; i < rooms[sRoom].doors.length; i++) {
	    if (rooms[sRoom].doors[i].roomPos.y == sY) {
			console.log('Door ' + i +' has same y:' + sY);
			if (rooms[sRoom].doors[i].roomPos.x == sX) {
				console.log('Door EXISTS');
				doorFound=i;
				return i;
				break;
			}
			else {
				console.log("Not a match " + rooms[sRoom].doors[i].roomPos.x);
			}
		}
		else {
			console.log("Not a match " + rooms[sRoom].doors[i].roomPos.y);
		}
 	}
 	/*if (doorFound == false) {
		////console.log('Door not Found');
	}*/
 	return doorFound;
}

//returns the tiles of x/y pos
function getFloorTile(sX,sY) {
	//console.log("searching.. x: " + sX + " y: " + sY);
	var tileFound=false;
	for (var row = 0; row < floorMap.length; row++) {
		for (var col = 0; col < floorMap[0].length; col++) {
			if (sY > (Crafty('Tile' + row + "_" + col)._y -(_tileSize/2)) && (sY < (Crafty('Tile' + row + "_" + col)._y +(_tileSize/2)))) {
				//console.log('Tile ' + row + "_" + col + ' has same y:' + sY);
				if (sX > (Crafty('Tile' + row + "_" + col)._x -(_tileSize/2)) && (sX < (Crafty('Tile' + row + "_" + col)._x +(_tileSize/2)))) {
					//console.log('Player is at tile Row: ' + row + ' col: ' + col);
					tileFound={row: row, col: col}
					return tileFound;
					break;
				}
			}
		}
 	}
 	return tileFound;
 }

//returns arry of all the doors
function getAllDoors() {
	var doors = [];
	for (var y = 0; y < floorMap.length; y++) {
		for (var x = 0; x < floorMap[0].length; x++) {
			if (floorMap[y][x].substring(1,0) == "d") {
				doors.push({x: x, y: y});
			}					
		}
	}
	return doors;
};

//returns quantity of query.
//getAllDoors().lenght makes getQuantity(doors) redundant TODO
function getQuantity(query) {
	if ((typeof (query) == "undefined")) { 
		return false;
	}
	switch (query) {
		case "door":
			var numOfDoors = 0;
			for (var x = 0; x < floorMap.length; x++) {
				for (var y = 0; y < floorMap[0].length; y++) {
					if (floorMap[x][y].substring(1,0) == "d") {
						numOfDoors++;
					}					
				}
			}
			return numOfDoors;
			break;
	}
}
