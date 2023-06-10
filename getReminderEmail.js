const promptIt = require('./prompt.js');


async function  getReminderEmail(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and lets host it ` + data.when + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are an event planer. Draft an email to remind the guests of the upcmoming event. Strictly Output your email in a JSON Hashmap.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);
  try {
    data.ReminderEmail = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.ReminderEmail = answer;
    }
    catch (e) { 
      await getReminderEmail(data);
    }
  }

}


module.exports = getReminderEmail;