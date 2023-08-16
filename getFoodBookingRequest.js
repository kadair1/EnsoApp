const promptIt = require('./prompt.js');

async function getFoodBookingRequest(data) {
  const prompt = [
    {
      role: "system",
      content: `You are an event planner. Draft an email to the catering provider to book the food for the event, and confirm availability or ask for other options.`
    },
    {
      role: "user",
      content: `
      Food provider info:
      ${JSON.stringify(data.food)},
      Venue info: 
      ${JSON.stringify(data.venue)},

      Event Details:
      ${JSON.stringify(data.what)} ${JSON.stringify(data.where)} ${JSON.stringify(data.when)} 
      `
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  try {
    let emailParts = answer.answer.split('\n');
    data.getFoodBookingRequest = {
      "To" : emailParts[0],
      "Subject" : emailParts[1],
      "Body" : emailParts.slice(2).join('\n')
    };
  }
  catch (e) {
    console.log("FOOD FAILS bad JSON, retry");
    await getFoodBookingRequest(data);
  }
}

module.exports = getFoodBookingRequest;