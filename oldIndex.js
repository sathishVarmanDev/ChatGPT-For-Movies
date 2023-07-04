import { process } from '/env'
import { Configuration, OpenAIApi } from "openai"

const setupTextarea = document.getElementById("setup-textarea")
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
    console.log("send button clicked");
    // check for value inside setupTextarea
    // if (setupTextarea.value) {
    // udpate "innerHTML" of setupInputContainer. Basically update the html code inside setupInputContainer 
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    // update "innerText" of movieBossText. It will only edit the text
    movieBossText.innerText = "Ok, just wait a second while my digital brain digests that..."
    // }

    fetchBotReply()
})

// the "response" object is auto passed to handleReponse()
const handleResponse = (response) => {
    // if "response.ok" returns false(got error)
    if (!response.ok) {
        // 'throw' allows us to create a custom error response
        // "new Error" creates a new Error object instance
        // when there is error, the code jumps to nearest catch block in fetch request
        throw new Error(`HTTP error response: ${response.status}, ${response.statusText}`)
    } else {
        // if response.ok returns true, parse the string to an object via response.json()
        console.log("fetch don");
        return response.json()
    }
}

// make fetchBotReply an async function so that we can use await keyword
// this is because " openai.createCompletion()" will take time to return a response object
const fetchBotReply = async () => {
    //openai.createCompl  etion eturns a promise where the reponse object is already converted from a json string to a javascript object
    //openai.createCompletion() returns a completion via the openai api(openai variable)
    // openai.createCompletion() needs to take an object with this format >> {model: "text-davinci-003", prompt: "your name?", max_tokens: 7,temperature: 0,}   
    const response = await openai.createCompletion({
        'model': 'text-davinci-003',
        'prompt': 'Sound enthusiastic in five words or less.'
    })

    movieBossText.innerText = response.data.choices[0].text.trim()
    // // initialize api endpoint
    // // const apiEndpoint = `https://api.openai.com/v1/completions`

    // // initialize secret key to gain access to api
    // // const secretKey = `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`

    // // send a request to the api endpoint
    // // first param is apiEndpoint & second endpoint is a JS object
    // fetch(apiEndpoint, {
    //     // post request as stated on docs
    //     method: `POST`,
    //     //headers sends the response body format & secret key
    //     headers: {
    //         // "application/json" signals that the response body is in json format
    //         "Content-Type": `application/json`,
    //         // pass secretkey to gain access to api
    //         "Authorization": `Bearer ${secretKey}`
    //     },
    //     // JSON.stringify() converts object to string
    //     body: JSON.stringify({
    //         // "text-davinci-003" is the model that openai uses 
    //         "model": "text-davinci-003",
    //         // the question to ask the api
    //         "prompt": "give me an enthusiastic response in no more than 5 words",
    //         // indicates response length. 4 indicates 1 word(approx)
    //         "max_tokens": 7,
    //         // 0 means the response will be accurate. 1 means the response will be creative
    //         "temperature": 0
    //     })
    // })
    //     // the "response" object will be auto passed to handleReponse()
    //     .then(handleResponse)
    //     .then(data => (
    //         // updates the movieBossText to the response
    //         movieBossText.innerText = data.choices[0].text
    //     ))
    //     // "error" param will be `HTTP error response: ${response.status}, ${response.statusText}`
    //     .catch(error => console.error("Fetch error:", error))

}