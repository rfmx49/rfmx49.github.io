function tutWelcome() {
	setTimeout(function() {
		popUpCreate("tutorial_1");
	}, 500);
}

function tutorial_1() {
	setTimeout(function() {
		tutToggleHints(false);
		tutToggleScore(false);
	}, 500);	
	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.2)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.65);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>Welcome to HoL</b></center><div class="tutorialDiv"><p>HoL places you inside a maze of office rooms. Your objective is to visit as many offices as possible. The catch is you must return to same room you began in.</p><p>Sounds easy enough right?</p><p>Well this office building is no ordianry office building, this is no ordianry maze.</p><br /><p><b>Step 1: </b> Explore your first room by clicking/tapping the door in this room.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);
	Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile0_1")._x - (Crafty("Tile0_1")._w*.25), y: Crafty("Tile0_1")._y - (Crafty("Tile0_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5, z: 20})
	Crafty(Crafty('FloorGround')[0]).attach(Crafty('tutorialMark'))
	_tutorial = 2;
}

function tutorial_check() {
	if (_tutorial >= 1) {
		//find out stage of tutorial
		if (_tutorial == 2) {
			popUpCreate("tutorial_2");
		}
		else if (_tutorial == 3) {
			popUpCreate("tutorial_3");
		}
		else if (_tutorial == 4) {
			popUpCreate("tutorial_4");
		}
		else if (_tutorial == 5) {
			popUpCreate("tutorial_5");
		}
		else if (_tutorial == 6 && currentRoom == 0) {
			popUpCreate("tutorial_6");
		}
	}
}

function tutorial_2() {
	setTimeout(function() {
		tutToggleHints(false);
	}, 500);	
	tutToggleScore(true);
	//remove way back
	Crafty("Tile5_3").unbind("MouseUp")
	Crafty("Tile5_3").bind("MouseUp", function(MouseEvent) { 
			popUpCreateStatus({message:"Please explore a different room."});
	});
	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.2)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.55);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>Easy - now lets get lost.</b></center><div class="tutorialDiv"><p>Your score is tracked in the top left of the screen. Fill up the bar by exploring new rooms to rank up. Note that your scorebar is not always accurate and will update less frequently the more rooms you explore.<br /><p><b>Step 2: </b> Explore another room.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);

	//Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile4_0")._x - (Crafty("Tile4_1")._w*.25), y: Crafty("Tile4_0")._y - (Crafty("Tile4_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5})
	_tutorial = 3;
}

function tutorial_3() {
	setTimeout(function() {
		tutToggleHints(false);
	}, 500);
	//remove way back
	Crafty("Tile1_5").unbind("MouseUp")
	Crafty("Tile1_5").bind("MouseUp", function(MouseEvent) { 
			popUpCreateStatus({message:"Please explore a different room."});
	});
	

	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.3)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.35);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>Hmm - plenty of options now.</b></center><div class="tutorialDiv"><br /><p><b>Step 3: </b> Explore another room.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);

	//Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile4_0")._x - (Crafty("Tile4_1")._w*.25), y: Crafty("Tile4_0")._y - (Crafty("Tile4_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5})
	_tutorial = 4;
}

function tutorial_4() {
	//remove way back	

	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.3)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.45);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>Lost yet? Can you make it back to the begining?</b></center><div class="tutorialDiv"><br /><p><b>Step 4: </b> Attempt to return back to the original starting location.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);

	//Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile4_0")._x - (Crafty("Tile4_1")._w*.25), y: Crafty("Tile4_0")._y - (Crafty("Tile4_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5})
	_tutorial = 5;
}

function tutorial_5() {
	//remove way back	
	setTimeout(function() {
		tutToggleHints(true);
	}, 500);
	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.15)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.6);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>Don\'t remember? Need help?</b></center><div class="tutorialDiv"><p>There are two types of hints in HoL.<ul><li><b>Reveal Doors</b> - <i>This hint will reval all doors in this room you have passed through.</i></li><li><b>Reveal Room</b> - <i>This hint tells you if you have prevoiusly visited this room before.</i></li></ul>Hints are awared by increasing your rank.</p><p>At any time you can click the Home icon in the bottom right to see your current stats and also to give up if your are lost.<br /><p><b>Step 5: </b> Attempt to return back to the original starting location.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);

	//Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile4_0")._x - (Crafty("Tile4_1")._w*.25), y: Crafty("Tile4_0")._y - (Crafty("Tile4_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5})
	_tutorial = 6;
}

function tutorial_6() {
	//remove way back	
	$('#gamePopUp').css("visibility","visible");
	$('#gamePopUp').css('top', (Crafty.viewport.height*.15)+'px');
	$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUp').height(Crafty.viewport.height*.6);
	$('#gamePopUp').width(Crafty.viewport.width*.9);

	$('#gamePopUp').html('<center><b>You made it! Welcome back?</b></center><div class="tutorialDiv"><p>If you are satisifed with your score you can end the game by clicking the House icon in the lower right. if you want to improve your score you can go back out and explore some more.</p><br /><p><b>Step 6: </b> End your game.</p><br /><div class="popUpImgContain, tutorialImageCenter" id="popUpConBtnImg"></div></div>');

	$('.tutorialDiv').css({'font-size': (_tileSize*.4) + 'px'});
	$('#popUpConBtnImg').height(_tileSize);

	//Crafty.e('tutorialMark, 2D,' + renderEngine).attr({x: Crafty("Tile4_0")._x - (Crafty("Tile4_1")._w*.25), y: Crafty("Tile4_0")._y - (Crafty("Tile4_1")._h*.25), w: _tileSize*2.5, h: _tileSize*2.5})
	_tutorial = 0;
}

function tutToggleHints(toggle) {
	if (toggle) {
		Crafty("btnHintRoom").alpha = 1;
		Crafty("btnHintRoomAmt").alpha = 1;
		Crafty("btnHintDoors").alpha = 1;
		Crafty("btnHintDoorsAmt").alpha = 1;
	}
	else {
		Crafty("btnHintRoom").alpha = 0;
		Crafty("btnHintRoomAmt").alpha = 0;
		Crafty("btnHintDoors").alpha = 0;
		Crafty("btnHintDoorsAmt").alpha = 0;
	}
}

function tutToggleScore(toggle) {
	if (toggle) {
		Crafty("scoreProgress").alpha = 1;
		Crafty("scoreBorder").alpha = 1;
		Crafty("rankBorder").alpha = 1;
		Crafty("rankBody").alpha = 1;
		Crafty("rankNumber").alpha = 1;
		Crafty("rankGlue").alpha = 1;
	}
	else {
		Crafty("scoreProgress").alpha = 0;
		Crafty("scoreBorder").alpha = 0;
		Crafty("rankBorder").alpha = 0;
		Crafty("rankBody").alpha = 0;
		Crafty("rankNumber").alpha = 0;
		Crafty("rankGlue").alpha = 0;
	}
}

