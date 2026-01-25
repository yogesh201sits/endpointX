// tempDataGenerator.js
import { llm } from './llm.js';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

/**
 * Schema for LLM output:
 * Keys are file paths, values are JS content strings
 */
const tempDataOutputSchema = z.record(z.string());
const parser = StructuredOutputParser.fromZodSchema(tempDataOutputSchema);

/**
 * Generates temp data JS files using LLM
 * @param {Array} schemas - Array of entity schemas
 * @returns {Object} { "filePath": "fileContent" }
 */
export async function generateTempDataFiles(schemas) {
  const messages = [
    new SystemMessage(
      'You are an expert backend engineer. Return ONLY valid JavaScript code files.'
    ),
    new HumanMessage(
      `Generate a temporary data JS file for these entities with 10 sample entries each. 
- Use this format: { "filePath": "fileContent" }
- Key is the file path
- Value is JS code as string
- Return JSON only, no explanations
- dont use comments and any other extras just give only files as stated format no preamble 
- dont use comments and any other extras just give only files as stated format no preamble 
Schemas:
${JSON.stringify(schemas, null, 2)}

Return JSON matching the format above.`
    ),
  ];

  const response = await llm.invoke(messages);
  return parser.parse(response.content);
}
