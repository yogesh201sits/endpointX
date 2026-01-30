import { Play, Square, Code } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import FileExplorer from './FileExplorer';
import EditorTabs from './EditorTabs';
import ConsoleOutput from './ConsoleOutput';
import MonacoEditor from './MonacoEditor';
import { cn } from '@/lib/utils';

const CenterWorkspace = () => {
  const { files, activeFile, serverStatus, toggleServer, projectId } = useProjectStore();
  
  const currentFileContent = activeFile ? files[activeFile] || '' : '';
  
  const getFileLanguage = (path: string) => {
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.ts')) return 'typescript';
    return 'javascript';
  };
  
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Code Workspace</span>
          {projectId && (
            <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded">
              {projectId}
            </span>
          )}
        </div>
        
        <button
          onClick={toggleServer}
          disabled={Object.keys(files).length === 0}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
            serverStatus === 'running'
              ? 'bg-destructive/20 text-destructive hover:bg-destructive/30'
              : serverStatus === 'starting'
              ? 'bg-status-pending/20 text-status-pending cursor-wait'
              : 'bg-primary/20 text-primary hover:bg-primary/30',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {serverStatus === 'running' ? (
            <>
              <Square className="w-4 h-4" />
              Stop Server
            </>
          ) : serverStatus === 'starting' ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Server
            </>
          )}
          <span
            className={cn(
              'status-indicator',
              serverStatus === 'running' && 'status-running',
              serverStatus === 'stopped' && 'status-stopped'
            )}
          />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* File Explorer */}
        <div className="w-56 border-r border-border bg-card flex flex-col">
          <div className="panel-header">
            <span>Explorer</span>
          </div>
          <div className="flex-1 overflow-auto">
            <FileExplorer />
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <EditorTabs />
          
          <div className="flex-1 min-h-0">
            {activeFile ? (
              <MonacoEditor
                value={currentFileContent}
                language={getFileLanguage(activeFile)}
                readOnly
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a file to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterWorkspace;
