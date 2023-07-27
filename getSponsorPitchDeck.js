const promptIt = require('./prompt.js');


async function  getSponsorPitchDeck(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and the mood is ` + data.mood + ". ";


  const prompt = [
    {
      role: "system",
      content: "You are a a seasoned sponsorship Manager. Create a concise email pitching the event to potential sponsors, and list out categories of businsesses and company names in an organized way for the event host to reach out to"
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