function StageAssistant() {
}

StageAssistant.prototype.setup = function() {
	lnnMenuAttr = {omitDefaultItems: true};
	lnnMenuModel = {
		visible: true,
		items: [
		Mojo.Menu.editItem,
		Mojo.Menu.prefsItem,
		{label: "Update Contacts", command: 'updateContacts'},
		{label: "Help", command: 'help'}
		]
	};
	this.controller.pushScene("Splash");
};


// handleCommand - Setup handlers for menus:
//
StageAssistant.prototype.handleCommand = function(event) {
	var currentScene = this.controller.activeScene();
	if(event.type == Mojo.Event.command) {
		switch(event.command) {
			case 'help':
				this.controller.pushScene("support");
			break;
			case 'updateContacts':
				this.controller.pushScene("Configure");			
				break;			
		}
	}
};