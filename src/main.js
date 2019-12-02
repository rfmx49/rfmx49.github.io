//GLOBAL VARIBLES
//Crafty.DOM.translate(Crafty.lastEvent.clientX,Crafty.lastEvent.clientY); //gets mouse location.
//Game settings.

//Z index
//1
//2 - Floor Tiles
//3 - Wall Tiles
//4 - Door Animations
//5 - Highlights
//6 - Player

var _tileSize = 66;
var renderEngine = "DOM";
//renderEngine = "Canvas"; //
var gameSeeds = 100000;

//DEBUG
var DEBUGinstructions;
var DEBUGreplay;
var cordovaBuild = false;

//DrawRoom Queue
//A queue for all craft functions use EVAL to preform crafty operations.
var drawRoomQueue = [];

var gameSeed;
genGameSeed();

//gameSeed = 4; //DEBUGING
//gameSeed = 23086;
var roomCenter = {x: _tileSize, y: _tileSize};

//Mouse varibles
var mouseFunction = "movePlayer";
//for mouse hold timing
var holdStarter = null;
var holdStarterToolbox = null;
var holdDelay = 300; 
var holdActive = false;

//player
var _tutorial = false;
var firstRun = true;
var userPlayer; // = new playerObj;
//var userPlayerSaved; // Local storage player data
var playerEntity; //The Crafty player entity
var lastPos = new Position(0,0,0); // The last room position
var playerRoomPos; //Position in current Room
var dailyChallange = false;

//Varible Options to change difficulty or room layouts
var playerSpeed = 250;
//difficulty
var sparseness = 10; //lower = more chance of linked rooms.
var doorChance = 10; //(2 in doorChance) higher = less doors

//Room Varibles
var maxWidth = 9; // Max width of Room
var maxHeight = 11; //Max height of room
var floorMap = []; // The current rooms floor map
floorMap[0] = []; // init 2d array
var objectMap = [[]]; //The current rooms object map
//objectMap[0] = [];
var rooms = []; // The array of all generated rooms
var originDoors = []; //Origin doors are doors that are availbie depending on the direction of enty to a room
var currentRoom; //The current room number in rooms[]
var lastRoom; //The last Room number in rooms[]
var lastDoor; //The position of the last door used
var passingThroughDoor = false;

//Randmon Seeds
var roomRandom; //Random Seeds for generation
var doorRandom;
var pathRandom;
var furnitureRandom;
var hintRandom;

//Room varibles
var originDoorSuccess = true; //Check if doors existed to enter room
var deleteRoom = false; //Check to delete room
var centerPoint; //Centerpoint to zoom on.
//TexturePack
var numOfFloorStyles = 8; 
var numOfDoorStyles = 6; //Max 6 must be defined in loading_js ex  "doorSprite3_reel"

$(document).ready(function() {
	console.log( "Document completed!" );
	//load cordova events in cordova.js
	if (typeof onDeviceReady == 'undefined' && cordovaBuild){
		document.addEventListener("deviceready", onDeviceReady, false);
	}
	//verify gameseed
	verifySeed();

	//clickHandlers
	popUpClickHandlers();
	accountsClickHandlers();
	
	//Start crafty
	beginCrafty();
});

function mobileCheck() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

function verifySeed() {
	//interesting seeds
	//1748(1x1 room with door, 6877(only three rooms), 92166(only 3 rooms), 53769 (only 2 rooms)
	//No doors, 8696
	//Broken Seeds
	var brokenSeeds = [1814,98351,92166,8696,53769];
	if (brokenSeeds.indexOf(gameSeed) != -1) {
		genGameSeed();
		verifySeed();
	}
}

function genGameSeed() {
		gameSeed = Math.floor((Math.random() * gameSeeds) + 1); //TODO DEBUG Increase to 100000
		verifySeed();
}

function beginCrafty() {
	// Initialize and start our game
	//get width and heigt of our game screen.
	//var gameClientWidth = document.getElementById('gameviewDOM').clientWidth;
	
	setTimeout(function() {			
		var gameClientWidth = $(window).width();
		var gameClientHeight = $(window).height();
		//get new tile size
		//11 tiles wide
		var minWidth = Math.floor(gameClientWidth/(maxWidth+1));
		var minHeight = Math.floor(gameClientHeight/(maxHeight+3));
		if (minWidth >= minHeight) { 
			_tileSize = minHeight;
		}
		else { _tileSize = minWidth; }
		//minimize if required
		//if (gameClientWidth > 600) { gameClientWidth = 600; $('#gameviewDOM').width(600); }
		//if (gameClientHeight > 700) { gameClientHeight = 700; $('#gameviewDOM').height(700); }
	
		console.log(gameClientWidth + "width x height" + gameClientHeight);
		// Start crafty and set a background color so that we can see it's working.
		console.log("ready to start Crafty");
		Crafty.mobile = false;
		Crafty.init();
		//Crafty.background('#8ed2fa'); //niceblue
		//Crafty.background('#FCF0AD'); //Canary yellow
		//Crafty.background('#E9E74A'); //yellowy not good on mobile
		//Crafty.background('#FFFFC0');
		mobileFontSize();
		if (mobileCheck()) {
			_tileSize = Math.floor(_tileSize*1.15);
			$('.containsText').css({'font-size': (_tileSize*.75) + 'px'});
			Crafty.viewport.init(gameClientWidth,gameClientHeight);
		}
		else {
			$('.containsText').css({'font-size': (_tileSize*.75) + 'px'});
			//_tileSize = Math.floor(_tileSize*1.15);
			//Crafty.viewport.init(12*_tileSize,gameClientHeight);
		}
		Crafty.background('#FFFFC0 url(res/img/ui/background.png) center center');
		//start game or loading scene
		//Crafty.timer.FPS(30);
		//Crafty.viewport.clampToEntities = false;
		Crafty.scene('Loading');

		//Attempt Login
		if ((typeof localStorage.username == 'undefined' || typeof localStorage.uuid == 'undefined') && typeof SERVERNAME != 'undefined') {
			popUpDestroy();
			popUpCreate('register');
		}	
			
	}, 300);

	
};

function getOrdinal(n){
	var s=["th","st","nd","rd"],
	v=n%100
	return n+(s[(v-20)%10]||s[v]||s[0]);
}

/*function pythagorean(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}*/

//intersting seeds
// "22/7/2017" Go top door, top door, right door, right door again.. in room with three doors and a blue sofa. Go to top right door then keep going to door starting across. will loop back to room with blue sofa

//bad seeds
// 2818, 15914x
