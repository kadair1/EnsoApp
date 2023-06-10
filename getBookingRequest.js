const promptIt = require('./prompt.js');


async function  getBookingRequest(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and lets host it ` + data.when + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are an event planer. Draft an email to the venue manager to book the venue, and confirm availability or ask for other options. 
      Strictly Output your email in a JSON Hashmap. ONLY generate JSON.
      Use the format {"To" : "To address", "Subject" : "Subject of the email", "Body" : "Body of the email"}`
    },
    {
      role: "user",
      content: JSON.stringify(data)
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);
  try {
    data.bookingRequest = JSON.parse(answer.answer);
  }
  catch( e) {
    console.log("bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.bookingRequest = answer;
    }
    catch (e) { 
      await getBookingRequest(data);
    }
  }
 }


module.exports = getBookingRequest;