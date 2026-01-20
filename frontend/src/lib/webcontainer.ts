import { WebContainer, FileSystemTree } from "@webcontainer/api";

let webcontainerInstance: WebContainer | null = null;

export async function getWebContainer(): Promise<WebContainer> {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
    console.log("WebContainer booted");
  }
  return webcontainerInstance;
}

export async function mountFiles(files: Record<string, { content: string; language: string }>): Promise<void> {
  const webcontainer = await getWebContainer();

  const fsStructure: FileSystemTree = {};
  
  // Create directory structure
  for (const [path, fileData] of Object.entries(files)) {
    const pathParts = path.split('/');
    let current: any = fsStructure;
    
    // Navigate through directories
    for (let i = 0; i < pathParts.length - 1; i++) {
      const dir = pathParts[i];
      if (!current[dir]) {
        current[dir] = { directory: {} };
      }
      current = current[dir].directory;
    }
    
    // Add file
    const fileName = pathParts[pathParts.length - 1];
    current[fileName] = {
      file: {
        contents: fileData.content
      }
    };
  }

  await webcontainer.mount(fsStructure);
  console.log("Files mounted into WebContainer");
}

export async function installDependencies(onLog?: (data: string) => void): Promise<void> {
  const webcontainer = await getWebContainer();
  const installProc = await webcontainer.spawn("pnpm", ["install"]);

  // Read output manually
  const reader = installProc.output.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // value is already a string from WebContainer
      const logData = String(value);
      console.log("[npm]", logData);
      onLog?.(logData);
    }
  } finally {
    reader.releaseLock();
  }

  const exitCode = await installProc.exit;
  if (exitCode !== 0) {
    throw new Error("npm install failed");
  }
}

export async function installDependenciesPNPM(onLog?: (data: string) => void): Promise<void> {
  const webcontainer = await getWebContainer();
  const installProc = await webcontainer.spawn("pnpm", ["install"]);

  // Read output asynchronously
  const reader = installProc.output.getReader();
  const outputPromise = (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const logData = String(value);
        onLog?.(logData);
      }
    } finally {
      reader.releaseLock();
    }
  })();

  // Use Promise.all to wait for both the process exit and the output stream to finish
  const [exitCode] = await Promise.all([
    installProc.exit,
    outputPromise // Awaiting this ensures all output, including the 'done' signal, is processed
  ]);

  if (exitCode !== 0) {
    throw new Error("npm install failed");
  }
}


export async function installDependenciesPNPM2(onLog?: (data: string) => void): Promise<void> {
  const webcontainer = await getWebContainer();
  const installProc = await webcontainer.spawn("pnpm", ["install"]);

  // Read output asynchronously
  const reader = installProc.output.getReader();
  const outputPromise = (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const logData = String(value);
        onLog?.(logData);
      }
    } finally {
      reader.releaseLock();
    }
  })();


  // Use Promise.all to wait for both the process exit and the output stream to finish
  const [exitCode] = await Promise.all([
    installProc.exit,
    outputPromise // Awaiting this ensures all output, including the 'done' signal, is processed
  ]);

  if (exitCode !== 0) {
    throw new Error("npm install failed");
  }
}

// installDependenciesPNPM.ts

export async function installDependenciesPNPM3(): Promise<void> {
  const webcontainer = await getWebContainer();

  // Run "pnpm install"
  const installProc = await webcontainer.spawn("pnpm", ["install"]);

  // Wait for completion
  const exitCode = await installProc.exit;

  if (exitCode !== 0) {
    throw new Error(`pnpm install failed with exit code ${exitCode}`);
  }
 
}


export async function runServer(
  entry: string = "server.js", 
  onLog?: (data: string) => void,
  onReady?: (url: string) => void
): Promise<void> {
  const webcontainer = await getWebContainer();
  
  try {
    const serverProc = await webcontainer.spawn("node", [entry]);

    // Read output manually  
    const reader = serverProc.output.getReader();
     webcontainer.on('server-ready', (port, url) => {
            console.log("URL : "+url);
            console.log("Port : "+port);
            onReady?.(url)
          }); 
    const readLoop = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // value is already a string from WebContainer
          const logData = String(value);
          console.log("[server]", logData);
          onLog?.(logData);

          // Detect when server is ready
          if (logData.includes("Server running") || logData.includes("listening") || logData.includes("port")) {
            const url = "http://localhost:3000";
          }
          }
         
      } finally {
        reader.releaseLock();
      }
    };

    // Start reading output in background
    readLoop();

  } catch (error) {
    console.error("Failed to start server:", error);
    onLog?.(`Error: ${String(error)}`);
  }
}




export async function stopServer(): Promise<void> {
  // WebContainer handles process cleanup automatically
  console.log("Server stopped");
}

