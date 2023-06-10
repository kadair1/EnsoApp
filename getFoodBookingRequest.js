const promptIt = require('./prompt.js');


async function  getFoodBookingRequest(data) {


  const prompt = [
    {
      role: "system",
      content: `You are an event planer. Draft an email to the catering provider to book the food for the event, and confirm availability or ask for other options. 
      Strictly Output your email in a JSON Hashmap. ONLY generate JSON.
      Use the format {"To" : "To address", "Subject" : "Subject of the email", "Body" : "Body of the email"}`
    },
    {
      role: "user",
      content: `
      Food provider info :
       ${JSON.stringify(data.food)},
      Venue info : 
      ${JSON.stringify(data.venue)},

      Event Details:
      ${JSON.stringify(data.what)} ${JSON.stringify(data.where)} ${JSON.stringify(data.when)} 
      `
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  try {
    data.getFoodBookingRequest = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("FOOD FAILS bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.getFoodBookingRequest = answer;
    }
    catch (e) { 
      await getFoodBookingRequest(data);
    }
  }
}


module.exports = getFoodBookingRequest;