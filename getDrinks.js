const promptIt = require('./prompt.js');


async function  getDrinks(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and the mood is ` + data.mood + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are a bar tender. Suggest drinks and cocktails for the event. Output a markdown listing 5 suggested cocktails, their reicipy and why thy fit the mood`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  data.drinks = answer.answer;

}


module.exports = getDrinks;