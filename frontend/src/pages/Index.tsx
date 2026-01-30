import { useState } from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';
import CenterWorkspace from '@/components/CenterWorkspace';
import RightSidebar from '@/components/RightSidebar';
import BottomConsole from '@/components/BottomConsole';
import { cn } from '@/lib/utils';

const Index = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Navbar 
        leftOpen={leftOpen} 
        rightOpen={rightOpen}
        onToggleLeft={() => setLeftOpen(!leftOpen)}
        onToggleRight={() => setRightOpen(!rightOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar */}
        <div
          className={cn(
            'border-r border-border flex-shrink-0 transition-all duration-300 overflow-hidden',
            leftOpen ? 'w-80' : 'w-0'
          )}
        >
          {leftOpen && (
            <div className="w-80 h-full">
              <LeftSidebar />
            </div>
          )}
        </div>
        
        {/* Left Toggle Button (when closed) */}
        {!leftOpen && (
          <button
            onClick={() => setLeftOpen(true)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors z-10"
            title="Open Left Panel"
          >
            <PanelLeft className="w-4 h-4 text-primary" />
          </button>
        )}
        
        {/* Center - Code Workspace */}
        <div className="flex-1 min-w-0">
          <CenterWorkspace />
        </div>
        
        {/* Right Toggle Button (when closed) */}
        {!rightOpen && (
          <button
            onClick={() => setRightOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors z-10"
            title="Open Right Panel"
          >
            <PanelRight className="w-4 h-4 text-primary" />
          </button>
        )}
        
        {/* Right Sidebar */}
        <div
          className={cn(
            'border-l border-border flex-shrink-0 transition-all duration-300 overflow-hidden',
            rightOpen ? 'w-80' : 'w-0'
          )}
        >
          {rightOpen && (
            <div className="w-80 h-full">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
      
      {/* Full-width Console at Bottom */}
      <BottomConsole />
    </div>
  );
};

export default Index;
