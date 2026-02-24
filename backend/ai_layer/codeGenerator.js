import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { llm} from './llm.js';
import { z } from 'zod';

/**
 * Schema for structured output of code generator
 */
const codeGenSchema = z.object({
  files: z.record(z.string()), // { "path": "content" }
  packages: z.array(z.string()), // ["express", "bcrypt"]
});

const parser = StructuredOutputParser.fromZodSchema(codeGenSchema);

/**
 * Generates code files from schema + routes
 * @param {object} schema - The entity schema
 * @param {Array} routes - Array of route objects
 */
export async function generateCodeFromSchema(schema, routes) {
  // Create a prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'You are an expert backend engineer. Generate only JSON with files and packages. No explanations.'
    ],
    [
      'human',
      `Generate backend code for an Express API based on the schema and routes provided.


Schema:
{schema}

Routes:
{routes}

Instructions:

Instructions:
- Return JSON only
- Files should include controllers, routes, models as needed
-Generate a temporary data JS file for these entities with 10 sample entries each and use that add that in data folder
- Include any required NPM packages in the "packages" array
- Follow best practices
-Each route should be working you should use use data in data folder updates sould be also in that 
- Entry point should be server.js
- Use port 3000 crate all db related files but in server.js dont do any db opeartions you will have folder called data so for each entity there will be js object in separte files e.g for hotel /data/hotels.js so use this although create all models folder db config folder but in serve.js use this and also makes updates in this objects not in db 
-dont use uuid for any other like this
-when requiring package use .js e.g const hotels = require('../data/hotels.js');
-dont add .js in front of package names
-do in mvc structure
{format_instructions}`
    ]
  ]);

  // Format the messages for this generation step
  const messages = await prompt.formatMessages({
    schema: JSON.stringify(schema, null, 2),
    routes: JSON.stringify(routes, null, 2),
    format_instructions: parser.getFormatInstructions()
  });

  // Call LLM
  const response = await llm.invoke(messages);

  // Parse structured output
  return parser.parse(response.content);
}
