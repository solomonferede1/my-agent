import {generateText} from "ai";
// Import the google module from the ai-sdk/google package
import {google} from "@ai-sdk/google";

// Define the model to use
const {text} = await generateText({
    model: google("models/gemini-2.5-flash"),
    prompt: "What is an AI agent?",
});

console.log(text);