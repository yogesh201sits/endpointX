import express from 'express';
import Project from '../model/projectSchema.js';
import { Sandbox } from '@e2b/code-interpreter';

import { createSandbox } from '../sandbox.js';

import {uploadFiles,installPackages} from '../utils.js';

import { generateUserApiSchema } from '../ai_layer/userApiSchema.js';
import { generateCodeFromSchema } from '../ai_layer/codeGenerator.js';

const router = express.Router();

const SANDBOX_ID = await createSandbox(); 
// const SANDBOX_ID = "ixl26jhk5x85c9enexwxd"; 

const BASE_DIR = "/home/user/backend-app";

/**
 * CREATE + RUN PROJECT
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    /* 1️⃣ Generate schema */
    const schemaOutput = await generateUserApiSchema(prompt);

    /* 2️⃣ Generate code */
    const codeOutput = await generateCodeFromSchema(
      schemaOutput,
      schemaOutput.routes
    );

    /* 3️⃣ Connect to sandbox */
    const sbx = await Sandbox.connect(SANDBOX_ID);

    /* 4️⃣ Upload files */
    await uploadFiles(sbx, codeOutput.files, BASE_DIR);

    /* 5️⃣ Install packages */
    const packages = codeOutput.packages || [];
    await installPackages(sbx, packages, BASE_DIR);

    /* 6️⃣ Start server */
    await sbx.commands.run('node server.js', {
      cwd: BASE_DIR,
      timeoutMs: 0,
      background: true
    });

    const url = sbx.getHost(3000);

    /* 7️⃣ Persist project */
    // const project = await Project.create({
    //   prompt,
    //   schema: schemaOutput,
    //   routes: schemaOutput.routes,
    //   files: codeOutput.files,
    //   packages,
    //   sandbox: {
    //     url,
    //     status: 'running'
    //   }
    // });

    /* 8️⃣ Respond to frontend */
    res.json({
      projectId: "0",
      url,
      files: codeOutput.files,
      routes: schemaOutput.routes
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * RERUN PROJECT
 */
router.post('/:id/rerun', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const sbx = await Sandbox.connect(SANDBOX_ID);

    await uploadFiles(sbx, project.files, BASE_DIR);
    await installPackages(sbx, project.packages || [], BASE_DIR);

    await sbx.commands.run('node server.js', {
      cwd: BASE_DIR,
      timeoutMs: 0,
      background: true
    });

    const url = sbx.getHost(3000);

    project.sandbox = {
      sandboxId: SANDBOX_ID,
      url,
      status: 'running'
    };
    await project.save();

    res.json({ url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
