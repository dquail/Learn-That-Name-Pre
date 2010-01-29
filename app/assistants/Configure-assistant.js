function ConfigureAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

ConfigureAssistant.prototype.setup = function() {
	Mojo.Log.info('*****************BEGINNING AGAIN***********************');
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	//Setup local contacts store 
	this.contacts = [];
	this.status = "Submit";
	 //value: "david_quail@hotmail.com",
	this.controller.setupWidget("email",
         { textReplacement : false},
         this.emailModel = {
            
             value: "",
             disabled: false
    });
     //value: "helama28",
    this.controller.setupWidget("pass-field",
         { },
         this.passwordModel = {
            
             value: "",
             disabled: false
             
    });
    this.controller.setupWidget("progressbar",
    	{	modelProperty: 'progress',
    	 	title: this.status},
    	this.progressbarModel = {
    		progress: 0
    });
   
    Mojo.Log.info('Widgets setup');
	
	/* add event handlers to listen to events from widgets */
	this.submitHandler = this.submitReceivedHandler.bind(this);
	
	this.controller.listen("progressbar", Mojo.Event.tap, this.submitHandler);
	Mojo.Log.info('Handlers setup');
}

ConfigureAssistant.prototype.submitReceivedHandler = function(event) {
	//Change models
	this.emailModel.disabled = true;
	this.passwordModel.disabled = true;
	this.progressbarModel.title = "Contacting server.";
	this.controller.modelChanged(this.nameModel);
	this.controller.modelChanged(this.passwordModel);
	this.controller.modelChanged(this.progressbarModel);
	
	Mojo.Log.info('Submit received');
	var parameters = 'login=' + $('email').mojo.getValue() + '&password=' + $('pass-field').mojo.getValue();
	Mojo.Log.info(parameters);
	var request = new Ajax.Request('https://m.linkedin.com/session', {
					method: 'post',
					parameters: parameters,
					onSuccess: this.authTokenReceivedHandler.bind(this),
					onFailure: this.failureHandler.bind(this, 2)
					});
					
	Mojo.Log.info('AJAX login sent');
}

ConfigureAssistant.prototype.authTokenReceivedHandler = function(event) {
	//Change model
	this.progressbarModel.title = "Contacting server..";
	this.controller.modelChanged(this.progressbarModel);
	
	Mojo.Log.info("Received redirect; sending AJAX contact list request");
	if (event.responseText.match('Incorrect username or password')) {
		Mojo.Log.info("Incorrect user name");
		this.failureHandler(1);
	} else {
		var request = new Ajax.Request('http://m.linkedin.com/contacts?limit=500', {
						method: 'get',
						onSuccess: this.contactListReceivedHandler.bind(this),
						onFailure: this.failureHandler.bind(this, 3)
						});
	
		Mojo.Log.info("AJAX contact list request sent");
	}
}

ConfigureAssistant.prototype.contactListReceivedHandler = function(event) {
	//Change model
	this.progressbarModel.title = "Contacting server...";
	this.controller.modelChanged(this.progressbarModel);
	
	Mojo.Log.info("Received Contact List");
	
	/*for (var i in event) {
			Mojo.Log.info(i, "=>", event[i]);
	} */
	this.links = event.responseText.match(/\/members\/.*?contacts/g);
	Mojo.Log.info("Pulled emails and links.");
	
	/******************Taking out email retrieval for this release (remember to also add in contactReceivedHandler)
	this.emails = event.responseText.match(/href="mailto:.*?"/g);	
	//Slice emails for useful content
	for (var i = 0; i < this.emails.length; i++) {
		this.emails[i] = this.emails[i].slice(13, -1);
	}
	//Start contact AJAX calls
	this.totalContacts = this.links.length - 1;
	this.contactsReceived = 0;
	for (var i = 0; i < 3; i++) {
		Mojo.Log.info("Initiating AJAX request for contact", i, this.emails[i]);
		var request = new Ajax.Request('http://m.linkedin.com' + this.links[i], {
					method: 'get',
					onSuccess: this.contactReceivedHandler.bind(this, this.emails[i]),
					onFailure: this.failureHandler.bind(this, 4)
					});
		Mojo.Log.info("Finishing AJAX request for contact", i);
	}
	**********************/
	
	//Shuffle and clip list
	Mojo.Log.info("What the fuck");
	Mojo.Log.info("-- this.links.length: ",this.links.length);
	Mojo.Log.info("-- Popping contact--");
	this.links.pop();
	Mojo.Log.info("-- Contact popped--");
	
	if (this.links.length > 155) {
		this.links = this.links.shuffle();
		this.links = this.links.slice(0, 154);
		this.over = true;
	}
	else if(this.links.length <=30){
		this.failureHandler(5);
		this.progressbarModel.title = "Not enough contacts";
		this.controller.modelChanged(this.progressbarModel);
	}
	else {
		this.links = this.links.shuffle();
		this.over = false;
	}
	//Start contact AJAX calls
	this.totalContacts = this.links.length;
	this.contactsReceived = 0;
	this.malformedContacts = 0;
	this.threads = 0;	//Used to keep track of how many requests are currently active
	this.photos = 0;	//Keeps track of how many profiles have photos
	this.names = 0;		//Keeps track of how many names we have
	this.work = 0;		//Keeps track of how many work histories we have
	
	for (var i = 0; i < 3; i++) {
		Mojo.Log.info("Initiating AJAX request for contact", i);
		var request = new Ajax.Request('http://m.linkedin.com' + this.links[i], {
					method: 'get',
					onSuccess: this.contactReceivedHandler.bind(this),
					onFailure: this.failureHandler.bind(this, 4)
					});
		Mojo.Log.info("Finishing AJAX request for contact", i);
		this.threads++;
	}
}

ConfigureAssistant.prototype.contactReceivedHandler = function(event) {
	this.threads--;
	this.contactsReceived++;
	Mojo.Log.info(this.threads, "Contact Received");
	var contact = {};
	/************Taking email retrieval out of this release
	contact.email = email;
	*****************/
	//Get info from page
	//~~Basic Info
	//name
	//Check for name - if no name, something's wrong, escape
	var temp = event.responseText.match(/<h1>(.*?)<\/h1>/);
	if (temp) {
		temp = temp[1];
		contact.name = temp;
		this.names++;
		
		Mojo.Log.info("Initiating contact creation for", contact.name);
	
		//photo_url
		//Checks to see if there's no photo; if none, don't try to put it in.
		temp = 'alt="' + contact.name + '" src="(.*?\.jpg)';
		temp = event.responseText.match(temp);
		if (temp) {
			temp = temp[1];
			contact.photo_url = temp;
			this.photos++;
			//Mojo.Log.info(contact.photo_url);
		}
	
		//title
		temp = event.responseText.match(/<\/h1>[\s]*?<div>(.*?)<\/div>/);
		if (temp) {
			temp = temp[1];
			contact.title = temp;
		} else {
			Mojo.Log.info("****************NO TITLE**********************");
		}
		
		Mojo.Log.info("Got past basic information.", contact.name, contact.title);

	
		//~~Detailed Info
		//~Work History 
		//title
		var title = event.responseText.match(/<h3 class="title">.*?<\/h3>/g);
		//If no results for title, skip this, b/c that indicates no work history.
		if (title) {
			for (var i = 0; i < title.length; i++) {
				title[i] = title[i].slice(18, -5);
				Mojo.Log.info(title[i]);
			}
		
			//company
			var company = event.responseText.match(/<h4 class="org summary">.*?<\/h4>/g);
			if (company) {
				for (var i = 0; i < company.length; i++) {
					company[i] = company[i].slice(24, -5);
					Mojo.Log.info(company[i]);
				}
			} else {
				Mojo.Log.info("****************NO COMPANY**********************");
			}	
		
			/*********************Taking out time periods from this release
			//Period
			//start (pulls starts from education too)
			var start = event.responseText.match(/<abbr class="dtstart">(.*?)<\/abbr>/g);
			if (start) {
				for (var i = 0; i < start.length; i++) {
					start[i] = start[i].slice(22, -7);
					//Mojo.Log.info(start[i]);
				}
				//Work End
				var wkEnd = event.responseText.match(/<abbr class="dtstamp">(.*?)<\/abbr>/g);
				if (wkEnd) {
					for (var i = 0; i < wkEnd.length; i++) {
						wkEnd[i] = wkEnd[i].slice(22, -7);
						//Mojo.Log.info(wkEnd[i]);
					}
				}
				
				//Education End: <abbr class="dtend">(.*?)<\/abbr>
				var edEnd = event.responseText.match(/<abbr class="dtend">(.*?)<\/abbr>/g);
				if (edEnd) {
					for (var i = 0; i < edEnd.length; i++) {
						edEnd[i] = edEnd[i].slice(20, -7);
						//Mojo.Log.info(edEnd[i]);
					}
				}
			}
			**************************************/
			
			//add to contact
			contact.work_history = [];
			for (var i = 0; i < title.length; i++) {
				contact.work_history[i] = {
					title: title[i],
					company: company[i],
				};
				/*if (start && wkEnd && wkEnd.length > i) {
					contact.work_history[i].period = start[i] + " &mdash; " + wkEnd[i];
				}*/
				//Mojo.Log.info("Work History pass", i, contact.work_history);
			}
			this.work++;
		}
		//Mojo.Log.info("Starting Education History");
		//~Education History
		//school
		var school = event.responseText.match(/<h3 class="summary fn org">.*?<\/h3>/g);
		if (school) {
			for (var i = 0; i < school.length; i++) {
				school[i] = school[i].slice(27, -5);
				//Mojo.Log.info(school[i]);
			}
	
			/*********************Taking out time periods from this release
			//Period
			//Start (do only if we didn't do work history)
			if (!title) {
				var start = event.responseText.match(/<abbr class="dtstart">(.*?)<\/abbr>/g);
				if (start) {
					for (var i = 0; i < start.length; i++) {
						start[i] = start[i].slice(22, -7);
						//Mojo.Log.info(start[i]);
					}
				
					//Education End: <abbr class="dtend">(.*?)<\/abbr>
					var edEnd = event.responseText.match(/<abbr class="dtend">(.*?)<\/abbr>/g);
					if (edEnd) {
						for (var i = 0; i < edEnd.length; i++) {
							edEnd[i] = edEnd[i].slice(20, -7);
							//Mojo.Log.info(edEnd[i]);
						}
					}
				}
			} else {
				if (wkEnd) {
					start = start.slice(wkEnd.length, start.length);
					//Mojo.Log.info("Start length:", start.length, start[0]);
				}
			}
			
			//end taken already in Work History
			*******************************************/
			//add to contact
			contact.education_history = [];
			for (i = 0; i < school.length; i++) {
				contact.education_history[i] = {
					school: school[i],	
				};
				/*
				if (start) {
					contact.education_history[i].period = start[i] + " &mdash; " + edEnd[i];
				}*/
			}
		} else {
			Mojo.Log.info("****************NO SCHOOL**********************");
		}
		Mojo.Log.info(this.threads, "Completed creation of contact object for", contact.name);
		
		this.contacts[this.contactsReceived] = contact;
	} else {
		Mojo.Log.info("*****************CONTACT CREATION FAILED***********");
		//$("temp2").innerHTML = event.responseText;
		this.malformedContacts++;
	}
	
	var nextContact = this.contactsReceived + 2;
	this.updateProgress();
	
	//If we've got all the contacts, store in DB; otherwise, initiate a new call if we haven't gotten them all.
	if (this.contactsReceived == this.totalContacts) {
		Mojo.Log.info("Storing contacts");
		this.storeInDepot();
	} else if (nextContact < this.totalContacts) {
		Mojo.Log.info(this.threads, "Initiating AJAX request for contact", nextContact);
		for (var i = 0; this.threads < 3; i++) {
			var request = new Ajax.Request('http://m.linkedin.com' + this.links[nextContact + i], {
						method: 'get',
						onSuccess: this.contactReceivedHandler.bind(this),
						onFailure: this.failureHandler.bind(this, 4)
						});
			this.threads++;
		}
		Mojo.Log.info(this.threads, "Finishing AJAX request for contact", nextContact);
	}
	//$("temp").innerHTML = this.contactsReceived + "contacts in this.contacts; malformed contacts: " + this.malformedContacts;

}

ConfigureAssistant.prototype.storeInDepot = function () {
	//First check if we have enough contacts
	if (this.names >= 25 && this.work >= 25 && this.photos >= 5) {
		Mojo.Log.info("Loading Depot");
		this.contactDB = new Mojo.Depot({name: "contactDB", version: 1, estimatedSize: 1000000, replace: true}, this.loadDepotOk.bind(this), this.failureHandler.bind(this));
		Mojo.Log.info("Depot Load command complete");
	} else {
		this.progressbarModel.title = "Not enough contacts";
		this.controller.modelChanged(this.progressbarModel);
		this.failureHandler(5);
	}
	
}

ConfigureAssistant.prototype.loadDepotOk = function () {
	Mojo.Log.info("Initiating add contacts command");
	this.contactDB.add("contacts", this.contacts, this.contactsLoaded.bind(this), this.failureHandler.bind(this));
	Mojo.Log.info("Add contacts command complete");
}

ConfigureAssistant.prototype.contactsLoaded = function () {
	this.progressbarModel.title = "Contacts successfully imported.";
	this.controller.modelChanged(this.progressbarModel);
	//$("temp").innerHTML = "SUCCESS!";
	if (this.over) {
		this.controller.showAlertDialog({
			onChoose: function(value){
				Mojo.Controller.stageController.swapScene("Splash");
			},
			title: $L("Success!"),
			message: $L("150 of your contacts have been imported. You can re-import later for a different 150 contacts."),
			choices:[
				{label: $L('Ok'), value: '', type: 'primary'}
				
			]
			});
	} else {
		this.controller.showAlertDialog({
			onChoose: function(value) {Mojo.Controller.stageController.swapScene("Splash");},
			title: $L("Success!"),
			message: $L("Your contacts were successfully imported."),
			choices:[
				{label: $L('Ok'), value: '', type: 'primary'}
				
			]
			});
	}
	
	//Mojo.Controller.stageController.swapScene("Splash");
	//this.controller.pushScene("Splash");
}

ConfigureAssistant.prototype.updateProgress = function () {
	if (this.totalContacts > 3) {
		this.progressbarModel.title = "Importing " + Math.round((this.contactsReceived / this.totalContacts) * 100) + "% complete";
		this.progressbarModel.progress = this.contactsReceived / this.totalContacts;
	}
	else {
		this.progressbarModel.title = "Try again";
		this.progressbarModel.progress = 0;	
	}	
	//Mojo.Log.info("Updated model", this.contactsReceived / this.totalContacts);
	this.controller.modelChanged(this.progressbarModel);
	//Mojo.Log.info("Alerted about updated model");
}

ConfigureAssistant.prototype.failureHandler = function(code, event) {
	Mojo.Log.info("Starting failure, code =", code);
	//Reset if we've gotten certain codes
	if ((code >= 1 && code <= 3) || code == 5) {
		Mojo.Log.info("Resetting the progress bar and login");
		this.progressbarModel.title = "Submit";
		this.emailModel.disabled = false;
		this.passwordModel.disabled = false;
		this.controller.modelChanged(this.progressbarModel);
		this.controller.modelChanged(this.emailModel);
		this.controller.modelChanged(this.passwordModel);
	}
	
	if (code == 1) {
		//Email or password wrong
		Mojo.Controller.errorDialog("We had trouble logging into your account - please double-check your email and password.");
	} else if (code == 2) {
		//Failure response logging into server
		Mojo.Controller.errorDialog("An server error occured - please try again later or contact support.");
		Mojo.Log.info("Failure logging into server.");
	} else if (code == 3) {
		//Failure response getting contact list
		Mojo.Controller.errorDialog("An server error occured - please try again later or contact support.");
		Mojo.Log.info("Failure retrieving contact list");
	} else if (code == 4) {
		//Failure response retrieving a contact
		Mojo.Log.info("Failure retrieving a contact");
	} else if (code == 5) {
		//Not enough contacts, or pictures
		Mojo.Controller.errorDialog("You don't have enough Linkedin contacts to play the game! You need to connect with more people (at least 30) to play the game!");
		Mojo.Log.info("Not enough contacts");
	}
	Mojo.Log.info("Got out of the loop, code =", code);
	
	
	//$("temp").innerHTML = "Failure!";
	//Mojo.Log.info("Failure!");
}

ConfigureAssistant.prototype.handleCommand = function (event) {
	if (event.type == Mojo.Event.commandEnable &&
	    event.command == Mojo.Menu.helpCmd) {
         event.stopPropagation(); // enable help. now we have to handle it
    }

	if (event.type == Mojo.Event.command) {
		switch (event.command) {
			case Mojo.Menu.helpCmd:
				Mojo.Log.info("Got here");
				Mojo.Controller.stageController.pushScene('support');
				break;
		}
	}	
}

ConfigureAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	   
	
}


ConfigureAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

ConfigureAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function() {
        // Clone this array.
        var result = this.concat();

        // Swap each element with another randomly selected one.
        for (var i = 0; i < result.length; i++) {
            var j = i;
            while (j == i) {
                j = Math.floor(Math.random() * result.length);
            }
            var contents = result[i];
            result[i]    = result[j];
            result[j]    = contents;
        }

        return result;
    };
}


