import { Bedrock } from "@langchain/community/llms/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LINE, REGION } from "../constant";

const model = new Bedrock({
  model: "amazon.titan-text-express-v1",
  region: REGION,
  maxTokens: 2048,
});

async function invokeModel() {
  const response = await model.invoke("what is the fastest airplane on earth?");
  console.log(LINE);
  console.log(response);
}

async function chain() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Provide the following about the products:\n1. A funny description of each product.\n2. A serious description of each product.\n3. Describe the relationship between {product_name_1} and {product_name_2}.",
    ],
    ["human", "Why should I buy these {product_name_1} and {product_name_2}?"],
  ]);

  const chain = prompt.pipe(model);

  const response = await chain.invoke({
    product_name_1: "sun glasses",
    product_name_2: "ferrari",
  });

  console.log(LINE);
  console.log(response);
}
//invokeModel();
chain();
