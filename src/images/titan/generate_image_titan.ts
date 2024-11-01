import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { writeFileSync } from "fs";

const TITAN_MODEL = "amazon.titan-image-generator-v1";
const APPLICATION_JSON = "application/json";
const FILE = "dog.png";
const PROMPT = "a dog sleeping on a sofa";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function invokeModel() {
  const titan_image_config = {
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: PROMPT,
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      height: 512,
      width: 512,
      cfgScale: 8.0,
    },
  };
  const response = await client.send(
    new InvokeModelCommand({
      modelId: TITAN_MODEL,
      body: JSON.stringify(titan_image_config),
      accept: APPLICATION_JSON,
      contentType: APPLICATION_JSON,
    })
  );

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  saveImage(responseBody.images[0], FILE);
}

function saveImage(base64Image: string, fileName: string) {
  const imageBuffer = Buffer.from(base64Image, "base64");
  writeFileSync(fileName, imageBuffer);
  console.log("image", fileName);
}

invokeModel();
