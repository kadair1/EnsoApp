const fs = require('fs');
const promptIt = require('./prompt.js');

const barServerList = fs.readFileSync(`${__dirname}/data/eventBarServer.tsv`, 'utf8');

async function  getBarServer(data) {


  const prompt = [
    {
      role: "system",
      content: `You are an event host. Suggest bar servers for the event. Strictly Output your choice in a JSON Hashmap with the following format: {"name": "Name of selected server", "why": "description of why this server will fit this event"}. ONLY RETURN THE HASHMAP! 
      Choose in this list according to the need of the event.
      ${barServerList}
      `
    },
    {
      role: "user",
      content: `Event details:
      ${JSON.stringify(data.venue)}   
      when: ${data.when}
      event mood : ${data.mood}
      `
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
      await getBarServer(data);
      return;
    }

  }

  answer.metadata = {};
  // find the metadata in the csv
  
  const lines = barServerList.split('\n');
  const headers = lines[0].split('\t');
  for (line of lines) {
    if (line.indexOf(answer.name) > -1) {
      const metadata = line.split('\t');
      for (let i = 0; i < headers.length; i++) {
        answer.metadata[headers[i]] = metadata[i];
      }
  
    }
  } 
  
  data.barServer = answer;

}


module.exports = getBarServer;