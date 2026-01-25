import express from 'express';
import mongoose from 'mongoose';
import projectRoutes from './routes/project.routes.js';

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/api-generator');

app.use('/api/projects', projectRoutes);

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
