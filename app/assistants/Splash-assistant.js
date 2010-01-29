function SplashAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SplashAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	this.controller.setupWidget(Mojo.Menu.appMenu, lnnMenuAttr, lnnMenuModel);	
	this.playModel = {
		disabled: false,
		buttonLabel: "Play Game"
	};	
	
	this.importModel = {
		disabled: false,
		buttonLabel:"Import Contacts"
	};
	this.controller.get("play").hide();
	this.controller.get("import").hide();
	this.controller.listen("import", Mojo.Event.tap, function(){
		Mojo.Controller.stageController.pushScene("Configure");
	});
	this.controller.setupWidget("play", {}, this.playModel);
	this.controller.setupWidget("import", {}, this.importModel);
	
	Mojo.Log.info("--- Calling this.readFromDepot");
	this.loadContactsDepot();			
		
}

SplashAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


SplashAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

SplashAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

SplashAssistant.prototype.loadContactsDepot = function () {
	Mojo.Log.info("SplashAssistant.prototype.loadContactsDepot");
	this.contactDB = new Mojo.Depot({name: "contactDB", version: 1, estimatedSize: 1000000, replace: false}, this.loadContactsDepotOK.bind(this), 
			function(result){
				Mojo.Log.warn("Error opening db: result")
					this.controller.get("import").style.display = "block";
			});
			
	Mojo.Log.info("SplashAssistant.prototype.loadContactsDepot finished");
}

SplashAssistant.prototype.loadContactsDepotOK = function () {
	Mojo.Log.info("SplashAssistant.prototype.loadContactsDepotOk");
	Mojo.Log.info("Opened Depot DB successfully")
	this.contactDB.simpleGet("contacts", this.contactsLoaded.bind(this),
		function(result){
				Mojo.Log.warn("Error getting contacts from db");
				this.controller.get("import").style.display = "block";
			});
	
	Mojo.Log.info("SplashAssistant.prototype.loadContactsDepotOk Complete");
}

SplashAssistant.prototype.failureHandler = function (event) {
	Mojo.Log.info("Failure Handler");
	$("debug").innerHTML = "Error reading from depot";
	this.controller.get("import").style.display = "block";
}

SplashAssistant.prototype.contactsLoaded = function(contacts)
{
	Mojo.Log.info("SplashAssistant.prototype.contactsLoaded");	
	Mojo.Log.info("contacts: "+contacts);	
	if (contacts ==null)
	{
		Mojo.Log.warn("contacts received was null");
		this.controller.get("import").style.display = "block";
		return;		
	}	
	if ((typeof(contacts) == "undefined")|| (contacts.length<=0)){
		Mojo.Log.warn("contacts received was null");
		this.controller.get("import").style.display = "block";
		return;
	}
	else{
		Mojo.Log.info("Receieved actual contacts - size: "+ contacts.length);
		this.contacts = contacts;			
		Mojo.Log.info("SplashAssistant.prototype.contactsLoaded finished");
		//this.printContacts();
		
		this.controller.get("import").hide();
		this.controller.get("play").style.display = "block";
		this.controller.listen("play", Mojo.Event.tap, this.playGameHandler.bind(this));		
		Mojo.Log.info("--------- Play button enabled");
				
	}
}
SplashAssistant.prototype.printContacts = function()
{
			/*
		 * Print out the contacts details for debugging
		 */
		Mojo.Log.info("********* Printing out the contact array returned from depot");
		Mojo.Log.info("***** Contact Array size: " + this.contacts.length); 	
		for (var i = 0; i < this.contacts.length; i++)
		{
			Mojo.Log.info("***Attempting contact " + i + " " + this.contacts[i] + " of "+ this.contacts.length);
			for (var c in this.contacts[i]) {
				Mojo.Log.info("attribute=>"+ c);
			} 		
			var contact = this.contacts[i];
			Mojo.Log.info("**Contact " + i );
			if (typeof(contact.name =="undefined"))
			{
				Mojo.Log.error("!!!!!! No name defined for contact "+i);
			}
			else
				Mojo.Log.info("Name: "+ contact.name);
			if(typeof(contact.photo_url)=="undefined")
			{
				Mojo.Log.info("!Photo not defined");
			}
			else{
				Mojo.Log.info("photo_url: "+contact.photo_url);	
			}
			
	
			if (typeof(contact.work_history)=="undefined")
			{
				Mojo.Log.info("!!No work history");	
			}
			else{
				Mojo.Log.info("Work History title: " + contact.work_history[0].title);
				Mojo.Log.info("Work History company: " + contact.work_history[0].company);			
			}
				
		}
}
SplashAssistant.prototype.playGameHandler = function(event){
	Mojo.Log.info("--- SplashAssistant.protoype.playGameHandler");
	Mojo.Log.info("Contacts Length: "+ this.contacts.length);
	Mojo.Controller.stageController.pushScene("Game", this.contacts);	
}
