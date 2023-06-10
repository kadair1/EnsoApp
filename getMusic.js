const promptIt = require('./prompt.js');
const fs = require('fs');
const musicians = fs.readFileSync('./data/eventMusicians.tsv', 'utf8');

async function  getMusic(data) {
  const userPrompt = `The event venue is ` + data.venue.name + ` and the mood is ` + data.mood + ". ";


  const prompt = [
    {
      role: "system",
      content: `You are a DJ. Suggest 1 music ideas for the event to the host. Strictly Output your choice in a JSON Hashmap with the key atrributes for music.  Output your choice in a JSON Hashmap of the following format: {"name": "Name of the musisian", "why": "description of why this music will fit this event"}. ONLY RETURN THE HASHMAP! Use these options:
   ${musicians}
      `},     
      {
      role: "user",
      content: userPrompt
    }
  ]

  let answer = await promptIt(prompt);
  

  answer = JSON.parse(answer.answer);

  answer.metadata = {};
  // find the metadata in the csv
  
  const lines = musicians.split('\n');
  const headers = lines[0].split('\t');
  for (line of lines) {
    if (line.indexOf(answer.name) > -1) {
      const metadata = line.split('\t');
      for (let i = 0; i < headers.length; i++) {
        answer.metadata[headers[i]] = metadata[i];
      }
  
    }
  } 

  data.music = answer;

}


module.exports = getMusic;