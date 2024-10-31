import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

async function invokeModel() {
  const llamaConfig = {
    prompt: "give me a dragon story",
    max_gen_len: 512,
    temperature: 0.5,
    top_p: 0.9,
  };

  const modelId = "meta.llama3-8b-instruct-v1:0";
  const response = await client.send(
    new InvokeModelCommand({
      body: JSON.stringify(llamaConfig),
      modelId,
      contentType: "application/json",
      accept: "application/json",
    })
  );

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  console.log(responseBody.generation);
}

invokeModel();
