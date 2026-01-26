// Mock DB-style project
const mockProject = {
  "files": {
    "server.js": "console.log('Server running');",
    "routes/userRoutes.js": "console.log('User routes');",
    "controllers/userController.js": "console.log('User controller');",
    "models/userModel.js": "console.log('User model');",
    "data/users.js": "console.log('User data');"
  },
  "packages": ["express", "body-parser"]
};

// Function to convert DB project files to Monaco format
function convertDBProjectToMonaco(filesObj) {
  return Object.entries(filesObj).map(([path, content]) => ({
    path,
    content
  }));
}

// Testing the conversion
const monacoFiles = convertDBProjectToMonaco(mockProject.files);

console.log(monacoFiles);
