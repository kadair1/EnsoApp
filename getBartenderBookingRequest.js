const promptIt = require('./prompt.js');

async function getBartenderBookingRequest(data) {
  const prompt = [
    {
      role: "system",
      content: `You are an event planner. Draft an email to the bartender to book them for the event, and confirm availability or ask for other options.`
    },
    {
      role: "user",
      content: `
      Bartender info:
      ${JSON.stringify(data.barServer)},
      Venue info: 
      ${JSON.stringify(data.venue)},

      Drinks info:
      ${data.drinks}

      Event Details:
      ${JSON.stringify(data.what)} ${JSON.stringify(data.where)} ${JSON.stringify(data.when)} 
      `
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  try {
    let emailParts = answer.answer.split('\n');
    data.BartenderBookingRequest = {
      "To" : emailParts[0],
      "Subject" : emailParts[1],
      "Body" : emailParts.slice(2).join('\n')
    };
  }
  catch (e) {
    console.log("bad JSON, retry");
    await getBartenderBookingRequest(data);
  }
}

module.exports = getBartenderBookingRequest;