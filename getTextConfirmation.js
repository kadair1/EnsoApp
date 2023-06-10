const promptIt = require('./prompt.js');


async function  getTextConfirmation(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` date: ` + data.when + ". Food: " + data.food + ". Drinks: " + data.drinks + "."

  const prompt = [
    {
      role: "system",
      content: `You are the host. Draft an A text message to communicate with the venue manager requesting availability on the proposed Event date. Message includes event details (period of time, # of guests live music, catering, etc.)
      Strictly Output your invitation in a JSON Hashmap with the key invitation.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);
  try {
    data.textConfirmation = JSON.parse(answer.answer);
  }
  catch(e) {
    try {
      eval("answer = "  + answer.answer);
      data.textConfirmation = answer;
    }
    catch (e) { 
      console.log("bad JSON, retry");
      await getTextConfirmation(data);
    }
  }
}


module.exports = getTextConfirmation;