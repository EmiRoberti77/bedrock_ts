import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { existsSync, readFileSync } from "fs";
import { cosineSimilarity } from "./similarity";
import { REGION } from "../constant";

const images: string[] = [
  "images/1.png",
  "images/2.png",
  "images/3.png",
  "images/cat.png",
];

interface ImageEmbedding {
  imagePath: string;
  embedding: number[];
}

interface Similarity {
  imagePath: string;
  similarityValue: number;
}

const client = new BedrockRuntimeClient({
  region: REGION,
});

async function getImageEmbedding(imagePath: string): Promise<number[]> {
  const base64image = readFileSync(imagePath).toString("base64");
  const resposne = await client.send(
    new InvokeModelCommand({
      modelId: "amazon.titan-embed-image-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputImage: base64image,
      }),
    })
  );
  const responseBody = JSON.parse(new TextDecoder().decode(resposne.body));
  return responseBody.embedding;
}

async function main() {
  //create array to store all images to that will be embedded
  const imagesEmbedded: ImageEmbedding[] = [];
  //embedd all images in the array
  for (const image of images) {
    const embeddedImage = await getImageEmbedding(image);
    imagesEmbedded.push({
      imagePath: image,
      embedding: embeddedImage,
    });
  }

  const referenceImage = images[3];
  const embeddedReferenceImage = await getImageEmbedding(referenceImage);

  const similarities: Similarity[] = [];
  //compare test image to the embedded images from the array
  for (const embeddedImage of imagesEmbedded) {
    const similarity = cosineSimilarity(
      embeddedImage.embedding,
      embeddedReferenceImage
    );
    //save similarity results
    similarities.push({
      imagePath: embeddedImage.imagePath,
      similarityValue: similarity,
    });
  }

  //sort the value in order of similarity
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarityValue - a.similarityValue
  );
  //print out result
  console.log("output of most likey image to match listed in order");
  sortedSimilarities.forEach((similarity) => {
    console.log(
      `${similarity.imagePath}: ${similarity.similarityValue.toPrecision(2)}`
    );
  });
}

main();
