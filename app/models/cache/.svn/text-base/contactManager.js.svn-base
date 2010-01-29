function ContactManager(contacts)
{
	Mojo.Log.info("---- ContactManager(contacts)");
	Mojo.Log.info("contacst length: "+ contacts.length);
	this.contacts = contacts;	
	//For now, start at a random spot in contacts array
	this.lastContactUsedIndex  = Math.round(this.contacts.length*Math.random());
	Mojo.Log.info("set this.lastContactUsedIndex to " + this.lastContactUsedIndex)
	//this.lastContactUsedIndex = 0;
}

ContactManager.prototype.getTargets = function()
{
	/*This needs to return 5 targets that have pic, and work history from 
	this.contacts.  It should really read from a cookie to see the last
	place that it started reading from the contacts array but it's gonna
	start reading at a random spot each time*/
	
	//get a random number to start iterating
	Mojo.Log.info("----- ContactManager.prototype.getTargets");

	Mojo.Log.info("-LastContactUsedIndex = " + this.lastContactUsedIndex);
	var i = this.lastContactUsedIndex + 1;
	var rValue = new Array();
	while (rValue.length < 5)
	{
		if (i == this.lastContactUsedIndex)
		{
			//We're back at the lastContactUsedIndex and haven't found enough
			//Don't want to loop indefinitly
			this.Mojo.Log.error("ContactManager.prototype.getTargets Error - couldn't find enough.  Found:" + this.targets.length);
			return;
		}
		else if (i >= this.contacts.length )
		{
			//At end of the list so start again.
			Mojo.Log.info("At end of contacts array, resetting to 0");
			i = 0;
		}
		Mojo.Log.info("Getting contact " + i + " of " + this.contacts.length);
		var contact = this.contacts[i];
		Mojo.Log.info("Contact type of: "+ typeof(contact));
		Mojo.Log.info("type of photo: " + typeof(contact.photo_url) + " typeof work_history: " + typeof(contact.work_history));
		if ((typeof(contact.photo_url)!="undefined") && (typeof(contact.work_history)!="undefined")&&(typeof(contact.name)!="undefined"))
		{
			//We know we have a photo and work history.  Make sure that 
			//Work history has title and company
			Mojo.Log.info("-- ContactManager.prototype.getContacts - pushing "+contact.name );
			rValue.push(contact);
			
		}			
		
		i++;
	}
	this.lastContactUsedIndex = i;
	return rValue;	
}

ContactManager.prototype.getDistractors = function()
{
	/*This needs to return 25 distractors that have work history from 
	this.contacts.  It should really read from a cookie to see the last
	place that it started reading from the contacts array but it's gonna
	start reading at a random spot each time*/
	
	//get a random number to start iterating
	Mojo.Log.info("----- ContactManager.prototype.getDistractors");

	Mojo.Log.info("-LastContactUsedIndex = " + this.lastContactUsedIndex);
	var i = this.lastContactUsedIndex + 1;
	var rValue = new Array();
	while (rValue.length < 25)
	{
		if (i == this.lastContactUsedIndex)
		{
			//We're back at the lastContactUsedIndex and haven't found enough
			//Don't want to loop indefinitly
			this.Mojo.Log.error("ContactManager.prototype.getTargets Error - couldn't find enough.  Found:" + this.targets.length);
			return;
		}
		else if (i == this.contacts.length )
		{
			//At end of the list so start again.
			Mojo.Log.info("At end of array, setting to 1");
			i = 1;
		}
		Mojo.Log.info("Getting contact " + i + " of " + this.contacts.length);
		var contact = this.contacts[i];
		Mojo.Log.info(" contact: " + contact.name);
		Mojo.Log.info("typeof contact: "+ typeof(contact) + " typeof work_histry "+ typeof(contact.work_history) +  "typeof name " + typeof(contact.name));
		if (typeof(contact.work_history)!="undefined")
		{
			//We know we have a photo and work history.  Make sure that 
			//Work history has title and company
			Mojo.Log.info("-- ContactManager.prototype.getContacts - pushing "+contact.name );
			rValue.push(contact);
			
		}			
		
		i++;
	}
	this.lastContactUsedIndex = i;
	return rValue;	
}