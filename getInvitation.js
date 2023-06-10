const promptIt = require('./prompt.js');


async function  getInvitation(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and lets host it ` + data.when + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are the host. Draft an invitation to your guests for the event. Strictly Output your invitation in a JSON Hashmap with the key invitation.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  try {
    data.invitation = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.invitation = answer;
    }
    catch (e) { 
      await getInvitation(data);
    }
    
  }
  

}


module.exports = getInvitation;