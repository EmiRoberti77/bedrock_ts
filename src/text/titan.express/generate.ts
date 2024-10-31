import { CreateGuardrailRequestFilterSensitiveLog } from "@aws-sdk/client-bedrock";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});
async function invokeModel() {
  const titanConfig = {
    inputText: "tell me a story about a cat",
    textGenerationConfig: {
      // Wrapping the config if required
      maxTokenCount: 8192,
      stopSequences: [], // Plural if required by the API
      temperature: 0,
      topP: 1,
    },
  };

  const modelId = "amazon.titan-text-express-v1";
  const response = await client.send(
    new InvokeModelCommand({
      body: JSON.stringify(titanConfig),
      modelId,
      contentType: "application/json",
      accept: "application/json",
    })
  );

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  console.log(responseBody.results[0].outputText);
}

invokeModel();
