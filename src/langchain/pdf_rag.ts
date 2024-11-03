import { Bedrock } from "@langchain/community/llms/bedrock";
import { BedrockEmbeddings } from "@langchain/community/embeddings/bedrock";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"; //this is for verion 0.1.28
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RecursiveCharacterTextSplitter,
  TextSplitter,
} from "langchain/text_splitter";
import { REGION } from "../constant";

//create model
const model = new Bedrock({
  model: "amazon.titan-text-express-v1",
  region: REGION,
});

//prepare question
const question = "SME deposits";

async function main() {
  //load the pdf document
  const loader = new PDFLoader("./pdf/report.pdf", {
    splitPages: false,
  });

  const doc = await loader.load();
  //split the document into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    separators: [". \n"],
  });
  const splitterDocs = await splitter.splitDocuments(doc);

  //add chunks to vector in memory db
  const vectoreStore = new MemoryVectorStore(
    new BedrockEmbeddings({
      region: REGION,
    })
  );
  await vectoreStore.addDocuments(splitterDocs);

  //create vector retriever
  const receiver = vectoreStore.asRetriever({
    k: 5,
  });
  const result = await receiver._getRelevantDocuments(question);
  const resultDocs = result.map((content) => content.pageContent);

  //build template
  const template = ChatPromptTemplate.fromMessages([
    ["system", "answer the questions from the following context {context}"],
    ["user", "{input}"],
  ]);

  //create chain and attach to model
  const chain = template.pipe(model);

  const response = await chain.invoke({
    input: question,
    context: resultDocs,
  });

  console.log(response);
}

main();
