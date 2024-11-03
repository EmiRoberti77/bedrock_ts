import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { Bedrock } from "@langchain/community/llms/bedrock";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { REGION } from "../constant";
const model = new Bedrock({
  model: "amazon.titan-text-express-v1",
  region: REGION,
});

const myData: string[] = [
  "its a hot day today",
  "Esther is a great football player",
  "Ema is on holiday",
  "Emi like cars",
  "Emi like programming",
  "Emi dont like long travel",
  "Emi dont like the tube in london, its always too busy",
];

const question = "does Emi like and dislike?";

async function main() {
  //create a memory vector
  const vectorStore = new MemoryVectorStore(
    new BedrockEmbeddings({
      region: REGION,
    })
  );
  //add the elements in the sample arraay as documents in the vector store
  await vectorStore.addDocuments(
    myData.map(
      (content) =>
        new Document({
          pageContent: content,
        })
    )
  );

  //build a retriever for the documents to have 2 results
  const retriever = vectorStore.asRetriever({
    k: 2, //this number will indicate the depth of the response
  });

  const result = await retriever._getRelevantDocuments(question);
  const resultList = result.map((result) => result.pageContent);

  const template = await ChatPromptTemplate.fromMessages([
    [
      "system",
      "respond to the question based on the following context {context}",
    ],
    ["user", "{input}"],
  ]);

  //create chain and pipe to model
  const chain = template.pipe(model);
  //invoke the chain
  const response = await chain.invoke({
    input: question,
    context: resultList,
  });
  //display response
  console.log(response);
}

main();
