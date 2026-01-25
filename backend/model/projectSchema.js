import mongoose from "mongoose";

/**
 * HTTP Method inside a route group
 */
const MethodSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      required: true
    },
    description: {
      type: String
    }
  },
  { _id: false }
);

/**
 * Route group (single endpoint with multiple methods)
 * e.g. /api/posts -> GET, POST, DELETE
 */
const RouteSchema = new mongoose.Schema(
  {
    basePath: {
      type: String,
      required: true
    },
    methods: {
      type: [MethodSchema],
      default: []
    }
  },
  { _id: false }
);

/**
 * Main Project schema
 */
const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    prompt: {
      type: String
    },

    /**
     * Files stored exactly as E2B expects:
     * { "server.js": "...", "routes/postRoutes.js": "..." }
     */
    files: {
      type: Map,
      of: String,
      required: true
    },

    /**
     * AI-generated schema (dynamic)
     */
    schema: {
      type: mongoose.Schema.Types.Mixed
    },

    /**
     * API metadata for testing panel
     */
    routes: {
      type: [RouteSchema],
      default: []
    },

    /**
     * Sandbox runtime info
     */
    sandbox: {
      url: {
        type: String
      },
      status: {
        type: String,
        enum: ["idle", "running", "stopped"],
        default: "idle"
      }
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

export default mongoose.model("Project", ProjectSchema);
