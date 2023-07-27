// initialise OPEN AI API
const fs = require('fs');
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const {encode} = require('gpt-3-encoder');
const colors = require('colors/safe');

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
});
  
  const openai = new OpenAIApi(configuration);



// const { TextServiceClient } = require("@google-ai/generativelanguage");
// const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";


// const client = new TextServiceClient({
//   authClient: new GoogleAuth().fromAPIKey(process.env.PALM_KEY),
// });


const openAIModelToPricePer1K = {
  'text-davinci-003' : 0.02,
  'gpt-3.5-turbo': 0.002,
  'gpt-4-32k': 0.12,
  'gpt-4' : 0.06
}

const openAIModelTokenLimit = {
  'text-davinci-003' :4096,
  'gpt-3.5-turbo': 4096,
  'gpt-4-32k': 32000,
  'gpt-4' : 8000
}

const openAIDefaultOptions = {
  model: 'gpt-3.5-turbo', //'text-davinci-003',
  temperature: 0.5,
  stream: false
};

function sleep(time) {
   return new Promise(resolve => setTimeout(resolve, time));
}

async function promptIt(prompt, model='gpt-3.5-turbo', option={}) {

  const start = new Date().getTime();
  model="gpt-3.5-turbo"
  option.model = model;
  
  try {
    if (model == "gpt-3.5-turbo" || model == "gpt-4-32k" || model == "gpt-4") {
      answer =  await runMessagePrompt(prompt, model, option);
    }
    else {
      answer = await runPrompt(prompt, model, option);
    }
    const end = new Date().getTime();
  
    answer.time = end-start;
    answer.start = start;
  
  
    if (!fs.existsSync(`${__dirname}/openAI-logs`)) {
      fs.mkdirSync(`${__dirname}/openAI-logs`);
    }
    // log request for stats.
    fs.writeFileSync(`${__dirname}/openAI-logs/res-${new Date().getTime()}.json`, JSON.stringify(answer, null, 2));
  
  }
  catch (e) {   
    console.log(JSON.stringify(e, null, 2));
    console.warn('OPEN AI prompt run fail, retry in 10 seconds');
    console.warn(`Response Code: ${e}`)
    await sleep(30000);
    return await promptIt(prompt, model, option);
  }
  return answer;
}

async function runMessagePrompt(prompt, model, option) {
  option = {...openAIDefaultOptions, ...option};
  if (!Array.isArray(prompt)) {
    option.messages = [{"role": "user", "content": prompt}];
  }
  else {
    option.messages = prompt;
  }
  //option.max_tokens= 4096;

  console.log(option);
  const gptResponse = await openai.createChatCompletion(option, {timeout : 120000});
 
  return {
    answer: gptResponse.data.choices[0].message.content,
    data:  gptResponse.data,
    option: option,
    cost: ((gptResponse.data.usage.total_tokens / 1000 * openAIModelToPricePer1K[model]) * 1000 | 0) / 1000
  };
}


async function runPrompt(prompt, model, option) {

  option = {...openAIDefaultOptions, ...option};

  option.prompt = prompt;

  
  if (!option.max_tokens) {
    option.max_tokens= openAIModelTokenLimit[model] - encode(prompt).length;
  } 

  console.log( prompt);
  const gptResponse = await openai.createCompletion(option, {timeout : 120000});
  console.log( colors.green(gptResponse.data.choices[0].text));
  if (gptResponse.data.choices[0].finish_reason != "stop") {
    return {
      isTruncated: true,
      answer: gptResponse.data.choices[0].text,
      data:  gptResponse.data,
      option: option,
      cost: ((gptResponse.data.usage.total_tokens / 1000 * openAIModelToPricePer1K[model]) * 1000 | 0) / 1000
    };
  }
 
  return {
    answer: gptResponse.data.choices[0].text,
    data:  gptResponse.data,
    option: option,
    cost: ((gptResponse.data.usage.total_tokens / 1000 * openAIModelToPricePer1K[model]) * 1000 | 0) / 1000
  };
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}




// async function promptPalm(prompt) {

//   let promptString = "";

//   for (let message of prompt) {
//     promptString += message.role + "\n" + message.content + "\n\n";
//   }


//   const stopSequences = [];
  
//   let answer = await client.generateText({
//     // required, which model to use to generate the result
//     model: MODEL_NAME,
//     // optional, 0.0 always uses the highest-probability result
//     temperature: 0.7,
//     // optional, how many candidate results to generate
//     candidateCount: 1,
//     // optional, number of most probable tokens to consider for generation
//     top_k: 40,
//     // optional, for nucleus sampling decoding strategy
//     top_p: 0.95,
//     // optional, maximum number of output tokens to generate
//     max_output_tokens: 8000,
//     // optional, sequences at which to stop model generation
//     stop_sequences: stopSequences,
//     // optional, safety settings
//     safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
//     prompt: {
//       text: promptString,
//     },
//   });

//   //console.log(JSON.stringify(answer, null, 2));
//   console.log('out');

//   const md = answer[0].candidates[0].output;

//   if (promptString,indexOf("JSON")) {
//     try {
//       md = md.replace(/```json/g, '').replace(/```/g, '');
//       JSON.parse(md);
      
//       return {
//         answer: md
//         }
//     }
//     catch (e) {
//       console.log('Fail JSON PARSE answer');
//       console.log(JSON.stringify(answer, null, 2));
//       return promptPalm(prompt);
//     }
//   }
//   return {
//     answer: md.replace(/```json/g, '').replace(/```/g, '')
//   };
// }
  
 

async function verifyLinks() { 


}


module.exports = promptIt;