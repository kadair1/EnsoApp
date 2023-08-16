const promptIt = require('./prompt.js');

async function getBookingRequest(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and lets host it ` + data.when + ". ";

  const prompt = [
    {
      role: "system",
      content: `You are an event planner. Draft an email to the venue manager to book the venue, and confirm availability or ask for other options.`
    },
    {
      role: "user",
      content: JSON.stringify(data)
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);
  try {
    let emailParts = answer.answer.split('\n');
    data.bookingRequest = {
      "To" : emailParts[0],
      "Subject" : emailParts[1],
      "Body" : emailParts.slice(2).join('\n')
    };
  }
  catch(e) {
    console.log("bad JSON, retry");
    await getBookingRequest(data);
  }
}

module.exports = getBookingRequest;