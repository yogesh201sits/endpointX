import { useProjectStore } from '@/store/projectStore';
import { Trash2 } from 'lucide-react';

const ConsoleOutput = () => {
  const { consoleOutput, clearConsole } = useProjectStore();
  
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="panel-header">
        <span>Console</span>
        <button
          onClick={clearConsole}
          className="p-1 hover:bg-secondary rounded transition-colors"
          title="Clear console"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto ide-scrollbar p-2 font-mono text-xs">
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
                className={
                  isError
                    ? 'text-destructive'
                    : isSuccess
                    ? 'text-primary'
                    : isWarning
                    ? 'text-status-pending'
                    : 'text-muted-foreground'
                }
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

export default ConsoleOutput;
