import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import projectRoutes from './routes/projectRoute.js';

const app = express();

app.use(cors());               
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/api-generator');

app.use('/api/projects', projectRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/test", async (req, res) => {
  try {
    const { url } = req.body;

    console.log("🔥 URL RECEIVED FROM FRONTEND:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("🔥 DATA FROM FETCH:", data);

    res.json({
      fetchedFrom: url,
      data: data,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
