Crafty.scene('Menu', function() {

	//
	//Game events (MOUSE CLICKS ECT..)
	//

	var newGameBtn = Crafty.e('btnNewGame, 2d, ' + renderEngine + ', menu_newGame, Mouse, Touch')
		.attr({x: 0, y: 0, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			//create player
			//player
			playSound("menu_select");
			_tutorial = false;
			userPlayer = new playerObj;
			genGameSeed();
			Crafty.scene("Game");
		});

	var conGameBtn = Crafty.e('btnContinue, 2D, ' + renderEngine + ', Mouse, Touch, menu_continueGame')
		.attr({x: 0 , y: newGameBtn._y + newGameBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			playSound("menu_select");
			_tutorial = false;
			gameSeed = localStorage.lastSeed;
			userPlayer = new playerObj;
			Crafty.scene("Game");
		});

	var statGameChallangeBtn = Crafty.e('btnChallange, 2D, ' + renderEngine + ', Mouse, Touch, menu_challange')
		.attr({x: 0 , y: conGameBtn._y + conGameBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			//Move continue button up delete newgame button.
			//get new game button y
			playSound("menu_select");
			_tutorial = false;
			var newY = newGameBtn._y - newGameBtn._h; 
			Crafty('btnNewGame').destroy();

			//create Seed container
			var menuSeedEntity = Crafty.e('menuSeed, 2D, ' + renderEngine + ', menu_enterSeed')
				.attr({x: 0 , y: newY, w: _tileSize * 6, h: _tileSize * 2});

			//postion textbox
			newY = menuSeedEntity._y + (menuSeedEntity._h*.50)
			var newX = menuSeedEntity._x + (menuSeedEntity._w*.165);
		
			Crafty.e('menuSeedText, 2D, ' + renderEngine)
				.attr({x: newX , y: newY , w: _tileSize * 6, h: _tileSize * 2});

			$('#' + Crafty('menuSeedText')._element.id).append('<input id="inputSeed" class="containsText inputText" type="text" />');
			$('#inputSeed').width(menuSeedEntity._w*.66);
			$('#inputSeed').height(_tileSize/2);
			$('#inputSeed').val('DailyChallange')

		
			//$( "#seedTextBox" ).css('visibility', 'visible');
		

			//change continue button to start button
			newY = tutorialGameBtn._y;
			Crafty('btnTutorial').destroy();

			Crafty.e('btnStart, 2D, ' + renderEngine + ', Mouse, Touch, menu_back')
				.attr({x: 0 , y: conGameBtn._y + conGameBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
				.bind('MouseUp', function(MouseEvent){
					//DELETE TEXT BOX TOO
					playSound("menu_select");
					Crafty.scene("Menu");
				});

			//change stat button to back button

			Crafty.e('btnStart, 2D, ' + renderEngine + ', Mouse, Touch, menu_start')
				.attr({x: 0 , y: conGameBtn._y, w: _tileSize * 6, h: _tileSize * 1})
				.bind('MouseUp', function(MouseEvent){
					//DELETE TEXT BOX TOO
					//get new seed
					playSound("menu_select");
					var newSeed = $('#inputSeed').val();
					if ((newSeed == "") || (newSeed == "DailyChallange")) {
						dailyChallange = true;
						//var d = new Date();
						//var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
						//gameSeed = days[d.getDay()] + ' ' + d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();
						gameSeed = new Date().toISOString().substr(0,10);
					}
					else {
						gameSeed = $('#inputSeed').val();
						dailyChallange = false;
					}
					userPlayer = new playerObj;
					Crafty.scene("Game");
				});
		});
	//tutorial button
	var tutorialGameBtn = Crafty.e('btnTutorial, 2D, ' + renderEngine + ', Mouse, Touch, menu_helpInfo')
		.attr({x: 0 , y: statGameChallangeBtn._y + statGameChallangeBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			//create player
			//player
			//optionsMenu();
			playSound("menu_select");
			_tutorial = true;
			//potential tut seeds 11245
			playSound("menu_select");
			gameSeed = 11245;
			userPlayer = new playerObj;
			Crafty.scene("Game");		
		});

	var statsGameBtn = Crafty.e('btnStats, 2D, ' + renderEngine + ', Mouse, Touch, menu_stats')
		.attr({x: 0 , y: tutorialGameBtn._y + tutorialGameBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			playSound("menu_select");
			//open stats page	
		});

	var optionsGameBtn = Crafty.e('btnOptions, 2D, ' + renderEngine + ', Mouse, Touch, menu_options')
		.attr({x: 0 , y: statsGameBtn._y + statsGameBtn._h + 20, w: _tileSize * 6, h: _tileSize * 1})
		.bind('MouseUp', function(MouseEvent){
			playSound("menu_select");
			popUpCreate('options');	
		});

	Crafty.viewport.centerOn(Crafty("btnContinue")[0],0)
	displayAccounts();
});

//from hud.js merging into menu.js to keep UI elements in same file.
function initUi() {
	//Ui is divided into maxWidth = 9 + 2/maxHeight = 11+4; or 11/15 gird.
	//Each grid section is one _tileSize.
	//Header
	//at this point the room has been generated so need to add a place holder for the header/Footer
	
	Crafty.e("headerPlaceholder, 2D, " + renderEngine + ", Color")
		.attr({x:((roomCenter.x*_tileSize)+(_tileSize/2)), y: ((roomCenter.y*_tileSize)+(_tileSize/2)), w: _tileSize, h: _tileSize, alpha: 0})
		.color("#FFFFFF");

	//footer place holder
	Crafty.e("footerPlaceholder, 2D, " + renderEngine + ", Color")
		.attr({x: ((roomCenter.x*_tileSize)+(_tileSize/2)), y: ((roomCenter.y*_tileSize)+(_tileSize/2)), w: _tileSize, h: _tileSize, alpha: 0})
		.color("#DDDDDD");

	Crafty.e("footerPlaceholderR, 2D, " + renderEngine + ", Color")
		.attr({x: ((roomCenter.x*_tileSize)+(_tileSize/2)), y: ((roomCenter.y*_tileSize)+(_tileSize/2)), w: _tileSize, h: _tileSize, alpha: 0})
		.color("#CCCCCC");

	//the darkness
	theDarknessInit();

	setTimeout(function() {
		positionUi();
	}, 500);
}

function positionUi() {
	//positionHeader
	var offset = $("#" + Crafty('headerPlaceholder').getDomId()).offset();
	Crafty('headerPlaceholder').y = (Crafty('headerPlaceholder').y - offset.top + (_tileSize/2));
	Crafty('headerPlaceholder').x = (Crafty('headerPlaceholder').x - offset.left) + (_tileSize/2);
	//postionFooter
	offset = $("#" + Crafty('footerPlaceholder').getDomId()).offset();
	Crafty('footerPlaceholder').y = (Crafty('footerPlaceholder').y + (Crafty.viewport.height - offset.top) - _tileSize*1.5);
	Crafty('footerPlaceholder').x = Crafty('headerPlaceholder')._x;
	//postionFooterRight
	offset = $("#" + Crafty('footerPlaceholderR').getDomId()).offset();
	Crafty('footerPlaceholderR').y = Crafty('footerPlaceholder').y;
	Crafty('footerPlaceholderR').x = (Crafty.viewport.width - _tileSize*2);// + offset.left)

	setTimeout(function() {
		initFooter();		
		initScore();
		footerChange();	
	}, 250);

}

function initFooter() {
	//Door Hint Button
	Crafty.e('btnHintDoors, 2D, ' + renderEngine + ', Mouse, Touch, ui_door_off, Tween')
		.attr({x: Crafty('footerPlaceholder')._x, y: Crafty('footerPlaceholder')._y, w: _tileSize * 1.5, h: _tileSize * 1.5, z: 1500})
		.bind("MouseUp", function(MouseEvent) { 
			hintShowDoors();
			footerChange();
		});
	//Room Hint Button
	Crafty.e('btnHintRoom, 2D, ' + renderEngine + ', Mouse, Touch, ui_room_off, Tween')
		.attr({x: Crafty('footerPlaceholder')._x + (1.5*_tileSize), y: Crafty('footerPlaceholder')._y, w: _tileSize * 1.5, h: _tileSize * 1.5, z: 1500})
		.bind("MouseUp", function(MouseEvent) { 
			hintShowRoom();
			footerChange();
		});

	//end button
	Crafty.e('btnHome, 2D, ' + renderEngine + ', Mouse, Touch, ui_home_highlight')
		.attr({x: Crafty('footerPlaceholderR')._x, y: Crafty('footerPlaceholderR')._y, w: _tileSize * 1.5, h: _tileSize * 1.5, z: 1500})
		.bind("MouseUp", function(MouseEvent) { 
			popUpCreate("endGame");
		});
}

function fadeInView (toggle, fadeTime, delay, restartTime, alpha) {
	console.log("DO NOT USE");
}

function fadeOutView (toggle, fadeTime, delay, restartTime, alpha) {
	console.log("DO NOT USE");
}

function fadeView(options) {
	Crafty('fade').destroy();
	//get/set options
	//options {alpha: {start: 1, end:0},toggle: {active: false, delay: 250, restartTime: 250},fadeTime: 250}
	if (typeof options.fadeTime === 'undefined') { options.fadeTime = 250; }
	if (typeof options.toggle === 'undefined') { 
		options.toggle = {active:false};
	}
	if (typeof options.toggle.active === 'undefined') { 
		options.toggle.active = false;
	}
	else if (options.toggle.active == true) {
		if (typeof options.toggle.delay === 'undefined') { options.toggle.delay = options.fadeTime; }
		if (typeof options.toggle.restartTime === 'undefined') { options.toggle.restartTime = options.fadeTime; }
	}
	if (typeof options.alpha.start === 'undefined' && typeof options.alpha.end === 'undefined') { 
		options.alpha.end = 0;
		options.alpha.start = 0;
	}
	else if (typeof options.alpha.end === 'undefined' && options.alpha.start == 1) { options.alpha.end = 0; }
	else if (typeof options.alpha.start === 'undefined' && options.alpha.end == 1) { options.alpha.start = 0; }
	
	Crafty.e('fade, 2D,' + renderEngine + ', Color, Tween')
		.attr({x: -10-Crafty.viewport.x, y: -10-Crafty.viewport.y, w: 10+Crafty.viewport.width, h: 10+Crafty.viewport.height, alpha: options.alpha.start,z: 2000})
		.color('#000000')
		.tween({ alpha: options.alpha.end}, options.fadeTime)
		.bind("TweenEnd", function(){ 
			//console.log("tween complete");
			var restartTime = options.toggle.restartTime;
			var delay = options.toggle.delay;
			var restartEnd = options.alpha.start;
			var restartStart = options.alpha.end;
			if (options.toggle.active) {
				setTimeout(function() {					
					fadeView({alpha: {start: restartStart, end: restartEnd}, fadeTime: restartTime});
				}, delay, restartTime, restartEnd, restartStart);
			}
		});
}

function loadingLoop() {
	//fadeOutView(false,1000);
	var loadingIcon = Crafty.e('loadingAnimate, loading_reel').attr({x: centerPoint._x-(_tileSize*1.5), y: centerPoint._y-_tileSize, w: 2*_tileSize, h: 2*_tileSize, alpha: 1, z: 2500});
	Crafty('fade').attach(loadingIcon);
	Crafty('loadingAnimate').loadingForward();
}

function changeHomeButton(state) {
	if (state) {
		Crafty("btnHome").sprite(7,0)
	}
	else {
		Crafty("btnHome").sprite(6,0)
	}
}

function footerChange() {

	//move to crafty
	setTimeout(function() {
		updateDoorHints(userPlayer.hints.door);
		updateRoomHints(userPlayer.hints.room);
	}, 150);
}

function popUpClickHandlers() {
	//END GAME POPUP

	$( "#gamePopUp" ).on('mouseup', '#popUpEndBtnImg' ,function() {
		//fade in view
		//fadeInView(false, 500);
		fadeView({alpha:{start:1,end:0},fadeTime:500})
		//Expand the footer
		console.log("clicked endGame");
		//destroy the popup.

		//Send Score to Google.
		//if (dailyChallange) { postToGoogleDaily(); }
		popUpDestroy();
		Crafty('darkness').destroy();
		//Save userdata
		var userPlayerSaved = JSON.parse(localStorage.playerSaveData);
		//check if we are home
		if (currentRoom == "x0y0z0") {
			var score = new gameSaveObj(userPlayer.score.actual, gameSeed)
			//userPlayerSaved.g.push(new gameSaveObj(userPlayer.score.actual, gameSeed));
			sqlPostGame(score);
			//Are home
			userPlayerSaved.score = parseInt(userPlayerSaved.score) + userPlayer.score.actual;
			userPlayerSaved.rank = userPlayer.score.rank;
			userPlayerSaved.found = userPlayerSaved.found + 1;
		}
		else {
			userPlayerSaved.lost = userPlayerSaved.lost + 1;
			userPlayerSaved.lostScore = userPlayerSaved.lostScore + userPlayer.score.potentialLost;
		}
		userPlayerSaved.active = false;
		//Save Game Data
		//userPlayerSaved.g.push(new gameSaveObj(userPlayer.score.actual, gameSeed));

		//Save PlayerData
		localStorage.playerSaveData = JSON.stringify(userPlayerSaved);
		//back to menu
		Crafty.scene("Menu");
		
	});

	$( "#gamePopUp" ).on('mouseup', '#popUpConBtnImg' ,function() {
		//Expand the footer
		//fadeInView(false, 500);
		fadeView({alpha:{start:1,end:0},fadeTime:500})
		console.log("clicked Continue Game");
		//destroy the popup.
		popUpDestroy();
	});
 	
	//LOGIN FORM
	//#inputLoginRegisterForm = pull up register form instead
	//#inputLoginSubmit = submit login

	$( "#gamePopUp" ).on('mouseup', '#inputLoginRegisterForm' ,function() {
		//console.log("clicked inputLoginRegisterForm");
		fadeView({alpha:{start:1,end:0},fadeTime:500})
		//destroy the popup.
		popUpDestroy();
		popUpCreate('register');
	});

	$( "#gamePopUp" ).on('mouseup', '#inputLoginSubmitYes' ,function() {
		console.log("clicked inputLoginSubmitYes");
		popUpDestroy();
	});
	$( "#gamePopUp" ).on('mouseup', '#inputLoginSubmitNo' ,function() {
		console.log("clicked inputLoginSubmitNo");
		getLogin();
	});


	//REGISTER FORM
	//#inputRegisterLoginForm = pull up login page instead
	//#inputRegisterSubmit = submit register form

	$( "#gamePopUp" ).on('mouseup', '#inputRegisterLoginForm' ,function() {
		//console.log("clicked inputRegisterLoginForm");
		fadeView({alpha:{start:1,end:0},fadeTime:500})
		//destroy the popup.
		popUpDestroy();
		popUpCreate('login')
	});

	$( "#gamePopUp" ).on('mouseup', '#inputRegisterSubmit' ,function() {
		console.log("clicked inputRegisterSubmit");
		getRegister();
	});

	$( "#gamePopUpStatus" ).on('mouseup', '#statusConfirm' ,function() {
		popUpStatusDestroy();
	});
}

function popUpStatusDestroy() {
	//destroy the popup.
	$('#gamePopUpStatus').css("visibility","hidden");
	$('#gamePopUpStatus').html("")
	$('#gamePopUpStatus').height(0);
	$('#gamePopUpStatus').width(0);
	fadeView({alpha:{start:1,end:0},fadeTime:500});
}

function popUpCreateStatus(data) {
	$('#gamePopUpStatus').css("visibility","visible");
	$('#gamePopUpStatus').css('top', (Crafty.viewport.height*.05)+'px');
	$('#gamePopUpStatus').css('left', (Crafty.viewport.width*.05)+'px');
	$('#gamePopUpStatus').height(Crafty.viewport.height*.25);
	$('#gamePopUpStatus').width(Crafty.viewport.width*.8);
	var html = '<div id="statusContainer"><p>' + data.message + '</p>\
							<input id="statusConfirm" type="button" class="containsTextNormal" value="OK" /></div>';
	$('#gamePopUpStatus').html(html);
	//fix Dimensions
	$('#gamePopUpStatus').width($('#statusContainer').width()*1.1);
	$('#gamePopUpStatus').height($('#statusContainer').height()*1.5);
	$('#statusButtonContain').css('margin', '0 auto');
	//Center
	$('#gamePopUpStatus').css('top', ((Crafty.viewport.height/2)-($('#gamePopUpStatus').height()/2))+'px');
	$('#gamePopUpStatus').css('left', ((Crafty.viewport.width/2)-($('#gamePopUpStatus').width()/2))+'px');	
	$('#gamePopUpStatus').css('text-align', 'center');
}

function popUpDestroy() {
	//destroy the popup.
	$('#gamePopUp').css("visibility","hidden");
	$('#gamePopUp').html("")
	$('#gamePopUp').height(0);
	$('#gamePopUp').width(0);
}

function popUpCreate(type, data) {
	//fadeOutView(false, 300,0,0,.5);
	fadeView({alpha:{start:0,end:.5},fadeTime:300})
	Crafty('fade').addComponent('Mouse')
	Crafty('fade').bind("MouseUp", function(MouseEvent) { 
		fadeView({alpha:{start:.5,end:0},fadeTime:300})
		popUpDestroy();
	});
	
	if (type == 'endGame') {
		$('#gamePopUp').css("visibility","visible");
		$('#gamePopUp').css('top', (Crafty.viewport.height*.05)+'px');
		$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
		$('#gamePopUp').height(Crafty.viewport.height*.8);
		$('#gamePopUp').width(Crafty.viewport.width*.9);
		if (currentRoom == "x0y0z0") {
			var isHome = true;
			var lostClass = null;
			var textLost = ['Home','Safe','At Base','Known','Found']
			textLost = textLost[Math.floor(Math.random() * textLost.length)]
			var leavingMessage = "End game now to save your achivements. Or continue to try increase them but be <strong>WARNED</strong> if you get lost your achivements are lost with you!"
		}
		else {
			var isHome = false;
			var lostClass = "endGamePopUpTableColoured"
			var textLost = ['LOST','AWOL','Missing','Lost','Unknown','Adrift','Disoriented','Vanished','Wandering','Wherabouts Unknown','Missing Presumed Dead','MIA','???']
			textLost = textLost[Math.floor(Math.random() * textLost.length)]
			var leavingMessage = "Lost? Cannot find your way? To many dead end corridors? Nothing looks farmilliar?<br /><br /> <strong>CAUTION</strong> all achivements from this exploration will be lost."
		}
	
		var rank = getRank(userPlayer.score.actual);
		var userPlayerSaved = JSON.parse(localStorage.playerSaveData);
		var totalRank = getRank((parseInt(userPlayerSaved.score) + userPlayer.score.actual));
		if (isHome) {
			$('#gamePopUp').html('<table id="endGamePopUpTable"><tr><th colspan="4"><strong>You have made it back to your starting room.</strong></th></tr><tr><td colspan="4"></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="2">Current Status:</td><td colspan="1" align="center" class="popUpValue ' + lostClass + ' ">' + textLost + '</td><td></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="3">Rooms explored:</td><td class="popUpValue">' + userPlayer.score.actual + '</td></tr><tr><td colspan="3">All time rooms explored:</td><td class="popUpValue">' + (parseInt(userPlayerSaved.score) + userPlayer.score.actual) + '</td></tr><tr><td colspan="4"></td></tr><tr><td colspan="3">Levels achieved this exploration:</td><td class="popUpValue">' + rank.currentLevel + '</td></tr><tr><td colspan="3">Rooms required to level up:</td><td class="popUpValue">' + rank.difference + '</td></tr><tr><td colspan="3">New overall rank:</td><td class="popUpValue">' + totalRank.currentLevel + '</td></tr><tr><td colspan="3">Rooms required to level up:</td><td class="popUpValue">' + totalRank.difference + '</td></tr><tr><td colspan="4"></td></tr><tr><td colspan="4"></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="4" align="center">' + leavingMessage + '</td></tr><tr id="popUpBtnRow"><td colspan="2" align="center" class="noBorder"><div class="popUpImgContain" id="popUpConBtnImg"></div></td><td class="noBorder"></td><td class="noBorder"><div class="popUpImgContain"  id="popUpEndBtnImg"></div></td></tr></table>');
		}
		else {
			rank = getRank(userPlayer.score.visible);
			totalRank = getRank((parseInt(userPlayerSaved.score) + userPlayer.score.visible));
			$('#gamePopUp').html('<table id="endGamePopUpTable"><tr><th colspan="4"><strong>Are you sure you are ready to leave?</strong></th></tr><b><tr><td colspan="4"></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="2">Current Status:</td><td colspan="1" align="center" class="popUpValue ' + lostClass + ' ">' + textLost + '</td><td></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="3">Rooms explored:</td><td class="popUpValue">' + userPlayer.score.visible + '</td></tr><tr><td colspan="3">All time rooms explored:</td><td class="popUpValue">' + (parseInt(userPlayerSaved.score) + userPlayer.score.visible) + '</td></tr><tr><td colspan="4"></td></tr><tr><td colspan="3">Level:</td><td class="popUpValue">' + rank.currentLevel + '</td></tr><tr><td colspan="3">Rooms required to level up:</td><td class="popUpValue">' + rank.difference + '</td></tr><tr><td colspan="3">New overall rank:</td><td class="popUpValue">' + totalRank.currentLevel + '</td></tr><tr><td colspan="3">Rooms required to level up:</td><td class="popUpValue">' + totalRank.difference + '</td></tr><tr><td colspan="4"></td></tr><tr><td colspan="4"></td></tr><tr><td colspan="4"><hr></td></tr><tr><td colspan="4" align="center">' + leavingMessage + '</td></tr><tr id="popUpBtnRow"><td colspan="2" class="noBorder"><div class="popUpImgContain" id="popUpConBtnImg"></div></td><td class="noBorder"></td><td class="noBorder"><div class="popUpImgContain"  id="popUpEndBtnImg"></div></td></tr></b></table>');
		}

		$('#popUpEndBtnImg').height(_tileSize);
		$('#popUpConBtnImg').height(_tileSize);
		$('#popUpBtnRow').height(_tileSize+2);
	}
	else if (type == 'hintRoom') {
		$('#gamePopUp').css("visibility","visible");
		$('#gamePopUp').css('top', (Crafty.viewport.height*.33)+'px');
		$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
		$('#gamePopUp').height(Crafty.viewport.height*.15);
		$('#gamePopUp').width(Crafty.viewport.width*.9);

		var visited = (rooms[currentRoom].visited);

		if (visited == 1) {
			$('#gamePopUp').html('<center><b>This is the FIRST time this room has been visited.</b></center>');
		}
		else {
			$('#gamePopUp').html('<center><b>This room HAS been visited previously.</b></center>');
		}
		
	}
	else if (type == 'userFound') {
		$('#gamePopUp').css("visibility","visible");
		$('#gamePopUp').css('top', (Crafty.viewport.height*.25)+'px');
		$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
		$('#gamePopUp').height(Crafty.viewport.height);
		$('#gamePopUp').width(Crafty.viewport.width*.5);
		if (typeof data === 'undefined') {
			data = {userName:"",deviceUUID:""} 
		}
		else {
			if (typeof data.userName === 'undefined') {
				data.userName = "" ;
			}
			if (typeof data.deviceUUID === 'undefined') {
				data.deviceUUID = "" ;
			}
		}

		var html = '<table id="inputLoginForm">\
									<tr>\
										<td colspan="2">\
											<p class="containsTextNormalSmall">This device has the following user name associated with it.</p>\
										</td>\
									</tr>\
									<tr>\
										<br />\
										<td class="containsTextNormal">Username: </td>\
										<td>\
											<input id="inputLoginUsername" class="inputFormSQL" type="text" value="' + data.username + '"/>\
											<input id="inputLoginUUID" class="inputFormSQL" type="hidden" value="' + data.deviceUUID + '"/>\
										</td>\
										<br />\
									</tr>\
									<tr>\
										<td colspan="2">\
											<p class="containsTextNormalSmall">Click Continue to keep using this name or Change to update your username.</p>\
										</td>\
									</tr>\
									<tr>\
										<td>\
											<center><input id="inputLoginSubmitYes" type="button" class="containsTextNormal" value="Continue" /><input id="inputLoginSubmitNo" type="button" class="containsTextNormal" value="Change" /></center>\
										</td>\
									</tr>\
								</table>'
		$('#gamePopUp').html(html);
		//fix Dimensions
		$('#gamePopUp').width($('#inputLoginForm').width()*1.1);
		$('#gamePopUp').height($('#inputLoginForm').height()*1.5);
		$('#gamePopUp').css('top', ((Crafty.viewport.height/2)-($('#gamePopUp').height()/2))+'px');
		$('#gamePopUp').css('left', ((Crafty.viewport.width/2)-($('#gamePopUp').width()/2))+'px');
		
	}
	else if (type == 'register') {
		$('#gamePopUp').css("visibility","visible");
		$('#gamePopUp').css('top', (Crafty.viewport.height*.25)+'px');
		$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
		$('#gamePopUp').height(Crafty.viewport.height);
		$('#gamePopUp').width(Crafty.viewport.width*.5);

		if (typeof data === 'undefined') {
			data = {userName:"",deviceUUID:""} 
		}
		else {
			if (typeof data.userName === 'undefined') {
				data.userName = "" ;
			}
			if (typeof data.deviceUUID === 'undefined') {
				data.deviceUUID = "" ;
			}
		}

		var html = '<form id="userRefistration"><table id="inputregistrationForm">\
									<tr>\
										<td colspan="2">\
											<p class="containsText">Account Registration</p>\
										</td>\
									</tr>\
									<tr>\
										<td class="containsTextNormal">Username: </td>\
										<td>\
											<input id="inputRegisterUsername" class="inputFormSQL" type="text" value="' + data.userName + '"/>\
											<input id="inputRegisterUUID" class="inputFormSQL" type="hidden" value="' + data.deviceUUID + '"/>\
										</td>\
									</tr>\
									<tr>\
										<td>\
											<p>Already Registerd? <a id="inputRegisterLoginForm" href="#">Login Here</a></p>\
										</td>\
										<td>\
											<center><input id="inputRegisterSubmit" type="button" class="containsTextNormal" value="Register" /></center>\
										</td>\
									</tr>\
								</table></form>'
		$('#gamePopUp').html(html);

		//fix Dimensions
		$('#gamePopUp').width($('#inputregistrationForm').width()*1.1);
		$('#gamePopUp').height($('#inputregistrationForm').height()*1.5);
		$('#gamePopUp').css('top', ((Crafty.viewport.height/2)-($('#gamePopUp').height()/2))+'px');
		$('#gamePopUp').css('left', ((Crafty.viewport.width/2)-($('#gamePopUp').width()/2))+'px');
		
	}
	else if (type == 'tutorial_1') {
		//load tutorial.js
		tutorial_1();		
	}
	else if (type == 'tutorial_2') {
		//load tutorial.js
		tutorial_2();		
	}
	else if (type == 'tutorial_3') {
		//load tutorial.js
		tutorial_3();		
	}
	else if (type == 'tutorial_4') {
		//load tutorial.js
		tutorial_4();		
	}
	else if (type == 'tutorial_5') {
		//load tutorial.js
		tutorial_5();		
	}
	else if (type == 'tutorial_6') {
		//load tutorial.js
		tutorial_6();		
	}
	else if (type == 'options') {
		$('#gamePopUp').css("visibility","visible");
		$('#gamePopUp').css('top', (Crafty.viewport.height*.25)+'px');
		$('#gamePopUp').css('left', (Crafty.viewport.width*.05)+'px');
		$('#gamePopUp').height(Crafty.viewport.height);
		$('#gamePopUp').width(Crafty.viewport.width*.5);

		var html = '<form id="Options"><table id="optionsForm">\
									<tr>\
										<td colspan="2">\
											<p class="containsText">Game Options</p>\
										</td>\
									</tr>\
									<tr>\
										<td class="containsTextNormal">Movement Speed: </td>\
									</tr>\
									<tr>\
										<tr>\
											<td class="containsTextNormal">Music: </td>\
										</tr>\
										<tr>\
											<td class="containsTextNormal">Door Sound: </td>\
										</tr>\
										<tr>\
											<td class="containsTextNormal">Foot Steps: </td>\
										</tr>\
										<tr>\
											<td class="containsTextNormal">All Sounds: </td>\
										</tr>\
										<td>\
											<center><input id="optionsSubmit" type="button" class="containsTextNormal" value="Save" /></center>\
										</td>\
									</tr>\
								</table></form>'
		$('#gamePopUp').html(html);

		//fix Dimensions
		$('#gamePopUp').width($('#optionsForm').width()*4);
		$('#gamePopUp').height($('#optionsForm').height()*2.5);
		$('#gamePopUp').css('top', ((Crafty.viewport.height/2)-($('#gamePopUp').height()/2))+'px');
		$('#gamePopUp').css('left', ((Crafty.viewport.width/2)-($('#gamePopUp').width()/2))+'px');	
	}
	mobileFontSize();
	
}

function mobileFontSize() {
	if (mobileCheck()) {
		$('.containsText').css({'font-size': (_tileSize*.75) + 'px'});
		$('#endGamePopUpTable td').css({'font-size': (_tileSize*.4) + 'px'});
		$('#endGamePopUpTable th').css({'font-size': (_tileSize*.45) + 'px'});
	}
	else {
		$('.containsText').css({'font-size': (_tileSize*.75) + 'px'});
		$('#endGamePopUpTable td').css({'font-size': (_tileSize*.4) + 'px'});
		$('#endGamePopUpTable th').css({'font-size': (_tileSize*.45) + 'px'});
	}
}

//display hints
function updateRoomHints(amount) {
	//check if there are hints and change image
	if (Crafty("btnHintRoomAmt").length != 0) {
		Crafty("btnHintRoomAmt").destroy();
	}
	if (amount == 0) {
		Crafty("btnHintRoom").sprite(5,0);
	}
	else {
		Crafty("btnHintRoom").sprite(4,0);
		Crafty.e('btnHintRoomAmt, 2D,' + renderEngine + ', Text, Tween').attr({x: Crafty("btnHintRoom")._x + (Crafty("btnHintRoom")._w*.75), y: Crafty("btnHintRoom")._y + (Crafty("btnHintRoom")._h*.25) - (_tileSize/4), w: _tileSize/4, h: _tileSize/4, z: 2501}).text(amount).textColor('#FFFFFF').textFont({ wight: 'bold', family: 'Mono',size: (_tileSize/4) + 'px'}).unselectable();
		Crafty("btnHintRoom").attach(Crafty("btnHintRoomAmt"));
	}
}

function updateDoorHints(amount) {
	//check if there are hints and change image
	if (Crafty("btnHintDoorsAmt").length != 0) {
		Crafty("btnHintDoorsAmt").destroy();
	}
	if (amount == 0) {
		Crafty("btnHintDoors").sprite(3,0);
		return;
	}
	else {
		Crafty("btnHintDoors").sprite(2,0);
		Crafty.e('btnHintDoorsAmt, 2D,' + renderEngine + ', Text, Tween').attr({x: Crafty("btnHintDoors")._x + (Crafty("btnHintDoors")._w*.75), y: Crafty("btnHintDoors")._y + (Crafty("btnHintDoors")._h*.25) - (_tileSize/4), w: _tileSize/4, h: _tileSize/4, z: 2501}).text(amount).textColor('#FFFFFF').textFont({ wight: 'bold', family: 'Mono',size: (_tileSize/4) + 'px'}).unselectable();
		Crafty("btnHintDoors").attach(Crafty("btnHintDoorsAmt"));
	}
}

function optionsMenu() {
	fadeOutView(false, 300,0,0,.5);
	alert(localStorage.playerUUID);
}

function displayAccounts() {
	$('#accountsContainer').css("visibility","visible");
	$('#accountsContainer').css('top', '0px');
	$('#accountsContainer').height(Crafty.viewport.height*.25);
	$('#accountsContainer').width(Crafty.viewport.width*.8);
	$('#accountsContainer').css('left', (Crafty.viewport.width - $('#accountsContainer').width())+'px');
	//checked if logged in
	var logedin = false;
	var html;	
	if (typeof sessionStorage.username !== 'undefined') {
		logedin = true;
	}
	if (logedin) {
		var roomJumeUser = localStorage.username;
		html = '<div id="accountsDivs"><p>' + roomJumeUser + ' is logged in. <a id="accountsLogout" href="#">logout</a></p></div>';
	}
	else {
		html = '<a id="accountsRegister" href="#">Register/Login</a></div>';
		if (typeof localStorage.username !== 'undefined'){
			popUpCreate('register',{"userName":localStorage.username});
		} else { popUpCreate('register') }
	}
	$('#accountsContainer').html(html);
	$('#accountsContainer').height($('#accountsDivs').height());
}

function hideAccounts() {
	//destroy the accounts info.
	$('#accountsContainer').css("visibility","hidden");
	$('#accountsContainer').html("");
	$('#accountsContainer').height(0);
	$('#accountsContainer').width(0);
}

function accountsClickHandlers() {
	//END GAME POPUP

	$( "#accountsContainer" ).on('mouseup', '#accountsRegister' ,function() {
		console.log('clicked register');
		//check if username is created in localstorage
		if (typeof localStorage.username !== 'undefined'){
			popUpCreate('register',{"userName":localStorage.username});
		} else { popUpCreate('register') }	
	});

	$( "#accountsContainer" ).on('mouseup', '#accountsLogout' ,function() {
		sessionStorage.removeItem('username');
		displayAccounts();
	});	
}
