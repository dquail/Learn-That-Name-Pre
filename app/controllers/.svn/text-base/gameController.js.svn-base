function GameController(contacts)
{
	Mojo.Log.info("this.GameController()");
	//Generate a random set of Contacts as distractors and TargetContacts
	//this.targetContacts = ContactCache.getTargetContacts(NUMBER_OF_ROUNDS);
	//this.distractorContacts = ContactCache.getDistractorContacts(5);
	this.contactManager = new ContactManager(contacts);	
	this.contacts = contacts;
	Mojo.Log.info("calling getTargets");
	this.targetContacts = this.contactManager.getTargets();
	Mojo.Log.info("calling getDistractors for distractor");
	this.distractorContacts = this.contactManager.getDistractors();	

	//Create a game object.  This will populate all of the rounds, questions, correct answers and incorrect answers
	this.game = new Game(this.targetContacts, this.distractorContacts);
	//For debugging print the game info
	this.printGameInfo();
	
	this.currentQuestion = 0;
	this.currentRound = 0;
	this.currentScore = 0;
	this.currentPointsAvailable = this.game.rounds[this.currentRound].questions[this.currentQuestion].startPoints ;
	Mojo.Log.info("--------- current points available: " + this.currentPointsAvailable);
	
	Mojo.Log.info("------------Determining the correct answer");
	for (var i = 0; i< this.game.rounds[this.currentRound].questions[this.currentQuestion].answers.length; i++)
	{	
		if 	(this.game.rounds[this.currentRound].questions[this.currentQuestion].answers[i].correct ==true)
		{
			this.currentCorrectIndex = i;
			Mojo.Log.info("******* Correct Answer index found: " + i);
		}
	}		
	
	this.lastAnswerCorrect = "false";
		
	this.results = new Array();
	Mojo.Log.info("---------------- Created Game Controller");
}
GameController.prototype.printGameInfo = function(game)
{
	Mojo.Log.info("*********** Printing info about the generated game: ");
	for (var i = 0; i< this.game.rounds.length; i++)
	{
		Mojo.Log.info("****** Round "+i);
		for (var j = 0; j<this.game.rounds[i].questions.length; j++)
		{
			Mojo.Log.info("*** Question "+ j + " " + this.game.rounds[i].questions[j].question);
			for (var k = 0; k < this.game.rounds[i].questions[j].answers.length; k++)
			{
				Mojo.Log.info("- " + this.game.rounds[i].questions[j].answers[k].value + " correct? " +this.game.rounds[i].questions[j].answers[k].correct); 
			}	
		}
				
	}
}
GameController.prototype.decreasePointsEvent = function(amount){
	//This is called every time that the timer is decreased
	//This should decrease the points remaining.
	Mojo.Log.info("****** IN DECREASEPOINTSEVENT");
	Mojo.Log.info("------- GameController.prototype.decreasePointsEvent decreasing - " + amount + " from " + this.currentPointsAvailable);
	this.currentPointsAvailable -= amount;
	Mojo.Log.info("------- GameController.prototype.decreasePointsEvent new value = " + this.currentPointsAvailable);	
}

GameController.prototype.receiveAnswer = function(answerIndex)
{
	//Receives the button number (0 based) that was clicked on
	Mojo.Log.info("========GameController.prototype.recieveAnswer()  " + answerIndex);	
	var selectedAnswer = this.game.rounds[this.currentRound].questions[this.currentQuestion].answers[answerIndex];
	Mojo.Log.info("****** selectedAnswer returned: "+ selectedAnswer.value);
	var correctAnswer;
	var result;
	this.lastAnswerIndex = answerIndex;
	//Determine the correct answer
	Mojo.Log.info("------------Determining the correct answer");
	for (var i = 0; i< this.game.rounds[this.currentRound].questions[this.currentQuestion].answers.length; i++)
	{	
		if 	(this.game.rounds[this.currentRound].questions[this.currentQuestion].answers[i].correct ==true)
		{
			correctAnswer = this.game.rounds[this.currentRound].questions[this.currentQuestion].answers[i];
			Mojo.Log.info("******* Correct Answer found: " + correctAnswer.value);
		}
	}
	if (selectedAnswer.correct == true)
	{
		//Push a result record onto the results array
		if (this.currentPointsAvailable >0)
			this.lastAnswerCorrect = "true";
		else 
			this.lastAnswerCorrect = "false";
		Mojo.Log.info("------*******------- The old total score is: " + this.currentScore);
		this.currentScore+= this.currentPointsAvailable;
		result= {
			selectedContact: selectedAnswer.contact,
			correctContact: selectedAnswer.contact,
			points: this.currentPointsAvailable,
			correct: true
			};
	}
	else{
		//Push an incorrect record onto the results array
		this.lastAnswerCorrect = "false";
		this.currentScore-= this.game.rounds[this.currentRound].questions[this.currentQuestion].penaltyPoints;
		result =  {
			selectedContact: selectedAnswer.contact,
			correctContact: correctAnswer.contact,
			points: this.game.rounds[this.currentRound].questions[this.currentQuestion].penaltyPoints,
			correct: false
			};		
	}
	this.results.push(result);
	Mojo.Log.info("------*******------- The new total score is: " + this.currentScore);
	return result;
	
}

GameController.prototype.goToNextQuestion =  function()
{
	Mojo.Log.info("========== GameController.prototype.goToNextQuestion");
	/*Game is done when
	 * - you're on the last round and the lastAnswerCorrect = false
	 * OR
	 * - you're on the last round and the lastquestion
	 */
	if (((this.currentRound == NUMBER_OF_ROUNDS -1) && (this.currentQuestion == NUMBER_OF_QUESTIONS -1))
		|| ((this.currentRound == NUMBER_OF_ROUNDS -1) && (this.lastAnswerCorrect == "false"))) 
	{
		Mojo.Log.info("**************** Return game is finished *********");
		return "finished";

	}	
	else if ((this.currentQuestion < NUMBER_OF_QUESTIONS -1 )&& this.lastAnswerCorrect == "true"){
		//Last question was correct and still a bonus question
		Mojo.Log.info("**************** Last answer was correct and still a bonus question *********");
		this.currentQuestion +=1;
	}
	else{
		//No more bonus rounds but still questions
		Mojo.Log.info("**************** Finished round **********");
		this.currentRound +=1;
		this.currentQuestion = 0;
	}
	this.currentPointsAvailable = this.game.rounds[this.currentRound].questions[this.currentQuestion].startPoints;
	//Determine the currentCorrectIndex
	Mojo.Log.info("------------Determining the correct answer");
	for (var i = 0; i< this.game.rounds[this.currentRound].questions[this.currentQuestion].answers.length; i++)
	{	
		if 	(this.game.rounds[this.currentRound].questions[this.currentQuestion].answers[i].correct ==true)
		{
			this.currentCorrectIndex = i;
			Mojo.Log.info("******* Correct Answer index found: " + i);
		}
	}		
	//this.lastAnswerCorrect = "false";
	
	Mojo.Log.info("--------- current points available: " + this.currentPointsAvailable);
	return this.game.rounds[this.currentRound].questions[this.currentQuestion];
	
}
