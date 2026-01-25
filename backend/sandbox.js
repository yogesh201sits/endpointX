// index.js or index.ts
import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';

// Top-level await works with tsx or Node >=18 with "type": "module"

// Create a sandbox using your custom template
const sbx = await Sandbox.create('endpx'); 
console.log('Sandbox created with ID:', sbx.sandboxId);

// List files inside sandbox root
const files = await sbx.files.list('/');
console.log('Files in sandbox root:', files);
