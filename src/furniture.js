//get open floor space.
//object map minus fire route.
function getFreeFloorSpace() {
	var rows = floorMap.length;
	var cols;
	var tile;
	for (var row = 0; row < rows; row++) {
		cols = floorMap[row].length;
		for (var col = 0; col < cols; col++) {
			tile=floorMap[row][col];
			if (tile == "f") {
				if (objectMap[row][col] != "FR") {
					floorMap[row][col] = "o"
					objectMap[row][col] = "o"
				}
			}
			else if (tile == "w") {
				if (objectMap[row][col] != "FR") {
					objectMap[row][col] = "w"
				}
			}
			else if ((tile == "b") || (tile == "t")) {
				if (objectMap[row][col] != "FR") {
					objectMap[row][col] = "c"
				}
			}
		}
	}	
}

function placeFurniture() {
	var roomVariants = 1;
	var placementFound = false;
	var furnitureVariants = 7; //4/5/7 fourth will be just blank.
	var furniture1x1Variants = 10;
	var furniture1x2Variants = 6;
	var furniture2x2Variants = 7;
	var colourVariants = 5;	
	furnitureRandom = new Math.seedrandom(gameSeed + " . " + userPlayer.pos.x + "." + userPlayer.pos.y + "." + userPlayer.pos.z);
	
	
	var roomType = Math.floor(furnitureRandom() * roomVariants) + 1;
	var roomColour = Math.floor(furnitureRandom() * colourVariants) + 1;
	var roomVariant;
	var furnitureRotation = "";
	var furnitureVariant;

	var rows = objectMap.length;
	var cols;
	var variant;
	var x;
	var offsetPlacement;

	var openPositions = [];
	//fix centering

	for (var row = 0; row < rows; row++) {
		cols = objectMap[row].length;
		for (var col = 0; col < cols; col++) {
			if (objectMap[row][col] == "o") {
				//found an empty tile
				//check next to it 
				//check below it/diagonal to it
				//Check all possible placements.
				//N above
				openPositions = [];
				if (!(typeof objectMap[row-1] === 'undefined')) {
					//N above
					if (objectMap[row-1][col] == "o") {
						openPositions.push('N');
					}
					//NW
					if (!(typeof objectMap[row-1][col-1] === 'undefined')) {	
						if (objectMap[row-1][col-1] == "o") {
							openPositions.push('NW');
						}
					}	
					//NE
					if (!(typeof objectMap[row-1][col+1] === 'undefined')) {	
						if (objectMap[row-1][col+1] == "o") {
							openPositions.push('NE');
						}
					}	
				}
				//S Below
				if (!(typeof objectMap[row+1] === 'undefined')) {
					//S above
					if (objectMap[row+1][col] == "o") {
						openPositions.push('S');
					}
					//SW
					if (!(typeof objectMap[row+1][col-1] === 'undefined')) {	
						if (objectMap[row+1][col-1] == "o") {
							openPositions.push('SW');
						}
					}	
					//SE
					if (!(typeof objectMap[row+1][col+1] === 'undefined')) {	
						if (objectMap[row+1][col+1] == "o") {
							openPositions.push('SE');
						}
					}
				}
				//E
				if (!(typeof objectMap[row][col+1] === 'undefined')) {	
					if (objectMap[row][col+1] == "o") {
						openPositions.push('E');
					}
				}
				//W
				if (!(typeof objectMap[row][col-1] === 'undefined')) {	
					if (objectMap[row][col-1] == "o") {
						openPositions.push('W');
					}
				}

				//Know open spaces now need to decide what to place.
				//choose between variants.
				placementFound = false;
				furnitureRotation = "";
				while (placementFound == false) {
					roomVariant = Math.floor(furnitureRandom() * furnitureVariants) + 1;
					//check for blank room
					if ((roomVariant == 4) || (roomVariant == 5) || (roomVariant == 7)) {
						placementFound = true;
						//make tile walkable again. (will keep the tile open on object map but open it on floor map incase a peice of furniture can occupy this tile in next intteration.(just need to remember to do this for all tiles though.)
						objectMap[row][col] = "o";
						floorMap[row][col] = "f";
					}
					else if (roomVariant == 1) {
						placementFound = true;
						furnitureVariant = Math.floor(furnitureRandom() * furniture1x1Variants) + 1
						Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_1x1_' + furnitureVariant)
							.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize, h: _tileSize, xTile: col, yTile: row});
						Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
						Crafty('TileOpen' + row + '_' + col).origin('center');
						objectMap[row][col] = "T";
						//better rotating
						var betterRotation = 0;
						//pop out all ordial directions
						x = openPositions.indexOf("NE");
						if (x != -1) { openPositions.splice(x,1); }
						x = openPositions.indexOf("SE");
						if (x != -1) { openPositions.splice(x,1); }
						x = openPositions.indexOf("NW");
						if (x != -1) { openPositions.splice(x,1); }
						x = openPositions.indexOf("SW");
						if (x != -1) { openPositions.splice(x,1); }
						//want to put it into non open facing postion.
						if ((floorMap[row-1][col].substring(0,1) == "w")) { betterRotation = 0; }
						else {
							if ((floorMap[row+1][col].substring(0,1) == "w")) { betterRotation = 180; }
							else {
								if ((floorMap[row][col+1].substring(0,1) == "w")) { betterRotation = 90; }
								else {
									if ((floorMap[row][col-1].substring(0,1) == "w")) { betterRotation = 270; }
									else{
										x = openPositions.indexOf("N");
										if (x == -1) { betterRotation = 0; }
										else {
											x = openPositions.indexOf("S");
											if (x == -1) { betterRotation = 180; }
											else {
												x = openPositions.indexOf("E");
												if (x == -1) { betterRotation = 90; }
												else {
													x = openPositions.indexOf("W");
													if (x == -1) { betterRotation = 270; }
												}
											}
										}
									}
								}
							}
						}
						Crafty('TileOpen' + row + '_' + col).rotation = betterRotation;
						
					}
					else if (roomVariant == 2) {
						placementFound = true;
						var dualPositions = openPositions.slice();
						//check will this fit.
						//pop out all ordial directions
						x = dualPositions.indexOf("NE");
						if (x != -1) { dualPositions.splice(x,1); }
						x = dualPositions.indexOf("SE");
						if (x != -1) { dualPositions.splice(x,1); }
						x = dualPositions.indexOf("NW");
						if (x != -1) { dualPositions.splice(x,1); }
						x = dualPositions.indexOf("SW");
						if (x != -1) { dualPositions.splice(x,1); }

						//check the length of x = openPositions if it is 1 then that is the direcction other wise use random to find.
						if (dualPositions.length == 0) {
							placementFound = false;
						}
						else if (dualPositions.length == 1) {
							//get rotation going N/S or E/W (default is E/W)
							furnitureRotation = dualPositions[0]
						}
						else {
							//pick randomly
							x = Math.floor(furnitureRandom() * dualPositions.length)
							furnitureRotation = dualPositions[x]
						}

						if (furnitureRotation != "") {
							if (furnitureRotation == "E") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture1x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_1x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize*2, h: _tileSize, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin("center");
								//block off tiles
								objectMap[row][col] = "T";
								objectMap[row][col+1] = "T";
								floorMap[row][col+1] = "o";

								//better Rotation
								var betterRotation = 0;
								if ((floorMap[row-1][col].substring(0,1) == "w")) { betterRotation = 0; }
								else {
									if ((floorMap[row+1][col].substring(0,1) == "w")) { betterRotation = 180; }
									else {
										x = openPositions.indexOf("N");
										if (x == -1) { betterRotation = 0; }
										else {
											x = openPositions.indexOf("S");
											if (x == -1) { betterRotation = 180; }
										}
									}
								}
								Crafty('TileOpen' + row + '_' + col).rotation = betterRotation;
								//set tiles infront to be open if notheing there already
								if (betterRotation == 0) {
									//South should be left open
									if (!(typeof objectMap[row+1][col] === 'undefined')) {	
										if (objectMap[row+1][col] == "o") {
											objectMap[row+1][col] == "FR";
											floorMap[row+1][col] == "FR";
										}
									}	
									if (!(typeof objectMap[row+1][col+1] === 'undefined')) {	
										if (objectMap[row+1][col+1] == "o") {
											objectMap[row+1][col+1] == "FR";
											floorMap[row+1][col+1] == "FR";
										}
									}
									
								}
								else if (betterRotation == 180) {
									//North should be left open
									if (!(typeof objectMap[row+1][col] === 'undefined')) {	
										if (objectMap[row-1][col] == "o") {
											objectMap[row-1][col] == "FR";
											floorMap[row-1][col] == "FR";
										}
									}	
									if (!(typeof objectMap[row+1][col+1] === 'undefined')) {	
										if (objectMap[row-1][col+1] == "o") {
											objectMap[row-1][col+1] == "FR";
											floorMap[row-1][col+1] == "FR";
										}
									}
								}
																
							}
							else if (furnitureRotation == "W") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture1x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_1x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + (col-1))._x, w: _tileSize*2, h: _tileSize, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin("center");
								objectMap[row][col] = "T";
								objectMap[row][col-1] = "T";
								floorMap[row][col-1] = "o";

								//better Rotation
								var betterRotation = 180;
								if ((floorMap[row-1][col].substring(0,1) == "w")) { betterRotation = 0; }
								else {
									if ((floorMap[row+1][col].substring(0,1) == "w")) { betterRotation = 180; }
									else {
										x = openPositions.indexOf("N");
										if (x == -1) { betterRotation = 0; }
										else {
											x = openPositions.indexOf("S");
											if (x == -1) { betterRotation = 180; }
										}
									}
								}
								Crafty('TileOpen' + row + '_' + col).rotation = betterRotation;

								//set tiles infront to be open if notheing there already
								if (betterRotation == 0) {
									//South should be left open
									if (!(typeof objectMap[row+1][col] === 'undefined')) {	
										if (objectMap[row+1][col] == "o") {
											objectMap[row+1][col] == "FR";
											floorMap[row+1][col] == "FR";
										}
									}	
									if (!(typeof objectMap[row+1][col+1] === 'undefined')) {	
										if (objectMap[row+1][col-1] == "o") {
											objectMap[row+1][col-1] == "FR";
											floorMap[row+1][col-1] == "FR";
										}
									}
									
								}
								else if (betterRotation == 180) {
									//North should be left open
									if (!(typeof objectMap[row+1][col] === 'undefined')) {	
										if (objectMap[row-1][col] == "o") {
											objectMap[row-1][col] == "FR";
											floorMap[row-1][col] == "FR";
										}
									}	
									if (!(typeof objectMap[row+1][col+1] === 'undefined')) {	
										if (objectMap[row-1][col-1] == "o") {
											objectMap[row-1][col-1] == "FR";
											floorMap[row-1][col-1] == "FR";
										}
									}
								}
								
							}
							else if (furnitureRotation == "N") {

								furnitureVariant = Math.floor(furnitureRandom() * furniture1x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_1x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize*2, h: _tileSize, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin(_tileSize/2,_tileSize/2);
								//block off tiles
								objectMap[row][col] = "T";
								objectMap[row-1][col] = "T";
								floorMap[row-1][col] = "o";
								Crafty('TileOpen' + row + '_' + col).rotation = 270;

								//better Rotation
								var betterRotation = 270;
								if ((floorMap[row][col+1].substring(0,1) == "w")) { betterRotation = 270; }
								else {
									if ((floorMap[row][col-1].substring(0,1) == "w")) { betterRotation = 90; }
									else {
										x = openPositions.indexOf("E");
										if (x == -1) { betterRotation = 270; }
										else {
											x = openPositions.indexOf("W");
											if (x == -1) { betterRotation = 90; }
										}
									}
								}
								if (betterRotation == 270) { Crafty('TileOpen' + row + '_' + col).flip('Y'); }

							}
							else if (furnitureRotation == "S") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture1x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_1x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize*2, h: _tileSize, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin(_tileSize/2,_tileSize/2);
								//block off tiles
								Crafty('TileOpen' + row + '_' + col).rotation = 90;
								objectMap[row][col] = "T";
								objectMap[row+1][col] = "T";
								floorMap[row+1][col] = "o";

								//better Rotation
								var betterRotation = 90;
								if ((floorMap[row][col+1].substring(0,1) == "w")) { betterRotation = 270; }
								else {
									if ((floorMap[row][col-1].substring(0,1) == "w")) { betterRotation = 90; }
									else {
										x = openPositions.indexOf("E");
										if (x == -1) { betterRotation = 270; }
										else {
											x = openPositions.indexOf("W");
											if (x == -1) { betterRotation = 90; }
										}
									}
								}
								if (betterRotation == 90) { Crafty('TileOpen' + row + '_' + col).flip('Y'); }
							}
						}
					}
					else if ((roomVariant == 3) || (roomVariant == 6)){
						placementFound = true;
						//check 4 postions to see if they are open
						var quadsAvailible = [];
						//NW
						if ((openPositions.indexOf("NW") != -1 && openPositions.indexOf("W") != -1 && openPositions.indexOf("N") != -1)){
							quadsAvailible.push('NW'); 
						}
						//NE
						if ((openPositions.indexOf("NE") != -1 && openPositions.indexOf("E") != -1 && openPositions.indexOf("N") != -1)){
							quadsAvailible.push('NE'); 
						}
						//SW
						if ((openPositions.indexOf("SW") != -1 && openPositions.indexOf("W") != -1 && openPositions.indexOf("S") != -1)){
							quadsAvailible.push('SW'); 
						}
						//SE
						if ((openPositions.indexOf("SE") != -1 && openPositions.indexOf("E") != -1 && openPositions.indexOf("S") != -1)){
							quadsAvailible.push('SE'); 
						}
						
						//check the length of quadsAvailible if it is 1 then that is the direction other wise use random to find.
						if (quadsAvailible.length == 0) {
							placementFound = false;
						}
						else if (quadsAvailible.length == 1) {
							//get rotation going N/S or E/W (default is E/W)
							furnitureRotation = quadsAvailible[0]
						}
						else {
							//pick randomly
							x = Math.floor(furnitureRandom() * quadsAvailible.length)
							furnitureRotation = quadsAvailible[x]
						}
						if (furnitureRotation != "") {
							if (furnitureRotation == "SE") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture2x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_2x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize*2, h: _tileSize*2, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								//add computer test
								addComputer(row, col, 0, furnitureVariant);
								//block off tiles
								objectMap[row][col] = "T";
								objectMap[row][col+1] = "T";
								floorMap[row][col+1] = "o";
								objectMap[row+1][col+1] = "T";
								floorMap[row+1][col+1] = "o";
								objectMap[row+1][col] = "T";
								floorMap[row+1][col] = "o";
								
							}
							else if (furnitureRotation == "SW") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture2x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_2x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + (col-1))._x, w: _tileSize*2, h: _tileSize*2, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin("center");
								Crafty('TileOpen' + row + '_' + col).rotation = 180;
								//add computer test
								addComputer(row, col, 180, furnitureVariant);
								objectMap[row][col] = "T";
								objectMap[row][col-1] = "T";
								floorMap[row][col-1] = "o";
								objectMap[row+1][col-1] = "T";
								floorMap[row+1][col-1] = "o";
								objectMap[row+1][col] = "T";
								floorMap[row+1][col] = "o";
							}
							else if (furnitureRotation == "NE") {

								furnitureVariant = Math.floor(furnitureRandom() * furniture2x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_2x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + (row-1) + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize*2, h: _tileSize*2, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin('center');
								Crafty('TileOpen' + row + '_' + col).rotation = 270;
								//add computer test
								addComputer(row, col, 270, furnitureVariant);
								//block off tiles
								objectMap[row][col] = "T";
								objectMap[row-1][col] = "T";
								floorMap[row-1][col] = "o";
								objectMap[row-1][col+1] = "T";
								floorMap[row-1][col+1] = "o";
								objectMap[row][col+1] = "T";
								floorMap[row][col+1] = "o";

							}
							else if (furnitureRotation == "NW") {
								furnitureVariant = Math.floor(furnitureRandom() * furniture2x2Variants) + 1
								Crafty.e('TileOpen' + row + '_' + col + ', furnitureMap , 1_' + roomColour + '_2x2_' + furnitureVariant)
									.attr({y: Crafty('Tile' + (row-1) + '_' + col)._y, x: Crafty('Tile' + row + '_' + (col-1))._x, w: _tileSize*2, h: _tileSize*2, xTile: col, yTile: row});
								Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
								Crafty('TileOpen' + row + '_' + col).origin('center');
								Crafty('TileOpen' + row + '_' + col).rotation = 90;
								//add computer test
								addComputer(row, col, 90, furnitureVariant);
								//block off tiles
								objectMap[row][col] = "T";
								objectMap[row-1][col-1] = "T";
								floorMap[row-1][col-1] = "o";
								objectMap[row-1][col] = "T";
								floorMap[row-1][col] = "o";
								objectMap[row][col-1] = "T";
								floorMap[row][col-1] = "o";
							}
						}					
					}

				}
			}
		}
	}	
}

function debugHideFreeFloorSpace() {
	var rows = objectMap.length;
	var cols;
	var variant;
	//fix centering
	
	for (var row = 0; row < rows; row++) {
		cols = objectMap[row].length;
		for (var col = 0; col < cols; col++) {
			if (objectMap[row][col] == "o") {
				variant = Math.floor(roomRandom() * 5) + 1
				Crafty.e('TileOpen' + row + '_' + col + ', ' + renderEngine + ', junk_' + variant)
					.attr({y: Crafty('Tile' + row + '_' + col)._y, x: Crafty('Tile' + row + '_' + col)._x, w: _tileSize, h: _tileSize, xTile: col, yTile: row});
				tileName = 'TileOpen' + row + '_' + col
				Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpen' + row + '_' + col));
			}
		}
	}	
}

function addComputer(row, col, furnR, furnV) {
	// do not put computer on id 7 which is an office table
	if (furnV != 7) {
		if ((Math.floor(furnitureRandom() * 2) + 1) == 1){
			var rowMod = 0;
			var colMod = 0;
			var rotMod = 0;
			switch (furnR) {
				case 0:
					if (furnV == 2) {
						rotMod = rotMod + 90;
						colMod++;
					}
					break;
				case 90:
					rowMod--;
					if (furnV == 2) {
						rotMod = rotMod + 90;
						rowMod++;
					}
					break;
				case 180:
					rowMod++;
					if (furnV == 2) {
						rotMod = rotMod - 90;
						colMod = colMod - 1;
					}
					break;
				case 270:
					//rowMod++;
					if (furnV == 2) {
						rotMod = rotMod + 180;
						rowMod--;
					}
					break;
			}	

			Crafty.e('TileOpenComputer' + row + '_' + col + ', furnitureMap , furn_computer')
				.attr({y: Crafty('Tile' + (row + rowMod) + '_' + (col + colMod))._y, x: Crafty('Tile' + (row + rowMod) + '_' + (col + colMod))._x, w: _tileSize*1, h: _tileSize*1, xTile: (col + colMod), yTile: (row + rowMod)});
			Crafty(Crafty('FloorGround')[0]).attach(Crafty('TileOpenComputer' + row + '_' + col));
			Crafty('TileOpenComputer' + row + '_' + col).origin('center');
			Crafty('TileOpenComputer' + row + '_' + col).rotation = (furnR + rotMod);
		}
	}
}
