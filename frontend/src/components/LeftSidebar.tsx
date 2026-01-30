import { useState } from 'react';
import { Sparkles, Loader2, FileJson } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import MonacoEditor from './MonacoEditor';
import { cn } from '@/lib/utils';

type TabType = 'builder' | 'schema';

const LeftSidebar = () => {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const { prompt, setPrompt, generateProject, isGenerating, files } = useProjectStore();
  
  const generatedSchema = Object.keys(files).length > 0
    ? JSON.stringify({ files: Object.keys(files), count: Object.keys(files).length }, null, 2)
    : '';
  
  return (
    <div className="h-full flex flex-col bg-sidebar">
      {/* Tab Headers */}
      <div className="flex border-b border-sidebar-border">
        <button
          onClick={() => setActiveTab('builder')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors',
            activeTab === 'builder'
              ? 'bg-sidebar text-primary border-b-2 border-primary'
              : 'bg-card text-muted-foreground hover:text-foreground'
          )}
        >
          <Sparkles className="w-3 h-3" />
          Talk to AI
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors',
            activeTab === 'schema'
              ? 'bg-sidebar text-primary border-b-2 border-primary'
              : 'bg-card text-muted-foreground hover:text-foreground'
          )}
        >
          <FileJson className="w-3 h-3" />
          Generated Schema
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'builder' ? (
          <div className="flex-1 flex flex-col p-3 space-y-3 min-h-0">
            <div className="flex-1 min-h-[200px] rounded border border-border overflow-hidden">
              <MonacoEditor
                key="builder-editor"
                value={prompt}
                onChange={(v) => setPrompt(v || '')}
                language="markdown"
              />
            </div>
            
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition-colors glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateProject}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex-1 p-3 min-h-0">
            <div className="h-full rounded border border-border overflow-hidden">
              <MonacoEditor
                key="schema-editor"
                value={generatedSchema || '// No schema generated yet\n// Use Talk to AI to generate'}
                language="json"
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
