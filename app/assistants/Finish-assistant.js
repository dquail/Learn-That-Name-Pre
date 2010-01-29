function FinishAssistant(gameController) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  Mojo.Log.info("************* FinishAssistant(gameContorller)");
	  this.gameController = gameController;
	  this.SCORE_IMAGES = [
		"images/Schmuck.png",
		"images/handshaker.png",
		"images/Butterfly.png",
		"images/Promoter.png",
		"images/Networker.png",
		"images/Wallflower.png",
		"images/Socialite.png",
		"images/Peopleperson.png",
		"images/Connector.png",
		"images/Master.png"
		];
		this.levels = this.SCORE_IMAGES.length;
		this.pointsPerLevel = 4500 / this.levels;
		var level = Math.round(this.gameController.currentScore / this.pointsPerLevel);
		this.levelImage = this.SCORE_IMAGES[this.levels -1];
		Mojo.Log.info("######## level: " + level + " this.levels " + this.levels);
		if (level >=0 && level < this.levels)
		{
			this.levelImage = this.SCORE_IMAGES[level];
		}
		else if (level < 0)
		{
			this.levelImage = this.SCORE_IMAGES[0];
		}
		else{
			this.levelImage = this.SCORE_IMAGES[this.levels -1];
		}		

}

FinishAssistant.prototype.handleCommand = function (event) {
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


FinishAssistant.prototype.setup = function(){
	/* this function is for setup tasks that have to happen when the scene is first created */
	
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	//this.controller.setupWidget(Mojo.Menu.appMenu, newsMenuAttr, newsMenuModel);	
	Mojo.Log.info("------ FinishAssistant.prototype.setup");
	this.playAgainModel = {
		disabled: false,
		buttonLabel: "Play Again"
	};

	this.controller.setupWidget("playAgain", {}, this.playAgainModel);
	this.controller.listen("playAgain", Mojo.Event.tap, this.playAgainClicked.bind(this));

	var levelElement = this.controller.get("finishtitle");
	levelElement.setAttribute('src', '"' + this.levelImage + '"');
	Mojo.Log.info("****** setting src: " + this.levelImage);
	$("totalscore").innerHTML = this.gameController.currentScore;
	Mojo.Log.info("**************TEST!!! First person " + this.gameController.game.rounds[0].correctContact.name);
	
	this.displayPeople();

}
FinishAssistant.prototype.playAgainClicked = function(event)
{
		Mojo.Log.info("----- Play again button pushed");
		Mojo.Log.info("---this.gameController.contacts length " + this.gameController.contacts);
		Mojo.Controller.stageController.swapScene("Game", this.gameController.contacts);	
};

FinishAssistant.prototype.displayPeople = function()
{
	//Ya, really stupid to have this not in a for loop but hard coded for test and now not
	//wanting to go back
	
	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 0 name ");
	$("person0Name").innerHTML = this.gameController.game.rounds[0].correctContact.name.truncate(37);
	$("person0Title").innerHTML = this.gameController.game.rounds[0].correctContact.work_history[0].title.truncate(37);
	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 0 company ");
	$("person0Company").innerHTML = this.gameController.game.rounds[0].correctContact.work_history[0].company.truncate(37);
	this.controller.get("person0Photo").setAttribute('src', '"' + this.gameController.game.rounds[0].correctContact.photo_url + '"');
	
	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 1 ");
	$("person1Name").innerHTML = this.gameController.game.rounds[1].correctContact.name.truncate(37);
	$("person1Title").innerHTML = this.gameController.game.rounds[1].correctContact.work_history[0].title.truncate(37);
	$("person1Company").innerHTML = this.gameController.game.rounds[1].correctContact.work_history[0].company.truncate(37);
	this.controller.get("person1Photo").setAttribute('src', '"' + this.gameController.game.rounds[1].correctContact.photo_url + '"');

	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 2 ");
	$("person2Name").innerHTML = this.gameController.game.rounds[2].correctContact.name.truncate(37);
	$("person2Title").innerHTML = this.gameController.game.rounds[2].correctContact.work_history[0].title.truncate(37);
	$("person2Company").innerHTML = this.gameController.game.rounds[2].correctContact.work_history[0].company.truncate(37);	
	this.controller.get("person2Photo").setAttribute('src', '"' + this.gameController.game.rounds[2].correctContact.photo_url + '"');

	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 3 ");		
	$("person3Name").innerHTML = this.gameController.game.rounds[3].correctContact.name.truncate(37);
	$("person3Title").innerHTML = this.gameController.game.rounds[3].correctContact.work_history[0].title.truncate(37);
	$("person3Company").innerHTML = this.gameController.game.rounds[3].correctContact.work_history[0].company.truncate(37);
	this.controller.get("person3Photo").setAttribute('src', '"' + this.gameController.game.rounds[3].correctContact.photo_url + '"');
	

	Mojo.Log.info("**********FinishAssistant.prototype.displayPeople 4 ");	
	$("person4Name").innerHTML = this.gameController.game.rounds[4].correctContact.name.truncate(37);
	$("person4Title").innerHTML = this.gameController.game.rounds[4].correctContact.work_history[0].title.truncate(37);
	$("person4Company").innerHTML = this.gameController.game.rounds[4].correctContact.work_history[0].company.truncate(37);
	this.controller.get("person4Photo").setAttribute('src', '"' + this.gameController.game.rounds[4].correctContact.photo_url + '"');				
				
}

FinishAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


FinishAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

FinishAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
