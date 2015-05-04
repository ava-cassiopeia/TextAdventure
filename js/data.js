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
				Error("You cannot move that direction, there is nothing there.");
			}
		}
	},
	"walk": {alias: "move"},
	"travel": {alias: "move"},
	"go": {alias: "move"},
	
	"xyzzy": {
		requiredArgs: 0,
		action: function(args){
			Error("Xyzzy is a reference to Zork that will not work here. Good try though.");
		}
	}
};

// rooms //

var rooms = {
	
	first: {
		name: "Dark Room",
		state: 0,
		content: {
			'door-description': {
				0: "",
				1: "On one end of the room, a large door stands open, revealing a grassy field outside."
			}
		},
		"description-page": "rooms/first.html",
		transition: function(a){switch(a){
			case "moved north": // the player typed 'go north' in this room //
				ForState(0, 1, function(){
					Before("You slowly creak open the door, letting in fresh air and light. At first, you are blinded, but soon, your eyes adjust...");
				});
				break;
		}},
		attached: {
			north: "second"
		},
		customActions: {
			"close door": function(){
				if(currentRoom.state == 1){
					currentRoom.state = 0;
					Before('You ease closed the massive door.');
					DisplayRoom(currentRoom);
				}else{
					Error('The door is already closed.');
				}
			}
		}
	},
	
	second: {
		name: "Open Field",
		state: 0,
		content: {},
		"description-page": "rooms/second.html",
		attached: {
			south: "first",
			north: "forestEntrance"
		}
	},
	
	forestEntrance: {
		name: "Forest",
		state: 0,
		content: {},
		"description-page": "rooms/forestEntrance.html",
		attached: {
			south: "second"
		}
	}
};