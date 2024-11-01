# An Introduction to AI on AWS Bedrock: Getting Started with Titan, Llama, and Stability AI

Welcome to the world of Artificial Intelligence on AWS Bedrock! If you’re a developer just starting out with AI or looking to learn how to use AWS Bedrock to work with text and image models, this guide will help you get started. We’ll explore three main models available on Bedrock: Titan (Amazon’s text and image generator), Llama (Meta’s text model), and Stability AI for image generation.

AI can seem complex, but platforms like AWS Bedrock make it easier to experiment and build AI-driven applications by providing ready-to-use models. Let’s dive in!

### What Is AWS Bedrock?

AWS Bedrock is a platform by Amazon Web Services (AWS) that offers easy access to various AI models developed by Amazon and other providers. Bedrock provides these models as a service, so you don’t need to set up infrastructure or train models from scratch. You simply send data (like a text prompt or an image) to the model, and it returns the AI-generated response.

AWS Bedrock is designed for developers who want to add AI to their applications without worrying about complex configurations or resource management. It also allows you to switch between different models, so you can find the one that best suits your project’s needs.

Models on AWS Bedrock

### 1. Amazon Titan (Text and Image)

The Amazon Titan model is a versatile option for both text and image generation. It’s available in two main variations:

	•	Titan Text Generator: Used for tasks like text completion, generating responses, or creating summaries.
	•	Titan Image Generator: Aimed at creating images based on textual prompts, such as generating custom images from a few descriptive words.

Example Uses:

	•	Text: Automate content creation, such as generating short articles or customer service responses.
	•	Image: Use the model to create images for blog posts, advertisements, or social media by providing descriptive text.

To interact with Titan, you use AWS Bedrock’s API, where you send a request with the text or image prompt, and it returns the generated content. Titan is particularly useful if you’re looking to work with both text and images within a single framework.

sample of generated titan image and using image masking to change color of the tiger

<img width="1204" alt="Screenshot 2024-11-01 at 12 13 53" src="https://github.com/user-attachments/assets/189b3d92-7d86-4c63-a956-7b96e86403a2">

full code here - https://github.com/EmiRoberti77/bedrock_ts/blob/main/src/images/titan/edit_titan_image.ts

### 2. Meta’s Llama (Text)

Llama is a powerful text model developed by Meta (formerly Facebook). It focuses on understanding language and generating high-quality text based on the given input. Llama is available on AWS Bedrock, making it accessible for those who want to integrate it into applications without extensive setup.

Example Uses:

	•	Generate conversational responses in chatbots, making them more dynamic and engaging.
	•	Help automate document generation, where the model writes drafts or fills in the blanks based on given information.

Since Llama is highly flexible, it’s popular in customer service, automated email drafting, and any scenario where understanding context is crucial.

### tokens

Tokens are essentially segments of text that a model reads and generates. These segments can be as short as a single character or as long as a word or subword, depending on the language model and its tokenisation method. For example:

-	•	“Hello, world!” might be split into two tokens: “Hello” and “world”.
-	•	“I’m learning AI” could be broken down into several tokens: “I”, ”’m”, “learning”, and “AI”.

The model uses tokens to interpret input and produce output. Models have a limit on the number of tokens they can handle in a single request, known as the token limit or context length. The higher the token limit, the more extensive and nuanced the input and output can be.

How Tokens Work in Requests and Responses

When you send a request to a Gen AI model, the text prompt (your input) is broken down into tokens. The model processes these tokens, generating a response based on its understanding. Here’s how tokens are used in both requests and responses:

1. Request Tokens

-	•	When you submit an input prompt, it’s tokenised into segments the model can understand.
-	•	The token count for the request includes the entire input you send to the model. This affects the amount of information you can provide in a single request since the model will stop reading if you exceed the token limit.
-	•	For instance, if your model has a token limit of 4,096 tokens and you send a prompt that uses 500 tokens, you have approximately 3,596 tokens available for the model’s response.

2. Response Tokens

-	•	The model uses tokens to generate its response based on the input tokens.
-	•	Each word or subword in the response counts as a token, and the model will continue generating tokens until it reaches the response limit or completes the prompt.-
-	•	If the model’s response is too lengthy and exceeds the token limit, it will truncate or stop abruptly, so managing token usage is essential.

3. Total Token Limit

-	•	The token limit is shared between the request (input tokens) and the response (output tokens).
-	•	For example, with a 4,096-token model limit, both request and response tokens count toward this total. So, if the input takes up a significant part of the token limit, the space left for the response becomes limited.

### 3. Stability AI (Image)

Stability AI is a model that focuses exclusively on image generation. Stability AI’s models are known for creating visually impressive images based on descriptions and can be used in various creative and professional fields.

Example Uses:

	•	Generate artwork or design assets for creative projects.
	•	Create product mockups by describing the product in text.
	•	Develop quick visuals for social media or blog content without needing custom photography.

Stability AI on Bedrock lets you turn text prompts into images. For instance, if you provide a prompt like “a scenic mountain at sunrise,” Stability AI will generate an image that matches your description. It’s a great tool for developers working on projects that need custom visuals.

## How to Use AWS Bedrock Models

To work with these models on AWS Bedrock, you’ll use the AWS SDK to send requests to the models, typically using either Python or JavaScript. Here’s a brief overview of the steps:

	1.	Set Up AWS SDK: First, you’ll need the AWS SDK for your language. You can install it using pip for Python (pip install boto3) or npm for Node.js (npm install @aws-sdk/client-bedrock-runtime).
	2.	Create a Client: Use the AWS SDK to create a Bedrock client in your code. The client will be your connection to the Bedrock models.
	3.	Send a Request: Depending on the model you’re using (Titan, Llama, or Stability AI), structure your request with the relevant parameters. For example, with Titan Image, you’ll send a text prompt describing the image you want. With Llama, you’ll input text or a question that you’d like answered.
	4.	Receive and Use the Response: The model will return generated text or image data, which you can then integrate into your application or save for later use.

Here’s a very basic example in Python to generate text with the Llama model:

```typescript
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
```

### This example is a simple starting point. With a little tweaking, you can use similar code to generate images, create conversations, and more.

Practical Tips for Working with Bedrock Models

	•	Experiment with Prompts: Small changes to your prompt can lead to significantly different outputs. Testing different descriptions or questions will help you learn how each model responds best.
	•	Understand Model Strengths: Each model has its strengths. Titan is general-purpose, Llama is more conversational and context-aware, and Stability AI is ideal for high-quality image creation.
	•	Handle Responses Carefully: Some outputs might need post-processing. For instance, images generated by Stability AI might require formatting or resizing, while text might need trimming for readability.

### Wrapping Up

AWS Bedrock opens up the world of AI for developers by offering access to Titan, Llama, and Stability AI in a way that’s accessible and manageable. Whether you’re aiming to add text generation, create automated customer support responses, or generate images on the fly, these models provide tools to make it possible.

This guide is just the beginning. As you get comfortable, dive deeper into each model’s documentation to unlock even more possibilities and customise them for your projects. AI is a constantly evolving field, and AWS Bedrock makes it easier for developers to start experimenting and innovating with AI.

Happy coding! - Emi Roberti 🧑‍💻
