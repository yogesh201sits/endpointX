import { useState } from 'react';
import { Terminal, X, Trash2, ChevronUp } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/lib/utils';

const BottomConsole = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { consoleOutput, clearConsole } = useProjectStore();
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors z-50"
        title="Open Console"
      >
        <Terminal className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Console</span>
        {consoleOutput.length > 0 && (
          <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
            {consoleOutput.length}
          </span>
        )}
      </button>
    );
  }
  
  return (
    <div className="h-48 border-t border-border bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Console</span>
          <span className="text-xs text-muted-foreground">
            ({consoleOutput.length} logs)
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={clearConsole}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
            title="Collapse console"
          >
            <ChevronUp className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
            title="Close console"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
      
      {/* Console Content */}
      <div className="flex-1 overflow-auto ide-scrollbar p-3 font-mono text-xs">
        {consoleOutput.length === 0 ? (
          <p className="text-muted-foreground">No output yet...</p>
        ) : (
          consoleOutput.map((log, index) => {
            const isError = log.includes('[ERROR]');
            const isSuccess = log.includes('[SUCCESS]');
            const isWarning = log.includes('[WARN]');
            
            return (
              <div
                key={index}
                className={cn(
                  'py-0.5',
                  isError && 'text-destructive',
                  isSuccess && 'text-primary',
                  isWarning && 'text-[hsl(var(--status-pending))]',
                  !isError && !isSuccess && !isWarning && 'text-muted-foreground'
                )}
              >
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BottomConsole;
