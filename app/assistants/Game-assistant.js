var SECONDS_PER_INTERVAL = 0.05;
var DECREASE_AMOUNT_PER_INTERVAL = 1;

function GameAssistant(contacts) {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	  this.gameController = new GameController(contacts);
}
GameAssistant.prototype.handleCommand = function (event) {
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


GameAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
	//this.controller.setupWidget(Mojo.Menu.appMenu, newsMenuAttr, newsMenuModel);	
	Mojo.Log.info("------ GameAssistant.prototype.setup()");

	var photoElement = this.controller.get("photo");
	var answers = this.gameController.game.rounds[this.gameController.currentRound].questions[this.gameController.currentQuestion].answers;
	
	Mojo.Log.info("$$$$$$$$$$$$$$$ Setting photo src " + '"' +answers[this.gameController.currentCorrectIndex].contact.photo_url + '"');
	photoElement.setAttribute('src', '"' +answers[this.gameController.currentCorrectIndex].contact.photo_url + '"');
	photoElement.addEventListener('load',this.photoLoadedEventHandler.bind(this), false);
		
	this.answer0Model = {
		disabled: false,
		buttonLabel: ""
	};
	this.answer1Model = {
		disabled: false
	};
	this.answer2Model = {
		disabled: false
	};
	this.answer3Model = {
		disabled: false
	};
	this.nextQuestionModel = {
		disabled:false,
		buttonLabel: "Next Question"
	}
		
	//Mojo.Log.info("------ Setting up the progress bar");
	this.lgProgressBarModel = {
  		value: 0.5, 
		progress: 0.5, 
		title: "test"
  	}
  	this.controller.setupWidget ('loadProgressBar',this.lgProgressBarModel);
	
	//Mojo.Log.info("*******$$$$$$$$$$****** Testing the progress bar");
	//this.lgProgressBarModel.progress += 0.5;
	//this.controller.modelChanged(this.lgProgressBarModel, this);	


	Mojo.Log.info("------ GameAssistant.prototype.setup() - setting up answerHandl");
	this.answer0Handler =this.answer0ReceivedHandler.bind(this);
	this.answer1Handler =this.answer1ReceivedHandler.bind(this);
	this.answer2Handler =this.answer2ReceivedHandler.bind(this);
	this.answer3Handler =this.answer3ReceivedHandler.bind(this);
	this.nextHandler = this.nextQuestionHandler.bind(this);
	
	Mojo.Log.info("------ GameAssistant.prototype.setup() - setting up listeners");
	this.controller.listen("answer0", Mojo.Event.tap, this.answer0Handler);
	this.controller.listen("answer1", Mojo.Event.tap, this.answer1Handler);
	this.controller.listen("answer2", Mojo.Event.tap, this.answer2Handler);
	this.controller.listen("answer3", Mojo.Event.tap, this.answer3Handler);
	this.controller.listen("nextQuestion", Mojo.Event.tap, this.nextHandler);
		
	Mojo.Log.info("------ GameAssistant.prototype.setup() - calling updateInterface");
	this.controller.setupWidget("answer0", {}, this.answer0Model);
	this.controller.setupWidget("answer1", {}, this.answer1Model);
	this.controller.setupWidget("answer2", {}, this.answer2Model);
	this.controller.setupWidget("answer3", {}, this.answer3Model);
	this.controller.setupWidget("nextQuestion", {}, this.nextQuestionModel);

	this.updateInterface();	
}

GameAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	  Mojo.Log.info("-------- Setting up the timer for every 0.25 seconds");
	this.timer = new PeriodicalExecuter(this.timerHandler.bind(this), SECONDS_PER_INTERVAL);
}


GameAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

GameAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

GameAssistant.prototype.nextQuestionHandler = function(event){
	Mojo.Log.info("------------ GameAssistant.prototype.nextHandler");
	this.updateInterface();
}
GameAssistant.prototype.answer0ReceivedHandler = function(event) 
{ 
	//Send the event to the game Controller.  Tell it the button number
	Mojo.Log.info("----------- Button 0 pushed");
	var result;

	result = this.gameController.receiveAnswer(0);
	Mojo.Log.info("----- value returned from gameController: " + result.correct);
	this.showResult();
	//this.nextQuestion();
}
GameAssistant.prototype.answer1ReceivedHandler = function(event) 
{ 
	//Send the event to the game Controller.  Tell it the button number
	Mojo.Log.info("----------- Button 1 pushed");
	var result;
	result = this.gameController.receiveAnswer(1);
	Mojo.Log.info("----- value returned from gameController: " + result.correct);
	this.showResult();
	//this.nextQuestion();
}
GameAssistant.prototype.answer2ReceivedHandler = function(event) 
{ 
	//Send the event to the game Controller.  Tell it the button number
	Mojo.Log.info("----------- Button 2 pushed");
	var result;
	result = this.gameController.receiveAnswer(2);
	Mojo.Log.info("----- value returned from gameController: " + result.correct);
	this.showResult();
	//this.nextQuestion();	
}
GameAssistant.prototype.answer3ReceivedHandler = function(event) 
{ 
	//Send the event to the game Controller.  Tell it the button number
	Mojo.Log.info("----------- Button 3 pushed");
	var result;
	result = this.gameController.receiveAnswer(3);
	Mojo.Log.info("----- value returned from gameController: " + result.correct);
	this.showResult();
	//this.nextQuestion();	
}

GameAssistant.prototype.updateInterface = function()
{
	//This method simply updates the User interface based on the existing gamecontroller
	Mojo.Log.info("----------***********---- GameAssistant.prototpye.updateInterface()");
	//Stall the timer if it's the first question an the image needs to be downloaded
	if (this.gameController.currentQuestion == 0)
		this.timerStalled = true;
	else 
		this.timerStalled = false;
	
	
	//Update the photo 
	var photoElement = this.controller.get("photo");

	var answers = this.gameController.game.rounds[this.gameController.currentRound].questions[this.gameController.currentQuestion].answers;

	photoElement.setAttribute('src', '"' + answers[this.gameController.currentCorrectIndex].contact.photo_url + '"');

	var names = ""; 
	for (var name in answers[0]){
		names+=name +", ";
	}
	
	Mojo.Log.info("------ Hiding the next button");
	$('nextQuestion').hide(); 
	Mojo.Log.info("------ Resetting the progress bar");
	this.lgProgressBarModel.progress = 0;
	this.controller.modelChanged(this.lgProgressBarModel);


	Mojo.Log.info("$$$$$$$$$$$$$$$ List of attribute names from response: " + names);
	
	Mojo.Log.info("********* answers length: "+ answers.length);
	Mojo.Log.info("**********answers[0].name: "+ answers[0].value);
	this.answer0Model.buttonLabel = answers[0].value
	this.answer0Model.buttonClass =  'primary';
	this.answer1Model.buttonLabel = answers[1].value;
	this.answer1Model.buttonClass =  'primary';
	this.answer2Model.buttonLabel = answers[2].value;
	this.answer2Model.buttonClass =  'primary';
	this.answer3Model.buttonLabel = answers[3].value;
	this.answer3Model.buttonClass =  'primary';
	//Re-enable them
	this.answer0Model.disabled = false;
	this.answer1Model.disabled = false;
	this.answer2Model.disabled = false;
	this.answer3Model.disabled = false;
	this.controller.get("answer0").style.display = "block";
	this.controller.get("answer1").style.display = "block";
	this.controller.get("answer2").style.display = "block";
	this.controller.get("answer3").style.display = "block"
				
	Mojo.Log.info("-----Calling update models");
	this.controller.modelChanged(this.answer0Model, this);
	this.controller.modelChanged(this.answer1Model, this);
	this.controller.modelChanged(this.answer2Model, this);
	this.controller.modelChanged(this.answer3Model, this);
	
	this.answer0Handler =this.answer0ReceivedHandler.bind(this);
	this.answer1Handler =this.answer1ReceivedHandler.bind(this);
	this.answer2Handler =this.answer2ReceivedHandler.bind(this);
	this.answer3Handler =this.answer3ReceivedHandler.bind(this);
		
	Mojo.Log.info("---Updated models");
	
	$("round").innerHTML = "Rnd: " + (this.gameController.currentRound +1);

	$("available_points").innerHTML = this.gameController.currentPointsAvailable + " pts";
	

	$("question").innerHTML = this.gameController.game.rounds[this.gameController.currentRound].questions[this.gameController.currentQuestion].question;
	
	//$("result").innerHTML = "";	
	
}

GameAssistant.prototype.showResult = function(){
	//This function needs to show success or fail result  
	//It has to make the next button visible.  That's it.
	Mojo.Log.info("--------- GameAssistant.prototype.showResult()");
	this.timerStalled = true;
	var question;
	var lastQuestionIndex = this.gameController.currentQuestion; 
	var lastCorrectIndex = this.gameController.currentCorrectIndex;
	
	var points_deducted = this.gameController.game.rounds[this.gameController.currentRound].questions[this.gameController.currentQuestion].penaltyPoints;
	var points_awarded = this.gameController.currentPointsAvailable;
	var prefix = "";
	var firstName = this.getFirstName(this.gameController.game.rounds[this.gameController.currentRound].questions[lastQuestionIndex].answers[lastCorrectIndex].contact.name);

	if (this.gameController.currentQuestion == 0)
	{
		prefix = "This is ";
	}
	else if (this.gameController.currentQuestion == 1)
	{
		prefix = firstName + " works at ";
	}
	else{
		prefix = firstName + "'s title is ";
	}
	var correctAnswer = prefix + this.gameController.game.rounds[this.gameController.currentRound].questions[this.gameController.currentQuestion].answers[this.gameController.currentCorrectIndex].value.truncate(27); 

	question = this.gameController.goToNextQuestion();

	$("question").innerHTML = correctAnswer;
	if (question =="finished")
	{
		//Push the finish scene
		Mojo.Log.info("--------- GameAssistant.prototype.showResult() thinks it's finished");
		//this.Mojo.Controller.stageController.swapScene.delay(3, ["Finish", this.gameController]);
		Mojo.Controller.stageController.swapScene("Finish", this.gameController);
	}
	else{
		if (this.gameController.lastAnswerCorrect == "true") {			
			this.updateButtons("correct", this.gameController.lastAnswerIndex, points_awarded, lastQuestionIndex);
			Mojo.Log.info("Correct.  Need to update the button selected text.");
			
		}
		else if (this.gameController.currentRound == 0 && this.gameController.currentQuestion == 0) {
				Mojo.Log.info("Finish.  Need to update the button selected text.");
			//$("result").innerHTML = "Begin Game";
		}
		else {
			Mojo.Log.info("Incorrect.  Need to update the button selected text: "+ this.gameController.lastAnswerIndex + "pd "+ points_deducted, lastQuestionIndex);
			this.updateButtons("incorrect", this.gameController.lastAnswerIndex, points_deducted);
			//$("result").innerHTML = "Wrong!";
		}
		
		Mojo.Log.info("****** Unhiding the next question button")	
		$("nextQuestion").show();

	}

}
GameAssistant.prototype.updateButtons = function(correct, buttonIndex, points, questionIndex)
{
	Mojo.Log.info("------- #######GameAssistant.prototype.updateButtons "+ correct + " " + buttonIndex + " " + points);
	//First need to determine the button number to change
	var prefix = "";
	var buttonClass = "";
	var nextButtonText;
		
	if (correct == "correct") {
		prefix = "CORRECT +";
		buttonClass = "affirmative";
		if (questionIndex < 2)
			nextButtonText = "Bonus Question ...";
		else
			nextButtonText = "Next Question ...";
	}
	else {
		prefix = "WRONG -";
		buttonClass = "negative";
			nextButtonText = "Next Question ...";
	}
	
	this.nextQuestionModel.buttonLabel = nextButtonText;
	this.answer0Model.disabled = true;
	this.answer1Model.disabled = true;
	this.answer2Model.disabled = true;
	this.answer3Model.disabled = true;
	
	if (buttonIndex == 0)
	{
		this.answer0Model.buttonLabel = prefix + points;
		this.answer0Model.buttonClass = buttonClass;		
	}
	else if (buttonIndex ==1)
	{
		this.answer1Model.buttonLabel = prefix + points;
		this.answer1Model.buttonClass = buttonClass;		
	}
	else if (buttonIndex ==2)
	{
		this.answer2Model.buttonLabel = prefix + points;
		this.answer2Model.buttonClass = buttonClass;		
	}
	else if (buttonIndex ==3)
	{
		this.answer3Model.buttonLabel = prefix + points;
		this.answer3Model.buttonClass = buttonClass;				
	}
	else
		Mojo.Log.error("***** GameAssistant.prototype.updateButtons was passed an invalid buttonIndex");
	
	this.controller.modelChanged(this.answer0Model, this);
	this.controller.modelChanged(this.answer1Model, this);
	this.controller.modelChanged(this.answer2Model, this);
	this.controller.modelChanged(this.answer3Model, this);
	this.controller.modelChanged(this.nextQuestionModel, this);
}


GameAssistant.prototype.timerHandler = function(){
	if (!this.timerStalled) {
		this.gameController.decreasePointsEvent(DECREASE_AMOUNT_PER_INTERVAL);
		
		var remainder = this.gameController.currentPointsAvailable % 100;

		if (remainder == 0 && !this.gameController.currentPointsAvailable == 0) {
			var removed = false;
			while (!removed) {
				var index = Math.round(3 * Math.random());
				if (index != this.gameController.currentCorrectIndex) {
					if (index == 0 && !this.answer0Model.disabled) {
						//this.controller.get("answer0").hide();
						this.answer0Model.disabled = true;
						this.controller.modelChanged(this.answer0Model, this);
						removed = true;
					}
					if (index == 1 && !this.answer1Model.disabled) {
						//this.controller.get("answer1").hide();
						this.answer1Model.disabled = true;
						this.controller.modelChanged(this.answer1Model, this);
						removed = true;
					}
					if (index == 2 && !this.answer2Model.disabled) {
						//this.controller.get("answer2").hide();
						this.answer2Model.disabled = true;
						this.controller.modelChanged(this.answer2Model, this);
						removed = true;
					}
					if (index == 3 && !this.answer3Model.disabled) {
						//this.controller.get("answer3").hide();
						this.answer3Model.disabled = true;
						this.controller.modelChanged(this.answer3Model, this);
						removed = true;
					}
				}
			}
		}
		if (this.gameController.currentPointsAvailable == 0) {
			this.timerStalled = true;
			Mojo.Log.info("-----------****** Inside trying to call with wrong answer");
			Mojo.Log.info("-----------****** correctIndex " + this.gameController.currentCorrectIndex);
			Mojo.Log.info("--- Model0 disabled: "+ this.answer0Model.disabled);
			Mojo.Log.info("--- Model1 disabled: "+ this.answer1Model.disabled);
			Mojo.Log.info("--- Model2 disabled: "+ this.answer2Model.disabled);
			Mojo.Log.info("--- Model3 disabled: "+ this.answer3Model.disabled);
			/*
			if (this.answer0Model.disabled == false && !this.gameController.currentCorrectIndex == 0) 
			{
				Mojo.Log.info("******* calling receiveAnswer - 0 ");
				this.gameController.receiveAnswer(0);
			}
			else if (this.answer1Model.disabled == false && !this.gameController.currentCorrectIndex == 1) 
			{
				Mojo.Log.info("******* calling receiveAnswer - 1 ");
				this.gameController.receiveAnswer(1);
			}
			else if (this.answer2Model.disabled == false && !this.gameController.currentCorrectIndex == 2) 
			{
				Mojo.Log.info("******* calling receiveAnswer - 2 ");
				this.gameController.receiveAnswer(2);
			}
			else if (this.answer3Model.disabled == false && !this.gameController.currentCorrectIndex == 3) 
			{
				Mojo.Log.info("******* calling receiveAnswer - 3 ");
				this.gameController.receiveAnswer(3);
			}
			else
			{
				if (this.gameController.currentCorrectIndex ==0)
					this.gameController.receiveAnswer(1);
				else
					this.gameController.receiveAnswer(0);
				Mojo.Log.info("********** Couldn't actually find an answer to call");
			}
			*/
			Mojo.Log.info("*** Attempting to send the correct answer with 0 time");
			this.gameController.receiveAnswer(this.gameController.currentCorrectIndex);
			
			/*
			this.controller.get("answer0").hide();
			this.controller.get("answer1").hide();
			this.controller.get("answer2").hide();
			this.controller.get("answer3").hide();
			*/
			this.showResult();
		}
		
		Mojo.Log.info("**** Setting new points to " + this.gameController.currentPointsAvailable);
		$("available_points").innerHTML = this.gameController.currentPointsAvailable;
		Mojo.Log.info("**** Updating the progress bar.  Current counter: " + this.lgProgressBarModel.progress);
		Mojo.Log.info("**** Game controller object: " + this.gameController);
		
		Mojo.Log.info("----- Setting the progress up a bit");
		this.lgProgressBarModel.progress += 0.05;
		this.controller.modelChanged(this.lgProgressBarModel, this);
	}
}

GameAssistant.prototype.photoLoadedEventHandler = function()
{
	Mojo.Log.info("********** GameAssistant.prototype.photoLoadedEventHandler");
	this.timerStalled = false;
}

GameAssistant.prototype.getFirstName = function(fullName)
{
	var splitResult = fullName.split(" ");
	if (splitResult <= 1)
		return fullName;
	else 
		return splitResult[0];
}
