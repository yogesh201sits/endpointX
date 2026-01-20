import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Terminal, FileCode, Package, Settings, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { mountFiles, installDependencies, runServer, stopServer, installDependenciesPNPM, installDependenciesPNPM2, installDependenciesPNPM3 } from "@/lib/webcontainer";
import { useToast } from "@/components/ui/use-toast";
import { url } from "inspector";

export function CenterPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeFile, setActiveFile] = useState("server.js");
  const [expandedFolders, setExpandedFolders] = useState(new Set(["root", "prisma"]));
  const [logs, setLogs] = useState<string[]>([
    "WebContainer ready. Click 'Run Server' to start..."
  ]);
  const [serverUrl, setServerUrl] = useState<string>("");
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();
  
  const sendSimplePostRequest = async () => {
  // Check if the server is running.
  if (!serverUrl) {
    addLog("❌ Server is not running. Click 'Run Server' first.");
    return;
  }

  addLog("🚀 Sending a simple POST request to /api/posts...");

  try {
    const response = await fetch(`http://localhost:3000/api/posts`, {
      method: 'get'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text(); // Use .text() for a plain text response
    
    addLog(`✅ Server responded with: "${result}"`);

  } catch (error) {
    addLog(`❌ Failed to send POST request: ${error.message}`);
  }
};

// const serverCode = `const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// // Import Models
// const User = require('./models/User');
// const Post = require('./models/Post');
// const Comment = require('./models/Comment');

// const app = express();
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.use(express.json());

// // Connect to MongoDB Atlas
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // Routes
// app.get('/api/users', async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });
// app.get('/', async (req, res) => {
//   res.send("Hello");
// });
// app.get('/api', async (req, res) => {
//   res.send("Hello api");
// });

// app.post('/api/users', async (req, res) => {
//   const user = await User.create(req.body);
//   res.json(user);
// });

// app.get('/api/posts', async (req, res) => {
//   const posts = await Post.find().populate('author');
//   res.json(posts);
// });

// app.post('/api/posts', async (req, res) => {
//       res.send("Post done");
// });

// app.get('/api/posts/:id', async (req, res) => {
//   const post = await Post.findById(req.params.id).populate('author');
//   res.json(post);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`;

//   const packageJson = `{
//   "name": "generated-api",
//   "version": "1.0.0",
//   "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   },
//   "dependencies": {
//     "express": "^4.18.2",
//     "cors": "^2.8.5",
//     "mongoose": "^7.5.0",
//     "dotenv": "^16.3.1"
//   },
//   "devDependencies": {
//     "nodemon": "^3.0.2"
//   }
// }`;

  

//   const fileStructure = [
//   {
//     type: "folder",
//     name: "models",
//     children: [
//       { type: "file", name: "User.js", path: "models/User.js", icon: FileCode },
//       { type: "file", name: "Post.js", path: "models/Post.js", icon: FileCode },
//       { type: "file", name: "Comment.js", path: "models/Comment.js", icon: FileCode }
//     ]
//   },
//   { type: "file", name: "server.js", path: "server.js", icon: FileCode },
//   { type: "file", name: "package.json", path: "package.json", icon: Package },
//   { type: "file", name: ".env", path: ".env", icon: Settings }
// ];


//   const fileContents: Record<string, { content: string; language: string }> = {
//     "server.js": { content: serverCode, language: "javascript" },
//     "package.json": { content: packageJson, language: "json" },
//     ".env": { 
//       content: `MONGODB_URI=mongodb+srv://yogeshjamdade201_db_user:L2npSkw28gat7hOK@cluster0.mongodb.net/generatedApi?retryWrites=true&w=majority
// PORT=3000
// NODE_ENV=development`,
//       language: "shell"
//     },
//     "models/User.js": {
//       content: `const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true }
// });

// module.exports = mongoose.model('User', userSchema);`,
//       language: "javascript"
//     },
//     "models/Post.js": {
//       content: `const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   published: { type: Boolean, default: false },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// });

// module.exports = mongoose.model('Post', postSchema);`,
//       language: "javascript"
//     },
//     "models/Comment.js": {
//       content: `const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   content: String,
//   post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
// });

// module.exports = mongoose.model('Comment', commentSchema);`,
//       language: "javascript"
//     }
//   };
const serverCode = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); // handle form data
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

/* ---------------- ROUTES ---------------- */

// Home page with forms
app.get('/', (req, res) => {
  res.render('index');
});

/* -------- USERS -------- */
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.render('users', { users });
});

app.post('/users', async (req, res) => {
  await User.create(req.body);
  res.redirect('/users');
});

/* -------- POSTS -------- */
app.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.render('posts', { posts });
});

app.post('/posts', async (req, res) => {
  res.send('Good post');
});

/* -------- COMMENTS -------- */
app.get('/comments', async (req, res) => {
  const comments = await Comment.find().populate('post');
  res.render('comments', { comments });
});

app.post('/comments', async (req, res) => {
  await Comment.create(req.body);
  res.redirect('/comments');
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`;

const packageJson = `{
  "name": "generated-api",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "ejs": "^3.1.9"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}`;
const fileStructure = [
  {
    type: "folder",
    name: "models",
    children: [
      { type: "file", name: "User.js", path: "models/User.js", icon: FileCode },
      { type: "file", name: "Post.js", path: "models/Post.js", icon: FileCode },
      { type: "file", name: "Comment.js", path: "models/Comment.js", icon: FileCode }
    ]
  },
  {
    type: "folder",
    name: "views",
    children: [
      { type: "file", name: "index.ejs", path: "views/index.ejs", icon: FileCode },
      { type: "file", name: "users.ejs", path: "views/users.ejs", icon: FileCode },
      { type: "file", name: "posts.ejs", path: "views/posts.ejs", icon: FileCode },
      { type: "file", name: "comments.ejs", path: "views/comments.ejs", icon: FileCode }
    ]
  },
  { type: "file", name: "server.js", path: "server.js", icon: FileCode },
  { type: "file", name: "package.json", path: "package.json", icon: Package },
  { type: "file", name: ".env", path: ".env", icon: Settings }
];

const fileStructure1 = [
  {
    type: "folder",
    name: "models",
    children: [
      { type: "file", name: "User.js", path: "models/User.js" },
      { type: "file", name: "Post.js", path: "models/Post.js" },
      { type: "file", name: "Comment.js", path: "models/Comment.js" }
    ]
  },
  {
    type: "folder",
    name: "views",
    children: [
      { type: "file", name: "index.ejs", path: "views/index.ejs" },
      { type: "file", name: "users.ejs", path: "views/users.ejs" },
      { type: "file", name: "posts.ejs", path: "views/posts.ejs" },
      { type: "file", name: "comments.ejs", path: "views/comments.ejs" }
    ]
  },
  { type: "file", name: "server.js", path: "server.js" },
  { type: "file", name: "package.json", path: "package.json" },
  { type: "file", name: ".env", path: ".env" }
];

const fileContents = {
  "server.js": { content: serverCode, language: "javascript" },
  "package.json": { content: packageJson, language: "json" },
  ".env": { 
    content: `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/generatedApi?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development`,
    language: "shell"
  },
  "models/User.js": {
    content: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});

module.exports = mongoose.model('User', userSchema);`,
    language: "javascript"
  },
  "models/Post.js": {
    content: `const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  published: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model('Post', postSchema);`,
    language: "javascript"
  },
  "models/Comment.js": {
    content: `const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
});

module.exports = mongoose.model('Comment', commentSchema);`,
    language: "javascript"
  },
  "views/index.ejs": {
    content: `<!DOCTYPE html>
<html>
<head>
  <title>API Playground</title>
</head>
<body>
  <h1>Welcome</h1>
  <h2>Create User</h2>
  <form method="POST" action="/users">
    <input type="text" name="name" placeholder="Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <button type="submit">Add User</button>
  </form>

  <h2>Create Post</h2>
  <form method="POST" action="/posts">
    <input type="text" name="title" placeholder="Title" required />
    <textarea name="content" placeholder="Content"></textarea>
    <input type="text" name="author" placeholder="Author ID" required />
    <button type="submit">Add Post</button>
  </form>

  <h2>Create Comment</h2>
  <form method="POST" action="/comments">
    <textarea name="content" placeholder="Comment"></textarea>
    <input type="text" name="post" placeholder="Post ID" required />
    <button type="submit">Add Comment</button>
  </form>

  <hr />
  <a href="/users">View Users</a> | 
  <a href="/posts">View Posts</a> | 
  <a href="/comments">View Comments</a>
</body>
</html>`,
    language: "html"
  },
  "views/users.ejs": {
    content: `<!DOCTYPE html>
<html>
<head><title>Users</title></head>
<body>
  <h1>Users</h1>
  <ul>
    <% users.forEach(u => { %>
      <li><%= u.name %> - <%= u.email %></li>
    <% }) %>
  </ul>
  <a href="/">Back</a>
</body>
</html>`,
    language: "html"
  },
  "views/posts.ejs": {
    content: `<!DOCTYPE html>
<html>
<head><title>Posts</title></head>
<body>
  <h1>Posts</h1>
  <ul>
    <% posts.forEach(p => { %>
      <li><strong><%= p.title %></strong> by <%= p.author ? p.author.name : 'Unknown' %>
        <p><%= p.content %></p>
      </li>
    <% }) %>
  </ul>
  <a href="/">Back</a>
</body>
</html>`,
    language: "html"
  },
  "views/comments.ejs": {
    content: `<!DOCTYPE html>
<html>
<head><title>Comments</title></head>
<body>
  <h1>Comments</h1>
  <ul>
    <% comments.forEach(c => { %>
      <li><%= c.content %> (Post: <%= c.post ? c.post.title : 'Unknown' %>)</li>
    <% }) %>
  </ul>
  <a href="/">Back</a>
</body>
</html>`,
    language: "html"
  }
};


  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev, message]);
  }, []);

  const handleGenerateAndRun = useCallback(async () => {
    if (isRunning) {
      // Stop server
      await stopServer();
      setIsRunning(false);
      setServerUrl("");
      addLog("⏹️ Server stopped");
      return;
    }

    try {
      setIsInstalling(true);
      addLog("🚀 Starting deployment...");
      
      // Mount files from editor
      addLog("📁 Mounting files to WebContainer...");
      await mountFiles(fileContents);
      addLog("✅ Files mounted successfully");

      // Install dependencies
      addLog("📦 Installing dependencies...");
      await installDependenciesPNPM3();
      
      addLog("✅ Dependencies installed");
      setIsInstalling(false);
      
      // Run server
      addLog("🔥 Starting server...");
      await runServer(
        "server.js",
        (logData) => {
          addLog(`[server] ${logData.trim()}`);
        },
        (url) => {
          setServerUrl(url);
          setIsRunning(true);
          addLog(`✅ Server running at ${url}`);
          toast({
            title: "Server Started",
            description: `Your API is now running at ${url}`,
          });
        }
      );



    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Error: ${errorMessage}`);
      setIsRunning(false);
      setIsInstalling(false);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [isRunning, fileContents, toast, addLog]);

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} className="select-none">
        {item.type === "folder" ? (
          <>
            <div
              className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-accent/50 rounded text-sm"
              style={{ paddingLeft: `${8 + level * 16}px` }}
              onClick={() => toggleFolder(item.name)}
            >
              {expandedFolders.has(item.name) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {expandedFolders.has(item.name) ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
              <span className="text-foreground">{item.name}</span>
            </div>
            {expandedFolders.has(item.name) && item.children && (
              <div>
                {renderFileTree(item.children, level + 1)}
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent/50 rounded text-sm",
              activeFile === item.name && "bg-accent"
            )}
            style={{ paddingLeft: `${24 + level * 16}px` }}
            onClick={() => setActiveFile(item.path ||item.name)}
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      {/* Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Code Workspace</h2>
          <div className="flex items-center gap-2">
            <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-success" : ""}>
              {isRunning ? "Running" : "Stopped"}
            </Badge>
            <Button 
              size="sm" 
              onClick={handleGenerateAndRun}
              disabled={isInstalling}
              className={isRunning ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isInstalling ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : isRunning ? (
                <Square className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isInstalling ? "Installing..." : isRunning ? "Stop" : "Run"} Server
            </Button>
            {serverUrl && (
              <Badge variant="outline" className="text-xs">
                {serverUrl}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* VS Code Style Layout */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 flex-shrink-0 border-r border-border bg-secondary/20">
          <div className="p-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">EXPLORER</h3>
            <div className="space-y-1">
              {renderFileTree(fileStructure)}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Active File Tab */}
          <div className="border-b border-border bg-secondary/10">
            <div className="flex items-center px-4 py-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-background border-b-2 border-primary">
                {(() => {
                  const fileInfo = fileStructure.find(f => f.name === activeFile) || 
                                  fileStructure.find(f => f.children?.some((c: any) => c.name === activeFile))?.children?.find((c: any) => c.name === activeFile);
                  const Icon = fileInfo?.icon || FileCode;
                  return <Icon className="h-4 w-4" />;
                })()}
                <span className="text-sm">{activeFile}</span>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={fileContents[activeFile]?.language || "javascript"}
              value={fileContents[activeFile]?.content || ""}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                wordWrap: "on",
                automaticLayout: true
              }}
            />
          </div>
        </div>
      </div>

      {/* Console */}
      <Card className="m-4 shadow-panel">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Console</span>
          </div>
          <div className="bg-code-bg border border-code-border rounded p-3 font-mono text-sm max-h-40 overflow-auto">
            {logs.map((log, i) => (
              <div key={i} className={cn(
                "mb-1",
                log.includes("❌") && "text-destructive",
                log.includes("✅") && "text-success",
                log.includes("🚀") && "text-primary",
                log.includes("[npm]") && "text-blue-400",
                log.includes("[server]") && "text-green-400",
                !log.includes("❌") && !log.includes("✅") && !log.includes("🚀") && !log.includes("[npm]") && !log.includes("[server]") && "text-muted-foreground"
              )}>
                {log}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <button onClick={sendSimplePostRequest}>Send post request</button>
      {serverUrl&&<iframe src={serverUrl} frameBorder="0"></iframe>}
    </div>
  );
}