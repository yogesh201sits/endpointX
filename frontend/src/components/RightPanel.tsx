import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, Database, Code2, ChevronRight } from "lucide-react";
import { useState } from "react";

export function RightPanel() {
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [response, setResponse] = useState("");

  const endpoints = [
    { method: "GET", path: "/api/posts", description: "Get all posts" },
    { method: "POST", path: "/api/posts", description: "Create a new post" },
    { method: "GET", path: "/api/posts/:id", description: "Get post by ID" },
    { method: "PUT", path: "/api/posts/:id", description: "Update post" },
    { method: "DELETE", path: "/api/posts/:id", description: "Delete post" },
    { method: "GET", path: "/api/users", description: "Get all users" },
    { method: "POST", path: "/api/users", description: "Create a new user" },
  ];

  const mockData = [
    { id: 1, title: "Getting Started with APIs", content: "Learn how to build REST APIs...", published: true, authorId: 1 },
    { id: 2, title: "Database Design Patterns", content: "Best practices for database schema...", published: false, authorId: 1 },
  ];

  const testEndpoint = () => {
    setResponse(JSON.stringify({ 
      status: 200,
      data: mockData,
      timestamp: new Date().toISOString()
    }, null, 2));
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-blue-600 hover:bg-blue-700";
      case "POST": return "bg-green-600 hover:bg-green-700";
      case "PUT": return "bg-yellow-600 hover:bg-yellow-700";
      case "DELETE": return "bg-red-600 hover:bg-red-700";
      default: return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">API Playground</h2>
      </div>
      
      <Tabs defaultValue="explorer" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="explorer" className="gap-2">
            <Code2 className="h-4 w-4" />
            API Explorer
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="flex-1 m-4 space-y-4">
          {/* Endpoints List */}
          <Card className="shadow-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Available Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {endpoints.map((endpoint, i) => (
                  <AccordionItem key={i} value={`endpoint-${i}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge className={`text-xs font-mono ${getMethodBadgeColor(endpoint.method)}`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                        <span className="text-muted-foreground text-sm">{endpoint.description}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">URL</label>
                            <Input 
                              defaultValue={`http://localhost:3000${endpoint.path}`}
                              className="mt-1 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Method</label>
                            <Select defaultValue={endpoint.method.toLowerCase()}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="get">GET</SelectItem>
                                <SelectItem value="post">POST</SelectItem>
                                <SelectItem value="put">PUT</SelectItem>
                                <SelectItem value="delete">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {(endpoint.method === "POST" || endpoint.method === "PUT") && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Request Body (JSON)</label>
                            <Textarea 
                              placeholder='{\n  "title": "New Post",\n  "content": "Post content...",\n  "authorId": 1\n}'
                              className="mt-1 font-mono text-xs min-h-20"
                            />
                          </div>
                        )}
                        
                        <Button size="sm" onClick={testEndpoint} className="gap-2">
                          <Play className="h-3 w-3" />
                          Send Request
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Response */}
          {response && (
            <Card className="shadow-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-code-bg border border-code-border rounded p-3 font-mono text-sm overflow-auto max-h-64">
                  <pre className="text-success">{response}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="database" className="flex-1 m-4">
          <Card className="shadow-panel h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Database Tables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Posts Table</h4>
                  <div className="bg-code-bg border border-code-border rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 font-medium">id</th>
                          <th className="text-left p-2 font-medium">title</th>
                          <th className="text-left p-2 font-medium">published</th>
                          <th className="text-left p-2 font-medium">authorId</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-t border-border">
                          <td className="p-2 text-primary">1</td>
                          <td className="p-2">Getting Started with APIs</td>
                          <td className="p-2 text-success">true</td>
                          <td className="p-2 text-primary">1</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-2 text-primary">2</td>
                          <td className="p-2">Database Design Patterns</td>
                          <td className="p-2 text-destructive">false</td>
                          <td className="p-2 text-primary">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Users Table</h4>
                  <div className="bg-code-bg border border-code-border rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2 font-medium">id</th>
                          <th className="text-left p-2 font-medium">email</th>
                          <th className="text-left p-2 font-medium">name</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-t border-border">
                          <td className="p-2 text-primary">1</td>
                          <td className="p-2">john@example.com</td>
                          <td className="p-2">John Doe</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
