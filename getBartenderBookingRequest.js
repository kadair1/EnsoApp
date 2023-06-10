const promptIt = require('./prompt.js');


async function  getBartenderBookingRequest(data) {


  const prompt = [
    {
      role: "system",
      content: `You are an event planer. Draft an email to the bartender to book the bartender for the event, and confirm availability or ask for other options. 
      Strictly Output your email in a JSON Hashmap. ONLY generate JSON.
      Use the format {"To" : "To address", "Subject" : "Subject of the email", "Body" : "Body of the email"}`
    },
    {
      role: "user",
      content: `
      Bartender  info :
       ${JSON.stringify(data.barServer)},
      Venue info : 
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
    data.BartenderBookingRequest = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.BartenderBookingRequest = answer;
    }
    catch (e) { 
      await getBartenderBookingRequest(data);
    }
  }

}


module.exports = getBartenderBookingRequest;