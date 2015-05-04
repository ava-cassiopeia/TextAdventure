/*
|=================================================
| TextAdventure Javascript Engine
| Main Engine
| Author:	Ivan Mattie
|
| Notes:	In general, this file shouldn't
|			be modified when adding content
|			and features to the game. That 
|			should all be done in data.js.
|=================================================
*/

var currentRoom;

function Initialize(){
	// the game will always start with the room labelled "first" //
	
	currentRoom = rooms.first;
	
	DisplayRoom(currentRoom);
	
	// setup action handler //
	
	$(config.html.input).keypress(function(e){
		if(e.charCode == 13){ // [return] was pressed //
			TakeAction();
		}
	});
}

function DisplayRoom(room){
	$(config.html.roomname).text(room.name);
	$(config.html.before).html(before);
	$(config.html.error).html('');
	
	if(typeof(room.description) !== 'undefined'){
		$(config.html.description).html(room.description);
	}else{
		/*var baseURL = window.location.pathname;
		var r = /[^\/]*$/;
		baseURL = baseURL.replace(r, '');*/
		
		$.ajax({
			type: "GET",
			url: room['description-page']
		}).done(function(msg){
			$(config.html.description).html(msg);
			
			if(isset(currentRoom.content)){
				for(var index in currentRoom.content){
					var values = currentRoom.content[index];
					
					if(isset(values[currentRoom.state])){
						var value = values[currentRoom.state];
						
						$("#" + index).html(value);
					}
				}
			}
		});
	}
	
	before = "";
}

function TakeAction(){
	var rawAction = $(config.html.input).val();
	rawAction = rawAction.toLowerCase().trim();
	
	// check custom actions //
	
	var foundCustom = false;
	if(isset(currentRoom.customActions) && isset(currentRoom.customActions[rawAction])){
		currentRoom.customActions[rawAction]();
		foundCustom = true;
	}
	
	var splitAction = rawAction.trim().split(' ');
	
	if(splitAction.length < 1){
		Error("Please specify a verb.");
		return;
	}
	
	var verb = splitAction[0];
	
	ParseAction(verb, splitAction, foundCustom);
	
	$(config.html.input).val('');
}

function ParseAction(verb, splitAction, foundCustom){
	// determine verb //
	var finalVerb;
	if(isset(verbs[verb])){
		var possibleVerb = verbs[verb];
		if(isset(possibleVerb.alias)){
			finalVerb = verbs[possibleVerb.alias];
		}else{
			finalVerb = possibleVerb;
		}
	}else{
		if(!isset(foundCustom) || !foundCustom){
			Error(verb + " is not a recognized verb.");
		}
		return;
	}
	
	// run verb //
	if(!(splitAction.length - 1 < finalVerb.requiredArgs)){
		finalVerb.action(splitAction);
	}else{
		Error("You must specify " + finalVerb.requiredArgs + " arguments for that verb.");
	}
}

// main functions //

function Move(direction){
	if(isset(rooms[currentRoom.attached[direction]])){
		var newRoom = rooms[currentRoom.attached[direction]];
		
		ChangeRooms(newRoom, direction);
	}else{
		Error("You cannot move that direction, there is nothing there.");
	}
}

function ChangeRooms(newRoom, direction){		
	// trigger leaving action //
	if(isset(direction)){
		TriggerTransition("moved " + direction);
	}
	
	currentRoom = newRoom;
	
	// trigger enter action //
	if(isset(direction)){
		TriggerTransition("entered " + direction);
	}
	
	DisplayRoom(newRoom);
}

function Before(basicString){
	before += "<p>" + basicString + "</p>";
}

function Error(errorString){
	$(config.html.error).html(errorString);
}

function ForState(state, toState, action){
	if(currentRoom.state == state){
		action();
		currentRoom.state = toState;
	}
}

function TriggerTransition(transitionName){
	if(isset(currentRoom.transition)){
		currentRoom.transition(transitionName);
	}
}

// helpers //

function isset(object){
	return typeof(object) !== 'undefined';
}

$(document).ready(Initialize);