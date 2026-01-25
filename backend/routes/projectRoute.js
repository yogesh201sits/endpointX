import express from 'express';
import Project from '../models/Project.js';
import { generateUserApiSchema } from '../services/schemaAgent.js';
import { generateCodeFromSchema } from '../services/codeAgent.js';
import { runInSandbox } from '../services/e2b.service.js';

const router = express.Router();

/**
 * CREATE + RUN PROJECT
 */
router.post('/generate', async (req, res) => {
  try {
    
    const { prompt } = req.body;

    // 1. schema agent
    const schemaOutput = await generateUserApiSchema(prompt);

    // 2. code agent
    const codeOutput = await generateCodeFromSchema(
      schemaOutput,
      schemaOutput.routes
    );

    // 3. run in sandbox
    const sandbox = await runInSandbox(codeOutput.files);

    // 4. store in DB
    const project = await Project.create({
      prompt,
      schema: schemaOutput,
      routes: schemaOutput.routes,
      files: codeOutput.files,
      packages: codeOutput.packages,
      sandbox: {
        ...sandbox,
        status: 'running'
      }
    });

    // 5. send to frontend
    res.json({
      projectId: project._id,
      url: sandbox.url,
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
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });

  const sandbox = await runInSandbox(project.files);

  project.sandbox = { ...sandbox, status: 'running' };
  await project.save();

  res.json({
    url: sandbox.url
  });
});

export default router;
