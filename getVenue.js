const promptIt = require('./prompt.js');
const fs = require('fs');

const venueList = fs.readFileSync(`${__dirname}/data/eventVenues.tsv`, 'utf8');


async function  getVenue(data) {


  const prompt = [
    {
      role: "system",

      content: `You are an event planner. You need to select the best venue among the ones provided in the following list ${venueList}.
Strictly output your choice in a JSON Hashmap of the following format: {"name": "Name of the venue", "id": "idofthevenue", "why": "description of why this venue will fit this event"}. ONLY RETURN THE JSON HASHMAP!`
    },
    {
      role: "user",
      content: `${JSON.stringify(data)}`
    }
  ]

  let answer = await promptIt(prompt);
  try{
    answer = JSON.parse(answer.answer);
  }
  catch(e) {
    console.log("bad request");
    try {
      eval("answer = "  + answer.answer);
    }
    catch (e) { 
      console.log("bad JSON, retry");
      await getVenue(data);
      return;
    }
  }
  answer.metadata = {};
  // find the metadata in the csv
  
  const lines = venueList.split('\n');
  const headers = lines[0].split('\t');
  for (line of lines) {
    if (line.indexOf(answer.name) > -1) {
      const metadata = line.split('\t');
      for (let i = 0; i < headers.length; i++) {
        answer.metadata[headers[i]] = metadata[i];
      }
  
    }
  } 
  

  data.venue = answer;


  console.log(answer);
}

module.exports = getVenue;
