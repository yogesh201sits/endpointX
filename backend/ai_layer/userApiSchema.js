import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "./llm.js";

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
 * Generates structured CRUD API schema
 */
export async function generateUserApiSchema() {
  const messages = [
    new SystemMessage(
      "You are an expert backend engineer. Return ONLY valid JSON. No explanations."
    ),
    new HumanMessage(
      `
Generate an Express CRUD API specification for a **Hotel** entity
for a **travel booking website**.

Rules:
- Group routes by basePath
- Do NOT repeat basePath
- Each basePath must contain a methods array
- Follow the schema strictly

${parser.getFormatInstructions()}
`
    )
  ];

  const response = await llm.invoke(messages);

  return parser.parse(response.content);
}
