var NUMBER_OF_ANSWERS = 4;
var NUMBER_OF_QUESTIONS = 3;

function Question(question, startPoints, penaltyPoints, type, target, distractors){
	Mojo.Log.info("--------- function Question() ");
	Mojo.Log.info(question + startPoints + penaltyPoints + type + target.name + distractors.length);
	
	this.startPoints = startPoints;
	this.penaltyPoints = penaltyPoints;
	this.question = question;
	this.type = type;
	this.correctAnswerIndex = this.randomNumber(NUMBER_OF_ANSWERS - 1);
	Mojo.Log.info("---------- this.correctAnswerIndex: " + this.correctAnswerIndex);
	//Create the answers and distractors
	
	if (type == "name") {
		Mojo.Log.info("--------type==name");
		this.answers =[
			{value: distractors[0].name, contact: distractors[0], correct: false},
			{value: distractors[1].name, contact: distractors[1], correct: false},
			{value: distractors[2].name, contact: distractors[2], correct: false},
			{value: distractors[3].name, contact: distractors[3], correct: false}
		];
		this.answers[this.correctAnswerIndex] ={value: target.name, contact: target, correct: true}; 
	}
	else if (type == "company") 
	{		
		this.answers =[
			{value: distractors[0].work_history[0].company, contact: distractors[0], correct:false},
			{value: distractors[1].work_history[0].company, contact: distractors[1], correct:false},
			{value: distractors[2].work_history[0].company, contact: distractors[2], correct:false},
			{value: distractors[3].work_history[0].company, contact: distractors[3], correct:false}
		];
		this.answers[this.correctAnswerIndex] ={value: target.work_history[0].company, contact: target, correct: true};
	}
	else if (type == "title") 
	{	
		this.answers =[
			{value: distractors[0].work_history[0].title, contact: distractors[0], correct:false},
			{value: distractors[1].work_history[0].title, contact: distractors[1], correct:false},
			{value: distractors[2].work_history[0].title, contact: distractors[2], correct:false},
			{value: distractors[3].work_history[0].title, contact: distractors[3], correct:false}
		];
		this.answers[this.correctAnswerIndex] ={value: target.work_history[0].title, contact: target, correct: true};
	}
	else 
	{				
		Mojo.Log.error("***** Error: Type of question is invalid: " + type);
	}
	Mojo.Log.info("---------- Exiting function");
}

Question.prototype.randomNumber = function(max)
{
	Mojo.Log.info("--------- Creating random number");
	return Math.round(max*Math.random());
}
