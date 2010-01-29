var NUMBER_OF_ROUNDS = 5;

function Game(targets, distractors)
{
	//Passed an array of targets
	Mojo.Log.info("------- Game(targets, distractors)");
	Mojo.Log.info("----------- NUMBER_OF_ROUNDS " + NUMBER_OF_ROUNDS );
	Mojo.Log.info("----------- targets.length " + targets.length );
	this.rounds = new Array();
	
	for (var i = 0; i<NUMBER_OF_ROUNDS; i++)
	{
		Mojo.Log.info("------- Creating round number = "+ i);
		//TODO - Probably should send different distractors each time here.  Suppose we could just send
		//distractors[i..i+4];
		var d = new Array();
		for (j = i*5; j< NUMBER_OF_ROUNDS*5; j++)
		{
			d.push(distractors[j]);
		}
		this.rounds[i] = new Round(targets[i], d);
	}
}

