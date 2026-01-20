import { Header } from "@/components/Header";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterPanel } from "@/components/CenterPanel";
import { RightPanel } from "@/components/RightPanel";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Main workspace */}
      <div className="flex h-[calc(100vh-4rem-4rem)] md:h-[calc(100vh-4rem)]">
        {/* Left Panel - Hidden on mobile, shown on lg+ screens */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <LeftPanel />
        </div>
        
        {/* Center Panel - Full width on mobile */}
        <div className="flex-1 min-w-0">
          <CenterPanel />
        </div>
        
        {/* Right Panel - Hidden on mobile, shown on xl+ screens */}
        <div className="w-96 flex-shrink-0 hidden xl:block">
          <RightPanel />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
