import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import fs, { writeFileSync } from "fs";
const MODEL_ID = "stability.stable-diffusion-xl-v1";
const APPLICATION_JSON = "application/json";
const FILE = "tiger.png";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const stabilityImageConfig = {
  text_prompts: [
    {
      text: "a photo of a tiger",
    },
  ],
  height: 512,
  width: 512,
  cfg_scale: 10,
  style_preset: "3d-model",
};

async function invokeModel() {
  const response = await client.send(
    new InvokeModelCommand({
      modelId: MODEL_ID,
      accept: APPLICATION_JSON,
      contentType: APPLICATION_JSON,
      body: JSON.stringify(stabilityImageConfig),
    })
  );

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  saveImage(responseBody.artifacts[0].base64, FILE);
}

function saveImage(base64Data: string, fileName: string) {
  const imageBuffer = Buffer.from(base64Data, "base64");
  writeFileSync(fileName, imageBuffer);
  console.log("image", fileName);
}

invokeModel();
