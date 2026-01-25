import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';
export async function uploadFiles(sbx, files, baseDir = '/home/user/backend-app') {
  for (const [path, content] of Object.entries(files)) {
    const fullPath = `${baseDir}/${path}`;

    await sbx.files.write(fullPath, content);
    console.log(`Uploaded: ${fullPath}`);
  }
}
export async function installPackages(sbx, packages, cwd = '/home/user/backend-app') {
  if (!packages || packages.length === 0) return;

  const cmd = `npm install ${packages.join(' ')}`;
  console.log('Installing packages:', cmd);

  const res = await sbx.commands.run(cmd, { cwd });
  console.log(res.stdout);
}
export async function startServer(
  sbx,
  {
    entry = 'server.js',
    port = 3000,
    cwd = '/home/user/backend-app'
  } = {}
) {
  await sbx.commands.run(`node ${entry}`, {
    cwd,
    background: true
  });

  const host = sbx.getHost(port);
  console.log('Backend running at:', host);

  return host;
}
