import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Database, Eye } from "lucide-react";
import { useState } from "react";

export function LeftPanel() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState(`// Generated Prisma Schema
generator client {
  provider = "prisma-client-js"
}


}`);

  return (
    <div className="h-full flex flex-col gap-4 p-4 border-r border-border">
      {/* AI Schema Builder */}
      <Card className="shadow-panel">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 stroke-current text-green-500" />
            AI Schema Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your backend (e.g., Blog API with Posts & Comments, E-commerce with Products & Orders, User management system...)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24 resize-none bg-input border-border"
          />
          <Button className="w-full gap-2" disabled={!prompt.trim()}>
            <Sparkles className="h-4 w-4" />
            Generate Schema
          </Button>
          {prompt && (
            <div className="text-xs text-muted-foreground">
              AI will generate a complete Prisma schema, Express routes, and API endpoints based on your description.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schema Editor */}
      <Card className="flex-1 shadow-panel">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-success" />
              Schema Editor
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Prisma
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 rounded-lg border border-code-border bg-code-bg p-3 font-mono text-sm overflow-auto">
            <pre className="text-foreground whitespace-pre-wrap">{schema}</pre>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2 flex-1">
              <Eye className="h-4 w-4" />
              Preview DB
            </Button>
            <Button variant="outline" size="sm" className="gap-2 flex-1">
              <Database className="h-4 w-4" />
              Save Schema
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}