import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { llm } from "./llm.js";
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * Zod schema for API specification
 */
const userApiSchema = z.object({
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
      method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
      path: z.string(),
      description: z.string()
    })
  )
});

/**
 * 3️⃣ Structured parser
 */
const parser = StructuredOutputParser.fromZodSchema(userApiSchema);

/**
 * 4️⃣ Prompt template
 */
const generateApiPrompt = PromptTemplate.fromTemplate(`
You are an expert backend engineer.
Return ONLY valid JSON. No explanations.

Generate an Express REST API specification.

Rules:
- Routes MUST be a flat array
- Each route must include method, full path, description
- Use ":id" explicitly where needed
- Follow REST conventions strictly
- Do NOT group routes
- Do NOT omit CRUD operations

User prompt:
"{user_prompt}"

{format_instructions}
`);

/**
 * 5️⃣ Generator function
 */
export async function generateUserApiSchema(userPrompt) {
  const prompt = await generateApiPrompt.format({
    user_prompt: userPrompt,
    format_instructions: parser.getFormatInstructions()
  });

  const response = await llm.invoke([
    { role: "user", content: prompt }
  ]);

  return parser.parse(response.content);
}

