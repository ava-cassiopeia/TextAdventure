// globals //

var before = "";

// verbs // 

var verbs = {
	"move": {
		requiredArgs: 1,
		action: function(args){
			var target = args[1];
			before = "";
			
			if(isset(rooms[currentRoom.attached[target]])){
				var newRoom = rooms[currentRoom.attached[target]];
				
				// trigger leaving action //
				TriggerTransition("moved " + target);
				
				currentRoom = newRoom;
				
				// trigger enter action //
				TriggerTransition("entered " + target);			
				
				DisplayRoom(newRoom);
			}else{
				alert("You cannot move that direction, there is nothing there.");
			}
		}
	},
	"walk": {alias: "move"},
	"travel": {alias: "move"}
};

// rooms //

var rooms = {
	
	first: {
		name: "Dark Room",
		state: 0,
		description: "You are standing within a musty, dark room. ",
		transition: function(a){switch(a){
			case "moved north": // the player attempts to leave to the north //
				Before("You slowly creak open the door, letting in a draft.");
				break;
		}},
		attached: {
			north: "second"
		}
	},
	
	third:{
		name: "Second Room",
		state: 0,
		description: "You are now standing in the second room.",
		attached: {
			south: "first"
		}
	},
	
	second: {
		name: "Second Room",
		"description-page": "rooms/second.html"
	}
};