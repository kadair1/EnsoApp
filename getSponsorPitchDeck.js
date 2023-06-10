const promptIt = require('./prompt.js');


async function  getSponsorPitchDeck(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and the mood is ` + data.mood + ". ";


  const prompt = [
    {
      role: "system",
      content: "You are a Partnership Manager. Create a 4 to 6 slides professional presentation to pitch the event to potential sponsors purely in MD markdown format."
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  data.getSponsorPitchDeck = answer.answer;

}


module.exports = getSponsorPitchDeck;