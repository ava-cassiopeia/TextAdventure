/*
|=======================================================================
| TextAdventure Javascript Engine
| Game Data and Configuration
| Author:	Ivan Mattie
|
| Notes:	Change anything below not under
|			'Global Data' to modify the way the
|			game works. This is the file that
|			has most game information.
|
|			The config below maps engine output
|			to CSS selector compliant naming
|			of DOM objects. As well as general
|			Engine configurations per run.
|=======================================================================
*/

var config = {
	html: {
		input: "#action-input",
		roomname: "#name",
		description: "#description",
		before: "#before",
		error: "#error"
	}
};

/*
|=======================================================================
| Global Data
|
| Notes:	List of variables that are
|			considered global variables.
|			In general these should not
|			Be modified.
|=======================================================================
*/

var before = "";

/*
|=======================================================================
| Verbs
|
| Notes:	Variable that holds all of
|			the verbs the player can type.
|
|			All new verbs must either have:
|			
|			- requiredArgs: int
|			- action: function(args)
|
|			or
|
|			- alias: string
|
|			Where requiredArgs is the amount
|			of arguments after the verb (a user's
|			command goes "[verb] [arg1] [arg2] ...")
|			that the player must specify, and action
|			is the function that runs when they type
|			That verb.
|			Alternately, an alias can be specified,
|			which allows that verb to be an alias
|			for the specified verb.
|=======================================================================
*/ 

var verbs = {
	"move": {
		requiredArgs: 1,
		action: function(args){
			var target = args[1];
			
			Move(target);
		}
	},
	"walk": {alias: "move"},
	"travel": {alias: "move"},
	"go": {alias: "move"},
	
	"look": {
		requiredArgs: 0,
		action: function(args){
			DisplayRoom(currentRoom);
		}
	},
	
	"xyzzy": {
		requiredArgs: 0,
		action: function(args){
			Error("Xyzzy is a reference to Zork that will not work here. Good try though.");
		}
	}
};

/*
|=======================================================================
| Rooms
|
| Notes:	List of rooms. All rooms must have
|			the following:
|			
|			- name: string
|			- state: int
|			- (description|description-page): (string|url/string)
|			- content: [list of content mods]
|			- attached: [list of attached rooms]
|
|			Where name is the user-friendly name
|			of the room, state is the roomState,
|			which you can usuially set to 0, and 
|			content is a list of state-dependent
|			data to be placed into the room 
|			descritpion.
|			Then you can either specify a HTML
|			compliant string, or the path to a
|			HTML file to serve as the description
|			of the room, and an attached list of
|			connections to other rooms, if any.
|=======================================================================
*/

var rooms = {
	
	first: { // the room called "first" will always be the starting point //
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