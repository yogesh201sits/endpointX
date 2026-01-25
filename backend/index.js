import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';
import { uploadFiles, installPackages, startServer } from './utils.js';

// AI layers
import { generateUserApiSchema } from './ai_layer/userApiSchema.js';
import { generateCodeFromSchema } from './ai_layer/codeGenerator.js';
import { generateTempDataFiles } from './ai_layer/dataGenerator.js';

const SANDBOX_ID = "idzh4j69ry2q0t0ot83r8";
const BASE_DIR = "/home/user/backend-app";

async function setupBackend() {
  // 1️⃣ Connect to existing sandbox
  const sbx = await Sandbox.connect(SANDBOX_ID);

  // 2️⃣ Generate structured schema + routes
  const schemaOutput = await generateUserApiSchema();
  console.log('Generated Schema & Routes:');
  console.log(JSON.stringify(schemaOutput, null, 2));

  // // 3️⃣ Generate temporary data files (e.g., data.js)    ...tempDataFiles,     
  // const tempDataFiles = await generateTempDataFiles([schemaOutput]);
  // console.log('Generated Temporary Data Files:');
  // console.log(JSON.stringify(tempDataFiles, null, 2));

  // 4️⃣ Generate code files from schema + routes
  const codeOutput = await generateCodeFromSchema(
    schemaOutput,
    schemaOutput.routes
  );
  console.log('Generated Code & Packages:');
  console.log(JSON.stringify(codeOutput, null, 2));

  const allFiles = {
    ...codeOutput.files    
  };

  await uploadFiles(sbx, allFiles, BASE_DIR);

  const packages = codeOutput.packages || [];
  await installPackages(sbx, packages, BASE_DIR);
  
  // const process = await sbx.commands.run('node server.js', { background: true });
  // console.log(process)
  const host = sbx.getHost(3000); 
  console.log("Backend running at:", host);
  const c = await sbx.commands.run('node server.js', { 
    cwd: '/home/user/backend-app',   // <- where server.js actually is
    timeoutMs: 0 
  });
  // const host = await startServer(sbx, {
  //   entry: 'server.js',
  //   port: 3000,
  //   cwd: BASE_DIR
  // });

  console.log("Backend accessible at:", host);
}

setupBackend().catch(console.error);
