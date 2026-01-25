import { generateUserApiSchema } from './ai_layer/userApiSchema.js';
import { generateCodeFromSchema } from './ai_layer/codeGenerator.js';
import { generateTempDataFiles } from './ai_layer/dataGenerator.js'; 

async function main() {
  // 1️⃣ Generate structured schema + routes
  const schemaOutput = await generateUserApiSchema();

  console.log('Generated Schema & Routes:');
  console.log(JSON.stringify(schemaOutput, null, 2));

  // 2️⃣ Generate temp data JS files (data.js)
  const tempDataFiles = await generateTempDataFiles([schemaOutput]);
  console.log('Generated Temporary Data Files:');
  console.log(JSON.stringify(tempDataFiles, null, 2));

  // 3️⃣ Generate code files from schema + routes
  const codeOutput = await generateCodeFromSchema(
    schemaOutput,       // pass the schema
    schemaOutput.routes // pass the routes
  );

  console.log('Generated Code & Packages:');
  console.log(JSON.stringify(codeOutput, null, 2));

}

main();
