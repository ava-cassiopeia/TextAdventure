var currentRoom;

function Initialize(){
	if(!FileReader){
		alert("Your browser does not support the frameworks used for this!");
		return;
	}
	// the game will always start with the room labelled "first" //
	
	currentRoom = rooms.first;
	
	DisplayRoom(currentRoom);
	
	// setup action handler //
	
	$("#action-input").keypress(function(e){
		if(e.charCode == 13){ // [return] was pressed //
			TakeAction();
		}
	});
}

function DisplayRoom(room){
	$("#name").text(room.name);
	$("#before").html(before);
	$("#error").html('');
	
	if(typeof(room.description) !== 'undefined'){
		$("#description").html(room.description);
	}else{
		/*var baseURL = window.location.pathname;
		var r = /[^\/]*$/;
		baseURL = baseURL.replace(r, '');*/
		
		$.ajax({
			type: "GET",
			url: room['description-page']
		}).done(function(msg){
			$("#description").html(msg);
			
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
}

function TakeAction(){
	var rawAction = $("#action-input").val();
	rawAction = rawAction.toLowerCase().trim();
	
	// check custom actions //
	
	var foundCustom = false;
	if(isset(currentRoom.customActions[rawAction])){
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
	
	$("#action-input").val('');
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

function Before(basicString){
	before += "<p>" + basicString + "</p>";
}

function Error(errorString){
	$("#error").html(errorString);
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