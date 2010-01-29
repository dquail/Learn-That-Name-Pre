var QUESTIONS = [
					{question: "Who is this?", startPoints: 300, penaltyPoints: 50, type: "name"},
					{question: "Where do they work?", startPoints: 300, penaltyPoints: 50, type: "company"},
					{question: "What's their title?", startPoints: 300, penaltyPoints: 50, type: "title"}
				];
 
function Round(target, distractors)
{
	Mojo.Log.info("----- Round(targets, distractors)");
	this.questions = new Array();
	Mojo.Log.info(" ---- QUESTIONS.length = " + QUESTIONS.length + " targtets.name " + target.name + " distractor.length " + distractors.length)
	this.correctContact = target;
	for (var i=0;i<QUESTIONS.length; i++)
	{
		Mojo.Log.info("----- Creating question number  = " + i);
		Mojo.Log.info(" -------- With values: " + QUESTIONS[i].question + QUESTIONS[i].startPoints + QUESTIONS[i].penaltyPoints);
		this.questions[i] = new Question(QUESTIONS[i].question, QUESTIONS[i].startPoints, QUESTIONS[i].penaltyPoints,
			QUESTIONS[i].type, target, distractors);  
	}
		
}
