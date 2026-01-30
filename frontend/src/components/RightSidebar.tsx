import { Zap } from 'lucide-react';
import APIPlayground from './APIPlayground';

const RightSidebar = () => {
  return (
    <div className="h-full w-full flex flex-col bg-sidebar overflow-hidden">
      <div className="panel-header flex-shrink-0">
        <span className="flex items-center gap-2">
          {/* <Zap className="w-3 h-3 text-primary" /> */}
          <Zap className="w-5 h-5 text-primary animate-pulse-glow" />

          API Playground
        </span>
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto">
        <APIPlayground />
      </div>
    </div>
  );
};

export default RightSidebar;
