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
|			Engine configurations per run. This
|			allows you to make your own index
|			for this engine.
|=======================================================================
*/

var config = {
	html: {
		input: "#action-input",
		roomname: "#name",
		description: "#description",
		before: "#before",
		error: "#error",
		info: "#info"
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
|			Verbs should all be lower case.
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
	
	"examine": {
		requiredArgs: 1,
		action: function(args){
			var itemName = args[1];
			
			if(isset(currentRoom.items) && isset(currentRoom.items[itemName])){
				var itemData = items[itemName];
				
				Info(itemData.examine);
			}else{
				Error("That item does not exist.");
			}
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
| Items
|
| Notes:	These aren't actually a list
|			of items, but rather, a list
|			of blueprints of items, to
|			be copied at the start of the 
|			game.
|=======================================================================
*/

var items = {
	"apple": {
		name: "apple",
		plural: "apples",
		examine: function(){
			return "A glistening, red fruit.";
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
		transition: function(a){switch(a){ // custom transition text //
			case "moved north":
				ForState(0, 1, function(){
					Before("You slowly creak open the door, letting in fresh air and light. At first, you are blinded, but soon, your eyes adjust...");
				});
				break;
		}},
		items:{
			"apple": 1
		},
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