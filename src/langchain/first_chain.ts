import { Bedrock } from "@langchain/community/llms/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LINE, REGION } from "../constant";

const model = new Bedrock({
  model: "amazon.titan-text-express-v1",
  region: REGION,
});

async function invokeModel() {
  const response = await model.invoke(
    "what is the fastest vehicle in the world"
  );
  console.log(LINE);
  console.log(response);
}

async function firstChain() {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "write a description about the product provided by the user"],
    ["human", "{product_name}"],
  ]);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    product_name: "play station",
  });

  console.log(LINE);
  console.log(response);
}

invokeModel();
firstChain();
