const promptIt = require('./prompt.js');

async function getMusicBookingRequest(data) {
  const prompt = [
    {
      role: "system",
      content: `You are an event planner. Draft an email to the music group to book the musician for the event, and confirm availability or ask for other options.`
    },
    {
      role: "user",
      content: `
      Musician info:
      ${JSON.stringify(data.music)},
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
    data.musicBookingRequest = {
      "To" : emailParts[0],
      "Subject" : emailParts[1],
      "Body" : emailParts.slice(2).join('\n')
    };
  }
  catch (e) {
    console.log("bad JSON, retry");
    await getMusicBookingRequest(data);
  }
}

module.exports = getMusicBookingRequest;