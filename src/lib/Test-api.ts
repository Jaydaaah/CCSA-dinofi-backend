import { GroqSuggestTitle } from "./Groq-api";

async function test() {
    const response = await GroqSuggestTitle("What courses available at your school?");
    console.log(response);
}

test();