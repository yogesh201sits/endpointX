import { Button } from "@/components/ui/button";
import { Code, Download, Upload, Plus, Github, Sun, Moon } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { useState } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-8 md:w-16 md:h-10 rounded-lg bg-transparent">
            <img src="logo.png" alt="My Project Logo" className="object-contain w-full h-full" />
          </div>
          <h1 className="text-xl font-bold text-foreground">OneClickAPI</h1>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Desktop Quick Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Schema
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Code
          </Button>
          
          <div className="w-px h-6 bg-border mx-2" />
          
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}