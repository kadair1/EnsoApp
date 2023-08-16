const promptIt = require('./prompt.js');

async function getReminderEmail(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and let's host it ` + data.when + ". ";

  const prompt = [
    {
      role: "system",
      content: `You are an event planner. Draft a reminder email to the guests for the upcoming event.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  try {
    let emailParts = answer.answer.split('\n');
    data.ReminderEmail = {
      "To" : emailParts[0],
      "Subject" : emailParts[1],
      "Body" : emailParts.slice(2).join('\n')
    };
  }
  catch (e) {
    console.log("bad JSON, retry");
    await getReminderEmail(data);
  }
}

module.exports = getReminderEmail;