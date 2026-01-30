import { X } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/lib/utils';

const EditorTabs = () => {
  const { openTabs, activeFile, setActiveFile, closeTab } = useProjectStore();
  
  if (openTabs.length === 0) return null;
  
  return (
    <div className="flex items-center bg-card border-b border-border overflow-x-auto ide-scrollbar">
      {openTabs.map(tab => {
        const fileName = tab.split('/').pop() || tab;
        const isActive = activeFile === tab;
        
        return (
          <div
            key={tab}
            className={cn(
              'group flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer transition-colors min-w-max',
              isActive
                ? 'bg-background text-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            )}
            onClick={() => setActiveFile(tab)}
          >
            <span className="text-sm font-mono">{fileName}</span>
            <button
              className={cn(
                'p-0.5 rounded hover:bg-muted transition-opacity',
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorTabs;
