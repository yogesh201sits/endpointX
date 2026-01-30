import { create } from 'zustand';
import { APIResponse, Route, mockAPIResponse } from '@/data/mockData';
import axios from "axios";

const generateApi = async (prompt: String) => {
  try {
    console.log(prompt);
    const res = await axios.post(
      "http://localhost:4000/api/projects/generate",
      {
        prompt: prompt
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



interface ProjectState {
  projectId: string | null;
  baseUrl: string | null;
  files: Record<string, string>;
  routes: Route[];
  activeFile: string | null;
  openTabs: string[];
  serverStatus: 'stopped' | 'running' | 'starting';
  consoleOutput: string[];
  isGenerating: boolean;
  prompt: string;
  
  // Actions
  setPrompt: (prompt: string) => void;
  generateProject: () => Promise<void>;
  setActiveFile: (path: string) => void;
  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  toggleServer: () => void;
  addConsoleLog: (message: string) => void;
  clearConsole: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: null,
  baseUrl: null,
  files: {},
  routes: [],
  activeFile: null,
  openTabs: [],
  serverStatus: 'stopped',
  consoleOutput: [],
  isGenerating: false,
  prompt: '',

  setPrompt: (prompt) => set({ prompt }),

  generateProject: async () => {
    set({ isGenerating: true });
    get().addConsoleLog('[INFO] Generating project from prompt...');
    
    // Simulate API call delay
    // await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use mock data
    // const response: APIResponse = mockAPIResponse;
    const response: APIResponse = await generateApi(get().prompt);
    
    set({
      projectId: response.projectId,
      baseUrl: response.url,
      files: response.files,
      routes: response.routes,
      isGenerating: false,
      activeFile: 'server.js',
      openTabs: ['server.js'],
    });
    
    get().addConsoleLog(`[SUCCESS] Project generated: ${response.projectId}`);
    get().addConsoleLog(`[INFO] Base URL: ${response.url}`);
    get().addConsoleLog(`[INFO] Files created: ${Object.keys(response.files).length}`);
    get().addConsoleLog(`[INFO] Routes available: ${response.routes.length}`);
  },

  setActiveFile: (path) => {
    const { openTabs } = get();
    if (!openTabs.includes(path)) {
      set({ openTabs: [...openTabs, path] });
    }
    set({ activeFile: path });
  },

  openFile: (path) => {
    const { openTabs } = get();
    if (!openTabs.includes(path)) {
      set({ openTabs: [...openTabs, path] });
    }
    set({ activeFile: path });
  },

  closeTab: (path) => {
    const { openTabs, activeFile } = get();
    const newTabs = openTabs.filter(t => t !== path);
    set({ openTabs: newTabs });
    
    if (activeFile === path) {
      set({ activeFile: newTabs.length > 0 ? newTabs[newTabs.length - 1] : null });
    }
  },

  toggleServer: () => {
    const { serverStatus } = get();
    
    if (serverStatus === 'stopped') {
      set({ serverStatus: 'starting' });
      get().addConsoleLog('[INFO] Starting server...');
      
      setTimeout(() => {
        set({ serverStatus: 'running' });
        get().addConsoleLog('[SUCCESS] Server running on port 3000');
        get().addConsoleLog('[INFO] MongoDB connected successfully');
      }, 1500);
    } else if (serverStatus === 'running') {
      set({ serverStatus: 'stopped' });
      get().addConsoleLog('[INFO] Server stopped');
    }
  },

  addConsoleLog: (message) => {
    const timestamp = new Date().toLocaleTimeString();
    set(state => ({
      consoleOutput: [...state.consoleOutput, `[${timestamp}] ${message}`]
    }));
  },

  clearConsole: () => set({ consoleOutput: [] }),
}));
