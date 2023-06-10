const promptIt = require('./prompt.js');


async function  getMusicBookingRequest(data) {


  const prompt = [
    {
      role: "system",
      content: `You are an event planer. Draft an email to the music group to book the musician for the event, and confirm availability or ask for other options. 
      Strictly Output your email in a JSON Hashmap. ONLY generate JSON.
      Use the format {"To" : "To address", "Subject" : "Subject of the email", "Body" : "Body of the email"}`
    },
    {
      role: "user",
      content: `
      Musician  info :
       ${JSON.stringify(data.music)},
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
    data.musicBookingRequest = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("bad JSON, retry");
    try {
      eval("answer = "  + answer.answer);
      data.musicBookingRequest = answer;
    }
    catch (e) { 
      await getMusicBookingRequest(data);
    }
  }
}


module.exports = getMusicBookingRequest;