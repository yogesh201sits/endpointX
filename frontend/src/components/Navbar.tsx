import { Plus, Upload, Download, Terminal, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

const Navbar = ({ leftOpen, rightOpen, onToggleLeft, onToggleRight }: NavbarProps) => {
  return (
    <nav className="h-12 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Toggle Left Panel */}
        <button
          onClick={onToggleLeft}
          className={cn(
            'p-1.5 rounded transition-colors',
            leftOpen ? 'bg-secondary text-primary' : 'hover:bg-secondary text-muted-foreground'
          )}
          title={leftOpen ? 'Close Left Panel' : 'Open Left Panel'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          {/* <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <Terminal className="w-5 h-5 text-primary-foreground" />
          </div> */}
          <div className=' relative w-[15vh] h-[25vh] top-10'>
            <img src="logo2.png" style={{borderRadius:"50%"}} alt="" />
          </div>
            

          <span className="text-lg font-bold tracking-tight">
            <span className="text-gradient-primary">Endpoint</span>
            <span className="text-foreground ">X</span>
          </span>
        </div>
      </div>
      
      {/* Center - Project Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors font-medium">
          <Plus className="w-4 h-4" />
          New Project
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors">
          <Upload className="w-4 h-4" />
          Import
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Toggle Right Panel */}
        <button
          onClick={onToggleRight}
          className={cn(
            'p-1.5 rounded transition-colors',
            rightOpen ? 'bg-secondary text-primary' : 'hover:bg-secondary text-muted-foreground'
          )}
          title={rightOpen ? 'Close Right Panel' : 'Open Right Panel'}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
