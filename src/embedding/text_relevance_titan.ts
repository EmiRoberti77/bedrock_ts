import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { cosineSimilarity } from "./similarity";
import { REGION } from "../constant";

const client = new BedrockRuntimeClient({ region: REGION });

const responses: string[] = [
  "there is a tennis court in basingstoke",
  "ferrari has won the Formula 1 world title",
  "I had a dog called leroy",
  "capital of Italy is Rome",
  "i enjoy going to the gym",
];

const question: string = "what is my favourite pass time";

type ResponsesWithEmbedding = {
  response: string;
  embedding: number[];
};

async function getEmbedding(input: string): Promise<number[]> {
  const response = await client.send(
    new InvokeModelCommand({
      contentType: "application/json",
      modelId: "amazon.titan-embed-text-v1",
      accept: "*/*",
      body: JSON.stringify({
        inputText: input,
      }),
    })
  );

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}

async function main() {
  const responsesWithEmbeddings: ResponsesWithEmbedding[] = [];
  for (const response of responses) {
    const embedding = await getEmbedding(response);
    responsesWithEmbeddings.push({
      response,
      embedding,
    });
  }

  const questionEmbedding = await getEmbedding(question);

  const similarities: {
    input: string;
    similarityValue: number;
  }[] = [];

  for (const responseWithEmbedding of responsesWithEmbeddings) {
    const similarity = cosineSimilarity(
      responseWithEmbedding.embedding,
      questionEmbedding
    );
    similarities.push({
      input: responseWithEmbedding.response,
      similarityValue: similarity,
    });
  }

  //sort the list
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarityValue - a.similarityValue
  );
  sortedSimilarities.forEach((similarity) => {
    console.log(similarity.input, similarity.similarityValue);
  });
}

main();
