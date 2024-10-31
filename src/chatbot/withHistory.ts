import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const EXIT = "exit";
const READY = "Ready to chat with you";
const BYE = "good bye :)";
const TITAN_MODEL = "amazon.titan-text-express-v1";
const APPLICATION_JSON = "application/json";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const humanMessage = (prompt: string) => `User: ${prompt}`;
const assistantMessage = (response: string) => `Bot: ${response}`;

const history: Array<string> = [];

function getFormattedHistory() {
  return history.join("\n");
}

function getConfiguration() {
  return {
    inputText: getFormattedHistory(),
    textGenerationConfig: {
      maxTokenCount: 4096,
      stopSequences: [],
      temperature: 0,
      topP: 1,
    },
  };
}

async function main() {
  console.log(READY);
  process.stdin.addListener("data", async (input) => {
    const userInput = input.toString().trim();
    if (userInput.toLowerCase() === EXIT) {
      console.log(BYE);
      process.exit(0);
    }
    history.push(humanMessage(userInput));
    const response = await client.send(
      new InvokeModelCommand({
        body: JSON.stringify(getConfiguration()),
        modelId: TITAN_MODEL,
        contentType: APPLICATION_JSON,
        accept: APPLICATION_JSON,
      })
    );
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const outputText = responseBody.results[0].outputText;
    console.log(outputText);
    history.push(outputText);
  });
}

main();
