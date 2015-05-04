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
	
	if(typeof(room.description) !== 'undefined'){
		$("#description").html(room.description);
	}else{
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
	if(typeof(verbs[verb]) !== 'undefined'){
		if(!(splitAction.length - 1 < verbs[verb].requiredArgs)){
			verbs[verb].action(splitAction);
		}else{
			alert("You must specify " + verbs[verb].requiredArgs + " arguments for that verb.");
		}
	}else{
		alert(verb + " is not a recognized verb.");
	}
}

$(document).ready(Initialize);