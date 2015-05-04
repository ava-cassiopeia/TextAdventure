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
		});
	}
}

function TakeAction(){
	var rawAction = $("#action-input").val();
	var splitAction = rawAction.trim().split(' ');
	
	if(splitAction.length < 1){
		alert("Please specify a verb.");
		return;
	}
	
	var verb = splitAction[0];
	
	ParseAction(verb, splitAction);
}

function ParseAction(verb, splitAction){
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
		alert(verb + " is not a recognized verb.");
		return;
	}
	
	// run verb //
	if(!(splitAction.length - 1 < finalVerb.requiredArgs)){
		finalVerb.action(splitAction);
	}else{
		alert("You must specify " + finalVerb.requiredArgs + " arguments for that verb.");
	}
}

// main functions //

function Before(basicString){
	before += "<p>" + basicString + "</p>";
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