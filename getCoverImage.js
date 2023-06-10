const promptIt = require('./prompt.js');


async function  getCoverImage(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and my mood is ` + data.mood + ". The venue mood is " + data.venue.metadata.mood + ".";


  const prompt = [
    {
      role: "system",
      content: `You are an event host. Create a prompt to create a cover image for the event by combining the venue mood and the user's mood.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  data.imagePrompt = answer.answer;

}

module.exports = getCoverImage;