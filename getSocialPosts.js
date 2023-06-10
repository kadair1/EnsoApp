const promptIt = require('./prompt.js');


async function  getSocialPosts(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and the mood is ` + data.mood + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are a trained social media marketing manager. Create two concise (100 characters) separate posts, clearly labeled, for Twitter and Instagram to promote the Salon. Strictly output your choice in a JSON Hashmap with the key post_content.`
    },
    {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);

  console.log(answer);

  data.socialposts = answer.answer;

}


module.exports = getSocialPosts;
