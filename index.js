import { process } from '/env'
import { Configuration, OpenAIApi } from "openai"

const setupInputContainer = document.getElementById("setup-input-container")
const movieBossText = document.getElementById("movie-boss-text")
const sendButton = document.getElementById("send-btn")

//configuration is an object
// Configuration is a class that is used to create instances of configuration objects
// configuration stores the api key so that we can gain access to the openAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
  // apiKey: `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`
})

//openai is an object repsenting the openai api
//OpenAIApi is class used to create instances of openai objects
//when creating the openai object, its a must to pass the configuration objects as a param
const openai = new OpenAIApi(configuration)


sendButton.addEventListener("click", () => {
  const setupTextarea = document.getElementById("setup-textarea")
  // check for value inside setupTextarea
  if (setupTextarea.value) {
    // udpate "innerHTML" of setupInputContainer. Basically update the html code inside setupInputContainer 
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    // update "innerText" of movieBossText. It will only edit the text
    movieBossText.innerText = "Ok, just wait a second while my digital brain digests that..."
  }

  fetchBotReply(setupTextarea.value)

  fetchSynopsis(setupTextarea.value)
})

// make fetchBotReply an async function so that we can use await keyword
// this is because " openai.createCompletion()" will take time to return a response object
const fetchBotReply = async (setupTextareaValue) => {
  //openai.createCompletion eturns a promise where the reponse object is already converted from a json string to a javascript object
  //openai.createCompletion() returns a completion via the openai api(openai variable)
  // openai.createCompletion() needs to take an object with this format >> {model: "text-davinci-003", prompt: "your name?", max_tokens: 7,temperature: 0,}   
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    'prompt':
      `Generate a short message to enthusiastically say that a movie idea sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.
      ###
      movie idea: Two dogs fall in love and move to Hawaii to learn to surf.
      short message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
      ###
      movie idea: ${setupTextareaValue}
      short message:
      `,
    // specifies number of words to return as the answer. 100 tokens ≈75 words
    "max_tokens": 60
  })

  movieBossText.innerText = response.data.choices[0].text.trim()
}

const fetchSynopsis = async (setupTextareaValue) => {
  const outputText = document.getElementById("output-text")
  //response is an object that contains the answer/completion
  //openai.createCompletion() returns a promise where the response object has already between converted from a json string to a JS object
  //openai.createCompletion() must take an object as a param in this format: {model: "text-davinci-003", prompt: "your name?", max_tokens: 7,temperature: 0,}
  // the object needs to be in json format(keys need to be in string)
  const response = await openai.createCompletion({
    'model': 'text-davinci-003',
    "prompt":
      `Generate an engaging, professional and marketable movie synopsis based on a movie idea. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role. 
      ###
      movie idea: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
      synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
      ###
      movie idea: ${setupTextareaValue}
      synopsis: 
      `,
    "max_tokens": 700
  })

  const synopsis = response.data.choices[0].text.trim()
  outputText.innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

const fetchTitle = async (synopsis) => {
  const OutputTitle = document.getElementById("output-title")

  // response is a JS object. It has been auto converted from json string to JS object
  // response contains the completion/answer
  // openai.createCompletion() returns a promise where the response object is a js object
  // the object needs to be in json format. keys need to be in string format
  const response = await openai.createCompletion({
    "model": 'text-davinci-003',
    "prompt":
      ` Give me an alluring title based on a synopsis
    ###
    synopsis: The average town of Brightside is known for being one of the safest places around, until a series of ghastly and seemingly unrelated murders begin to spread fear throughout the community. With the town's police department in over their heads, Mark Cross (Harrison Ford), a private eye who left Brightside long ago for the excitement of the city, is called back into service to solve the mystery. The evidence quickly leads Mark to a criminal mastermind and a kidnapping ring that reaches far beyond the town's borders. As Mark dives deeper into the dark criminal underworld of Brightside and the criminal's den of nefarious agents, he finds himself locked in a game of cat and mouse where every clue leads to a more sinister and unexpected result. With the help of a tenacious local police officer (Alicia Silverstone), Mark must use his wit and cunning to unravel the evil plot before the murderers can bring dark justice to Brightside.
    title: Black Road
    ###
    synopsis: ${synopsis}
    title:
    `,
    "max_tokens": 25
  })

  const title = response.data.choices[0].text.trim()
  OutputTitle.innerText = title
  fetchImagePrompt(title, synopsis)
  console.log("title", title);
}

const fetchStars = async (synopsis) => {
  const outputStars = document.getElementById("output-stars")

  const response = await openai.createCompletion({
    "model": 'text-davinci-003',
    "prompt":
      `extract the names in brackets from our synopsis.
      ###
      synopsis: Los Angeles is in the grip of a crime wave and everyone is looking to the one person they can count on to get to the bottom of the mysterious cases – private detective Jimmy Jones (Robert Downey Jr.). From the rich and famous to the poor and no-name, Jimmy knows how to get results and won't accept no for an answer. Working alongside his partner in crime, the streetwise Roxie Bayani (Sandra Bullock), Jimmy takes on the toughest most complex cases, breaking the rules to get the clues no one else can. Together, they investigate the cases no one else will touch, all while evading the detectives of the LAPD, who are not always quick to trust this unorthodox duo. Through twists, turns, and daring confrontations, Jimmy and Roxie must join forces to fight the vicious underworld and uncover the dark secrets that lurk in the heart of the city.
      names: Robert Downey Jr., Sandra Bullock
      ###
      synopsis: ${synopsis}
      names: 
      `,
    "max_tokens": 30
  })

  outputStars.innerText = response.data.choices[0].text.trim()
}

const fetchImagePrompt = async (title, synopsis) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt:
      `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
      ###
      title: Love's Time Warp
      synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
      image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
      ###
      title: zero Earth
      synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
      image description:
      `,
    "temperature": 0.8,
    "max_tokens": 100
  })

  const imagePrompt = response.data.choices[0].text.trim()
  console.log("image prompt", imagePrompt);
  fetchImageUrl(imagePrompt)
}

const fetchImageUrl = async (imagePrompt) => {
  const outputImgContainer = document.getElementById("output-img-container")

  const response = await openai.createImage({
    "prompt": imagePrompt,
    "n": 1,
    "size": "256x256",
    "response_format": "url"
  })

  console.log("image url", response);
  outputImgContainer.innerHTML = `<img src="${response.data.data[0].url}">`

  //update "setupInputContainer" from loading image to a "view pitch" button
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`
  // attach event listener to "view-pitch-btn"
  document.getElementById("view-pitch-btn").addEventListener("click", () => {
    // when "view-pitch-btn" clicked, do not display the "setup-container"
    document.getElementById("setup-container").style.display = "none"
    // when "view-pitch-btn" clicked, display the "output-container" by setting its display as "flex"
    document.getElementById("output-container").style.display = "flex"
  })
} 

