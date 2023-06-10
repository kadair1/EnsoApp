const fs = require('fs');

const express = require('express');

const getVenue = require('./getVenue');

const generateFinalPDF = require('./generateFinalPDF');

const getMusic = require('./getMusic');
const getFood = require('./getFood');
const getDrinks = require('./getDrinks');
const getBookingRequest = require('./getBookingRequest');
const getFoodBookingRequest = require('./getFoodBookingRequest');
const getBartenderBookingRequest = require('./getBartenderBookingRequest');

const getInvitation = require('./getInvitation');
const getReminderEmail = require('./getReminderEmail');
const getTextConfirmation = require('./getTextConfirmation');
const getSocialPosts = require('./getSocialPosts');
const getSponsorPitchDeck = require('./getSponsorPitchDeck');
const getAudioInvite = require('./getAudioInvite');
const getBarServer = require('./getBarServer');
const getCoverImage = require('./getCoverImage');
const getMusicBookingRequest = require('./getMusicBookingRequest');

const app = express()
const port = process.env.PORT || 3000

// body parser json
app.use(express.json());

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// a global that store the answers :D
let ANSWERS = {};

if (fs.existsSync('./answers.cache.json')) { 
    ANSWERS = JSON.parse(fs.readFileSync('./answers.cache.json', 'utf8'));
}

function cacheIt() {
    fs.writeFileSync('./answers.cache.json', JSON.stringify(ANSWERS, null, 2), 'utf8');
}

app.post('/create', async (req, res) => {
 
        // json body

    const id = generateId();
 
    res.json({
        id : id
    });


    // get body as a json
    let data = req.body;
    data.id = id;
    ANSWERS[id] = data;

    console.log("\n--------Getting Venue--------");
    await getVenue(data);
    cacheIt();

    console.log("\n--------Getting Music--------");
    await getMusic(data);
    cacheIt();

    console.log("\n--------Getting Food--------");
    await getFood(data);
    cacheIt();

    console.log("\n--------Getting BarServer--------");
    await getBarServer(data);

    console.log("\n--------Getting Drinks--------");
    await getDrinks(data);
    cacheIt();

    console.log("\n--------Getting Booking Request--------");
    await getBookingRequest(data);
    cacheIt();

    console.log("\n--------Getting Booking Request--------");
    await getFoodBookingRequest(data);
    cacheIt();

    console.log("\n--------Getting Booking Request--------");
    await getBartenderBookingRequest(data);
    cacheIt();
    

    console.log("\n--------Getting Booking Request--------");
    await getMusicBookingRequest(data);
    cacheIt();

    console.log("\n--------Getting Invitation--------");
    await getInvitation(data);
    cacheIt();

    console.log("\n--------Getting Social Posts --------");
    await getSocialPosts(data);
    cacheIt();

    console.log("\n--------Getting Reminder Email --------");
    await getReminderEmail(data);
    cacheIt();

    console.log("\n--------Getting Text Confirmation --------");
    await getTextConfirmation(data);
    cacheIt();

    console.log("\n--------Getting Sponsor Pitch Deck --------");
    await getSponsorPitchDeck(data);
    cacheIt();

    console.log("\n--------Getting Cover Image --------");
    await getCoverImage(data);
    console.log("\n--------Getting Audio Invite --------");
    await getAudioInvite(data);
    //console.log("\n--------Getting Video Invite --------");
    //await getVideoInvite(data);

    data.ready = true;
    console.log(data);
    
   // await generateFinalPDF(data);
   cacheIt();

});

app.get('/status/:id', (req, res) => {
    const id = req.params.id;
    const data = ANSWERS[id];
    res.json(data);
});


// a function that generate a unique id that is a combination of 3 words

function generateId() {
    const first = ['happy', 'sad', 'angry', 'excited', 'depressed', 'tired', 'sleepy', 'hungry', 'thirsty', 'bored', 'sick', 'healthy', 'hot', 'cold', 'warm', 'cool', 'beautiful', 'ugly', 'pretty', 'handsome', 'cute', 'adorable', 'smart', 'dumb', 'stupid', 'funny', 'weird', 'strange', 'normal', 'crazy'];
    const second = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'snake', 'lizard', 'frog', 'cow', 'pig', 'horse', 'sheep', 'goat', 'chicken', 'duck', 'turkey', 'deer', 'bear', 'lion', 'tiger', 'monkey', 'gorilla', 'elephant', 'giraffe', 'zebra', 'kangaroo', 'wolf', 'fox', 'squirrel', 'mouse', 'rat', 'spider', 'ant', 'bee', 'wasp', 'hornet', 'fly', 'mosquito', 'cockroach', 'cricket', 'grasshopper', 'beetle', 'ladybug', 'butterfly', 'moth', 'caterpillar', 'centipede', 'millipede', 'scorpion', 'snail', 'slug', 'oyster', 'clam', 'crab', 'lobster', 'shrimp', 'squid', 'octopus', 'jellyfish', 'starfish', 'seahorse', 'whale', 'dolphin', 'shark', 'seal', 'otter', 'penguin', 'polar bear', 'walrus', 'seagull', 'pelican', 'flamingo', 'ostrich', 'eagle', 'hawk', 'falcon', 'vulture', 'parrot', 'crow', 'raven', 'owl', 'woodpecker', 'peacock', 'robin', 'blue jay', 'cardinal', 'canary', 'finch', 'sparrow', 'swan', 'goose', 'duck', 'turkey', 'dove', 'pigeon', 'hummingbird', 'woodpecker', 'peacock', 'robin', 'blue jay', 'cardinal', 'canary', 'finch'];
    const third = ['run', 'walk', 'jump', 'hop', 'skip', 'swim', 'fly', 'crawl', 'slither', 'climb', 'dig', 'hide', 'sleep', 'eat', 'drink', 'play', 'fight', 'attack', 'bite', 'chew', 'lick', 'scratch', 'pounce', 'paw', 'sniff', 'smell', 'hear', 'listen', 'see', 'look', 'watch'];  

    const firstWord = first[Math.floor(Math.random() * first.length)];
    const secondWord = second[Math.floor(Math.random() * second.length)];
    const thirdWord = third[Math.floor(Math.random() * third.length)];

    const id = firstWord + '-' + secondWord + '-' + thirdWord;
    return id;
}
