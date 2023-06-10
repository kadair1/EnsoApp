const promptIt = require('./prompt.js');


async function  getAudioInvite(data) {
  const userPrompt = `The venue is ` + data.venue.name + ` and we are hosting it on ` + data.when + ". The mood is " + data.mood + ".";


  const prompt = [
    {
      role: "system",
      content: `You are the host. Draft a brief personalized audio voice mail invitation for your guests.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  data.audioInvite = answer.answer;

}


module.exports = getAudioInvite;