import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { llm } from "./llm.js";
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * Zod schema for API specification
 */
export const userApiSchema = z.object({
  entity: z.string(),

  fields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean()
    })
  ),

  routes: z.array(
    z.object({
      basePath: z.string(),
      methods: z.array(
        z.object({
          method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
          description: z.string()
        })
      )
    })
  )
});

const parser = StructuredOutputParser.fromZodSchema(userApiSchema);

/**
 * Prompt template for generating API schema from user prompt
 */
const generateApiPrompt = PromptTemplate.fromTemplate(`
You are an expert backend engineer. Return ONLY valid JSON. No explanations.

Generate an Express CRUD API specification based on the following user prompt:

"{user_prompt}"

Rules:
- Extract entities from the user prompt
- Each entity MUST have exactly ONE basePath
- Group all CRUD operations under the same basePath
- Do NOT repeat basePath
- Each basePath must contain a "methods" array
- Follow the schema strictly

{format_instructions}
`);

/**
 * Generates structured CRUD API schema from user input
 */
export async function generateUserApiSchema(userPrompt) {
  const prompt = await generateApiPrompt.format({
    user_prompt: userPrompt,
    format_instructions: parser.getFormatInstructions()
  });

  // Using raw invoke with chat-like input
  const response = await llm.invoke([{ role: "user", content: prompt }]);

  return parser.parse(response.content);
}
