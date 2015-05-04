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
	"travel": {alias: "move"},
	"go": {alias: "move"}
};

// rooms //

var rooms = {
	
	first: {
		name: "Dark Room",
		state: 0,
		"description-page": "rooms/first.html",
		transition: function(a){switch(a){
			case "moved north": // the player attempts to leave to the north //
				ForState(0, 1, Before("You slowly creak open the door, letting in fresh air and light. At first, you are blinded, but soon, your eyes adjust..."));
				break;
		}},
		attached: {
			north: "second"
		}
	},
	
	second: {
		name: "Second Room",
		"description-page": "rooms/second.html",
		attached: {
			south: "first"
		}
	}
};