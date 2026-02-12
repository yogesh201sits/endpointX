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
    const { url, method, body } = req.body;

    console.log("=================================");
    console.log("🔥 REQUEST RECEIVED FROM FRONTEND");
    console.log("URL    :", url);
    console.log("METHOD :", method);
    console.log("BODY   :", body);
    console.log("=================================");

    let response;

    if (method === "GET") {
      response = await fetch(url);
    }
    else if (method === "POST") {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    else if (method === "DELETE") {
      response = await fetch(url, {
        method: "DELETE",
      });
    }
    else if (method === "PUT") {
      response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    console.log("🔥 RESPONSE STATUS:", response.status);

    const data = await response.json();

    console.log("🔥 DATA FROM API:", data);

    res.json({ data });

  } catch (err) {
    console.error("❌ PROXY ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});




app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
