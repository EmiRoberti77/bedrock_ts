import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });
const sentence = "Red is Ferrari most iconic colour";

async function invokeModel() {
  const resposne = await client.send(
    new InvokeModelCommand({
      contentType: "application/json",
      modelId: "amazon.titan-embed-text-v1",
      accept: "*/*",
      body: JSON.stringify({
        inputText: sentence,
      }),
    })
  );

  const resposneBody = JSON.parse(new TextDecoder().decode(resposne.body));
  console.log(resposneBody.embedding);
}

invokeModel();
