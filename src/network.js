function uuid() {
    function randomDigit() {
        if (crypto && crypto.getRandomValues) {
            var rands = new Uint8Array(1);
            crypto.getRandomValues(rands);
            return (rands[0] % 16).toString(16);
        } else {
            return ((Math.random() * 16) | 0).toString(16);
        }
    }
    var crypto = window.crypto || window.msCrypto;
    return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
}

function getLogin() {
	var username = $('#inputLoginUsername').val();
    var deviceUUID = $('#inputLoginUUID').val();
	//disable fields
	$('#inputLoginForm').find(':input:not(:disabled)').prop('disabled', true);

	//simple sanitation Server takes care of reset if idiots will be idiots.

	if (username == "") {
		popUpCreateStatus({message:"User Name or Password Incorrect"});
		return 1;
	}
	if (deviceUUID == "") {
		if (typeof localStorage.uuid === 'undefined'){
			deviceUUID = uuid();
		}
		else { 	deviceUUID = localStorage.uuid }
	}

	sqlNewGameAccount(username,deviceUUID,"true");

}

function getRegister() {
	var username = $('#inputRegisterUsername').val();
	var deviceUUID = $('#inputRegisterUUID').val();

	//disable fields
	$('#inputregistrationForm').find(':input:not(:disabled)').prop('disabled', true);

	//simple sanitation Server takes care of reset if idiots will be idiots.

	if (username == "") {
		//generate random name
		username = "LostSoul" + Math.floor(Math.random() * 1000)
		
		//popUpCreateStatus({message:"Please enter a username and password."});
		//return 1;
	}
	if (deviceUUID == "") {
		if (typeof localStorage.uuid === 'undefined'){
			deviceUUID = uuid();
		}
		else { 	deviceUUID = localStorage.uuid }
	}
	sqlNewGameAccount(username,deviceUUID);	
}

function sqlNewGameAccount(userName,deviceUUID,force) {
	if (typeof SERVERNAME == 'undefined'){ return false; }
	if (typeof force === 'undefined'){ force = "false" }
	var status;
	$.ajax({
        url: SERVERNAME,
        data: {"userName": userName, "deviceUUID": deviceUUID, "force": force},
        type: "GET",
        dataType: "json",
        timeout:4000,
        success: function(response) {
        	if (response.msgcode == "loginCreated") {
		    	popUpCreateStatus({message:"Registration Successful! You are the " + getOrdinal(response.row -1) + " user to register"});
		        popUpDestroy();
		    	console.log(response);
		    	//save uuid to localStorage
		    	localStorage.uuid = sessionStorage.uuid;
		    	localStorage.username = userName;
		    	sessionStorage.username = userName;
	    	} else if (response.msgcode == "loginFound") {
	    		popUpDestroy(); 
				popUpCreate("userFound",{"username": response.userName});
		    	console.log(response);
		    	//save uuid to localStorage
		    	localStorage.uuid = sessionStorage.uuid;
		    	localStorage.username = response.userName;
		    	sessionStorage.username = userName;
	    	} else if (response.msgcode == "loginForced") {
				popUpCreateStatus({message:"Registration Change Successful! You are still the " + getOrdinal(response.row -1) + " user to register"});
		        popUpDestroy();
		    	console.log(response);
		    	//save uuid to localStorage
		    	localStorage.uuid = sessionStorage.uuid;
		    	localStorage.username = userName;
		    	sessionStorage.username = userName;
	    	} else if (response.msgcode == "loginSuccess") {
				popUpCreateStatus({message:"Logged in as " + response.userName});
		        popUpDestroy();
		    	console.log(response);
		    	//save uuid to localStorage
		    	localStorage.uuid = sessionStorage.uuid;
		    	localStorage.username = userName;
		    	sessionStorage.username = userName;
	    	} else if (response.result == "error") {
	    		popUpCreateStatus({message:"Server Timeout. Try again later."});
		    	console.log(response);
	    	} 
	    	displayAccounts();
        },
        error: function(xhr, textstatus, error) {
        	if (typeof xhr.responseText !== 'undefined') {
		      	console.log(xhr.responseText);
		  
		  		      	console.log(errorCheck);
        	}
        	else if(typeof textstatus !== 'undefined') {
				if (textstatus == 'timeout') {
					popUpCreateStatus({message:"Server Timeout. Try again later."});
					sessionStorage.removeItem('username');
					$('#inputregistrationForm').find(':input:disabled').prop('disabled', false);
				}
        	}
        },
        statusCode: {
            0: function() {
                //Success message
                console.log("return 0");
                status = 0;
            },
            200: function() {
                //Success Message
                console.log("return 200");
            	//popUpDestroy();
            }
        }
    });
}

function sqlPostGame(score) {
	//is this a cached game?
	if (typeof SERVERNAME == 'undefined'){ return false; }
	
	if (score.daily == ""){
		var dailyStr;
		if (dailyChallange) { dailyStr = "true" } else { dailyStr = "false"}
		score.daily = dailyStr;
	}

	//save game data incase of fail
	var userPlayerSaved = JSON.parse(localStorage.playerSaveData);
	userPlayerSaved.lastGame = score;
	//Save PlayerData
	localStorage.playerSaveData = JSON.stringify(userPlayerSaved);
	
    $.ajax({
        url: SERVERNAME,
        data: {"userName": score.userName, "deviceUUID": score.deviceUUID, "score": score.score, "rank": score.rank, "turns": score.turns, "seed": score.seed, "daily": score.daily},
        type: "GET",
        dataType: "json",
        timeout:4000,
        success: function(response) {
        	if (response.msgcode == "dailySaved") {
		    	popUpCreateStatus({message:"Daily game Saved"});
		        popUpDestroy();
		    	console.log(response);
		    	//check for cached games
		    	checkCached(true);
	    	} else if (response.result == "error") {	    		
	    		popUpCreateStatus({message:"Server Timeout. Try again later."});
	    		popUpDestroy();
		    	console.log(response);
		    	//store game in usersave
		    	checkCached(false);
	    	} else if (response.msgcode == "scoreSaved") {
		    	popUpCreateStatus({message:"Daily game Saved"});
		        popUpDestroy();
		    	console.log(response);
		    	//check for cached games
		    	checkCached(true);
	    	} else {
		    	popUpCreateStatus({message:"Server Timeout. Try again later."});
	    		popUpDestroy();
		    	console.log(response);
		    	//store game in usersave
		    	checkCached(false);
	    	}
        },
        error: function(xhr, textstatus, error) {
        	popUpCreateStatus({message:"Server Timeout. Try again later."});
			popUpDestroy();
			console.log(xhr.responseText);
			checkCached(false);
		},
        statusCode: {
            0: function() {
                //Success message
                console.log("return 0");
            },
            200: function() {
                //Success Message
                console.log("return 200");
            }
        }
    });
    //check cached games
}

function cacheGamesUpload(){
	
}

function checkCached(uploaded){
	var userPlayerSaved = JSON.parse(localStorage.playerSaveData);
	if (uploaded) {
		userPlayerSaved.lastGame = {};
	} else {
		var score = userPlayerSaved.lastGame;
		userPlayerSaved.cached.push(score);
	}
	localStorage.playerSaveData = JSON.stringify(userPlayerSaved);
}
