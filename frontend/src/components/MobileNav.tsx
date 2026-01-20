import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code2, Database } from "lucide-react";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";

export function MobileNav() {
  return (
    <div className="flex gap-2 lg:hidden">
      {/* Left Panel Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Code2 className="h-4 w-4" />
            Schema
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <LeftPanel />
        </SheetContent>
      </Sheet>

      {/* Right Panel Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Database className="h-4 w-4" />
            API Test
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-96 p-0">
          <RightPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}