import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';
import { uploadFiles } from './utils.js';


const SANDBOX_ID = "imy69e94mite2jnxfvksv";
const sbx = await Sandbox.connect(SANDBOX_ID);

  const host = sbx.getHost(3000); 
  console.log("Backend running at:", host);
const c = await sbx.commands.run('node server.js', { 
  cwd: '/home/user/backend-app',   // <- where server.js actually is
  timeoutMs: 0 
});
console.log(c)

//   background: true
