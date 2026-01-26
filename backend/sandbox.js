import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';

export async function createSandbox() {
  // Create sandbox from custom template
  const sbx = await Sandbox.create('endpx');

  console.log('Sandbox created with ID:', sbx.sandboxId);

  // (optional) inspect files
//   const files = await sbx.files.list('/');
//   console.log('Files in sandbox root:', files);

  // return only what you need
  return sbx.sandboxId;
  
}
