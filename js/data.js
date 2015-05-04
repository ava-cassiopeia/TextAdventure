// globals //

var actions = {
	moved_north: 0,
	moved_east: 1,
	moved_west: 2,
	moved_south: 3,
	
	entered_from_north: 4,
	entered_from_west: 5,
	entered_from_east: 6,
	entered_from_south: 7
};

// verbs // 

var verbs = {
	"move": {
		requiredArgs: 1,
		action: function(args){
			console.log(args);
			var target = args[1];
			
			var newRoom = rooms[currentRoom.attached[target]];
			currentRoom = newRoom;
			DisplayRoom(newRoom);
		}
	}
};

// rooms //

var rooms = {
	first: {
		name: "First Room",
		description: "This is a description of the room. It supports <code>HTML encoding</code>.",
		transition: function(a){switch(a){
			case actions.moved_north: // the player attempts to leave to the north //
				Write("You slowly creak open the door, letting in a draft.");
				break;
		}},
		attached: {
			north: "second"
		}
	},
	second: {
		name: "Second Room",
		"description-page": "rooms/second.html"
	}
};