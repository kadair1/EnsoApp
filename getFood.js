const fs = require('fs');
const promptIt = require('./prompt.js');

const cateringList = fs.readFileSync(`${__dirname}/data/eventCatering.tsv`, 'utf8');

async function  getFood(data) {


  const prompt = [
    {
      role: "system",
      content: `You are helping a host to select food for his event.  Suggest a caterer and the food menu for the event. Strictly Output your choice in a JSON Hashmap with the key food.
Output your choice in a JSON Hashmap of the following format: {"name": "Name of the catering","why": "description of why this caterer / food will fit this event"}. ONLY RETURN THE HASHMAP!

Here is a list of possible choices: 
${cateringList}	
  `
    },
    {
      role: "user",
      content: JSON.stringify(data)
    }
  ]

  let answer = await promptIt(prompt);

  try {
    answer = JSON.parse(answer.answer);
  }
  catch (e) {
    console.log("bad request");
    try {
      eval("answer = "  + answer.answer);
    }
    catch (e) { 
      await getFood(data);
      return;
    }

  }
  
  if (answer.food) {
    answer = answer.food;
  }
  console.log(answer);

  answer.metadata = {};
  // find the metadata in the csv
  
  const lines = cateringList.split('\n');
  const headers = lines[0].split('\t');
  for (line of lines) {
    if (line.indexOf(answer.name) > -1) {
      const metadata = line.split('\t');
      for (let i = 0; i < headers.length; i++) {
        answer.metadata[headers[i]] = metadata[i];
      }
  
    }
  } 

  data.food = answer;

}


module.exports = getFood;