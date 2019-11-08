function computeScore() {
	//player has just entered a room.
	userPlayer.score.visible ++;
	userPlayer.score.fluffCount ++;
	if (userPlayer.score.fluffCount >= userPlayer.score.fluff) {
		userPlayer.score.visible = userPlayer.score.actual;
		if (userPlayer.score.visible > 12) {
			userPlayer.score.fluff = Math.floor(roomRandom() * 7) + 4;
		}
		else {
			userPlayer.score.fluff = 0;
		}
		userPlayer.score.fluffCount = 0;

		//upateLevel //ui-game-rank
		displayRank();
		
		var progressScore = getRank(userPlayer.score.actual);
		userPlayer.score.percent = (100/(progressScore.nextLvlRooms - progressScore.pastLvlRooms)) * (userPlayer.score.actual - progressScore.pastLvlRooms);
	}
	else {
		userPlayer.score.percent = userPlayer.score.percent + ((100-userPlayer.score.percent)/userPlayer.score.fluff)
		//show feedback in progress bar
	}
	setTimeout(function() {
		displayScore(userPlayer.score.percent);	
	}, 250);	
}

function displayScore(score) {
	//$( "#ui-game-score" ).html(score);
	if (Crafty('scoreProgress').length != 0) {
		Crafty('scoreProgress').updateBarProgress(score);
	}
}

function displayRank() {
	var rank = getRank(userPlayer.score.actual);
	//$( "#ui-game-rank" ).html(rank.currentLevel);
	drawRank(rank.currentLevel);

	//check if rank has changed.
	if (userPlayer.score.rank != rank.currentLevel) {
		if (userPlayer.score.rank < 5 && rank.currentLevel >= 5) {
			awardHint();
		}
		if (userPlayer.score.rank < 9 && rank.currentLevel >= 9) {
			awardHint();
		}
		if (userPlayer.score.rank < 14 && rank.currentLevel >= 14) {
			awardHint();
		}
		if (userPlayer.score.rank < 16 && rank.currentLevel >= 16) {
			awardHint();
		}
		if (rank.currentLevel > 16) {
			if (userPlayer.score.rank <= 16) {
				userPlayer.score.rank = 16;
			}
			for (userPlayer.score.rank; userPlayer.score.rank < rank.currentLevel; userPlayer.score.rank++) {
				awardHint();
			}
		}
	}
	userPlayer.score.rank = rank.currentLevel;	
}

function awardHint() {
	var decider = Math.floor(roomRandom() * 2);
	//console.log(Function.caller)
	if (decider) {
		userPlayer.hints.room++;
		console.log("Room hint awarded")
		playSound("award_hint");
		Crafty('btnHintRoomAmt').destroy();
		//show hint added animation
		Crafty('btnHintRoom').tween({w: _tileSize*3.5, h: _tileSize*3.5, y: Crafty('btnHintRoom')._y-(_tileSize*3.5/2)}, 200);
		setTimeout(function() {
			Crafty('btnHintRoom').tween({w: _tileSize*1.5, h: _tileSize*1.5, y: Crafty('btnHintRoom')._y+(_tileSize*3.5/2)}, 400);
			setTimeout(function() {
				updateRoomHints(userPlayer.hints.room);
			}, 450);
		}, 350);
	}
	else {
		userPlayer.hints.door++;
		console.log("Door hint awarded")
		playSound("award_hint");
		Crafty('btnHintDoorsAmt').destroy();
		//show hint added animation
		Crafty('btnHintDoors').tween({w: _tileSize*3.5, h: _tileSize*3.5, y: Crafty('btnHintDoors')._y-(_tileSize*3.5/2)}, 200);
		setTimeout(function() {
			Crafty('btnHintDoors').tween({w: _tileSize*1.5, h: _tileSize*1.5, y: Crafty('btnHintDoors')._y+(_tileSize*3.5/2)}, 400);
			setTimeout(function() {
				updateDoorHints(userPlayer.hints.door);
			}, 450);
		}, 350);		
	}
}

function getRank(rooms) {
	//genereate degrees list
	//rooms = max
	var nextLvl = {};
	if (rooms <= 2) {
		nextLvl = {currentLevel: 1, nextLvlRooms: 3, difference: 3 - rooms, pastLvlRooms: 0}
		return nextLvl;
	}
	else if (rooms <= 4) {
		nextLvl = {currentLevel: 2, nextLvlRooms: 5, difference: 5 - rooms, pastLvlRooms: 3}
		return nextLvl;
	}
	else if (rooms == 0) {
		nextLvl = {currentLevel: 0, nextLvlRooms: 1, difference: 1, pastLvlRooms: 0}
		return nextLvl;
	}
	var degree = []
	degree[1] = 1;
	degree[2] = 3;
	var max = false;
	var weight;
	var level = 3;
	var pastLvlRooms = 5;
	while (max == false) {
		weight = 0.1*Math.pow(0.924,(level-3));
		degree[level]=degree[level-1]+((degree[level-1]-degree[level-2])*(1+weight));
		//console.log("Checking Level: " + level + " rooms this level: " + degree[level] + " our rooms: " + rooms + " Weight: " + weight);
		if (Math.round(degree[level]) > rooms) {
			console.log('level is ' + (level - 1));
			nextLvl = {currentLevel: level-1, nextLvlRooms: Math.round(degree[level]), difference: Math.round(degree[level]) - rooms, pastLvlRooms: pastLvlRooms}
			return nextLvl;
			max = true;
		}
		pastLvlRooms = Math.round(degree[level]);
		level++
	}
}

//HighScores
function saveHighScores() {
	var score = [];
	score.push({seed: gameSeed, score: userPlayer.score.actual,rank: getRank(userPlayer.score.actual).currentLevel, date: "date"});
	score.sort(function(a,b){return b.score-a.score});
}

function initScore() {
	Crafty.e('2D, ' + renderEngine + ', ProgressBar, scoreProgress')
		.attr({ x: Crafty('headerPlaceholder')._x, y: Crafty('headerPlaceholder')._y, w: _tileSize*6, h: _tileSize*0.75, z: 2500})
		// progressBar(Number maxValue, Boolean flipDirection, String emptyColor, String filledColor)
		.progressBar(100, false, "transparent", "343fbc");
	//Crafty('scoreProgress').updateBarProgress(50);
	Crafty.e('2D, ' + renderEngine + ', score_progress, scoreBorder')
		.attr({ x: Crafty('headerPlaceholder')._x, y: Crafty('headerPlaceholder')._y, w: _tileSize*6, h: _tileSize*0.75, z: 2501});

	Crafty(Crafty("scoreProgress")[0]).attach(Crafty("scoreBorder"));
	//Draw initial rank
	drawRank(1);
}

function drawRank(rank) {
	if (Crafty("rankBody").length != 0) { Crafty("rankBody").destroy(); }
	var rankColours = ["#E9E74A","#EE5E9F","#FFDD2A","#F59DB9","#F9A55B","#D0E17D","#36A9CE","#EF5AA1","#AE86BC","#FFDF25","#56C4E8","#D0E068","#CD9EC0","#ED839D","#FFE476","#CDDD73","#F35F6D","#FAA457","#35BEB7","#D189B9","#99C7BC","#89B18C","#738FA7","#8A8FA3","#82ACB8","#F9D6AC","#E9B561","#E89132","#DA7527","#DEAC2F","#BAB7A9","#BFB4AF","#CDC4C1","#CFB69E","#D0AD87"];
	var drawPostion = {x: Crafty('scoreProgress')._x+(_tileSize*.5), y: Crafty('scoreProgress')._y-(Crafty('scoreProgress')._y*0), w: (_tileSize*.75), h: (_tileSize*.75), z: 2502};
	tempRank = rank;
	tempRank = String(tempRank);
	tempRank=parseInt(tempRank.substring(tempRank.length-2,tempRank.length));
	var rankColour = rankColours[Math.round(tempRank/2.5)];
	//Sticky note border
	Crafty.e('2D, DOM, Color, rankBorder').attr({x: (drawPostion.x-2), y: drawPostion.y-2, w: drawPostion.w+4, h: drawPostion.h+4, z: 2503}).color("#000000");
	//Sticky note body
	Crafty.e('2D, DOM, Color, rankBody').attr({x: (drawPostion.x), y: drawPostion.y, w: drawPostion.w, h: drawPostion.h, z: 2504}).color(rankColour);
	//Sticky note sticky pad
	Crafty.e('2D, DOM, Color, rankGlue').attr({x: (drawPostion.x), y: drawPostion.y, w: drawPostion.w, h: drawPostion.h, z: 2505}).color("#000000",.1);
	Crafty.e('2D, DOM, Text, rankNumber').attr({x: (drawPostion.x)+(drawPostion.w*.0425), y: drawPostion.y+(drawPostion.h*.15), w: drawPostion.w, h: drawPostion.h, z: 2506}).text(rank)
	Crafty('rankNumber').textFont({weight: 'bold', family: '1942_report1942_report', size: _tileSize*.6 + 'px'})
	Crafty(Crafty("rankBody")[0]).attach(Crafty("rankBorder"));
	Crafty(Crafty("rankBody")[0]).attach(Crafty("rankGlue"));
	Crafty(Crafty("rankBody")[0]).attach(Crafty("rankNumber"));
}
