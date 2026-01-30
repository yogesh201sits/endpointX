import { useState } from "react";
import { Send, Loader2, ChevronDown } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import MonacoEditor from "./MonacoEditor";
import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
  GET: "text-green-500 border-green-500",
  POST: "text-blue-500 border-blue-500",
  PUT: "text-orange-500 border-orange-500",
  PATCH: "text-yellow-500 border-yellow-500",
  DELETE: "text-red-500 border-red-500",
};

export default function APIPlayground() {
  const { routes, baseUrl } = useProjectStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [body, setBody] = useState("{\n  \n}");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const addConsoleLog = useProjectStore(state => state.addConsoleLog);

  const routeOptions = routes.map(r => ({
    label: `${r.method} ${r.path}`,
    ...r,
  }));
  
  function buildUrl(routePath: string) {
    let url = baseUrl + routePath;
    console.log(url)
    // replace :id style params
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });

    return url;
  }

  async function sendRequest() {
  if (!selected || !baseUrl) return;

  let targetUrl = buildUrl(selected.path); // make sure this returns full URL
if (!targetUrl.startsWith("http")) {
  targetUrl = "https://" + targetUrl;
}


  setLoading(true);
  setResponse("");

  try {
    const res = await fetch("http://localhost:4000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,          // external API url
        method: selected.method, // GET, POST, PUT, etc.
        body: body ? JSON.parse(body) : undefined,
      }),
    });

    const json = (await res.json()).data;
    setResponse(JSON.stringify(json, null, 2));
    addConsoleLog("[SUCCESS] fetched : "+targetUrl)
  } catch (err: any) {
    setResponse(`ERROR: ${err.message}`);
    addConsoleLog(`ERROR: ${err.message}`);
  } finally {
    setLoading(false);
  }
}


  function extractParams(path: string) {
    const matches = path.match(/:([a-zA-Z0-9_]+)/g);
    return matches ? matches.map(m => m.slice(1)) : [];
  }

  const pathParams = selected ? extractParams(selected.path) : [];

  return (
    <div className="h-full flex flex-col gap-3 p-3">

      {/* Base URL */}
      {baseUrl && (
        <div className="text-xs text-muted-foreground">
          Base URL:{" "}
          <span className="text-primary font-mono break-all">{baseUrl}</span>
        </div>
      )}

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-surface-elevated border border-border rounded px-2 py-1 text-sm"
        >
          {selected ? (
            <div className="flex items-center gap-2 font-mono">
              <span
                className={cn(
                  "px-1.5 py-0.5 border rounded text-xs",
                  methodColors[selected.method]
                )}
              >
                {selected.method}
              </span>
              <span>{selected.path}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select endpoint...</span>
          )}
          <ChevronDown className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute z-50 w-full bg-surface-elevated border border-border rounded mt-1 max-h-60 overflow-auto">
            {routeOptions.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelected(r);
                  setOpen(false);
                  setParams({});
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-secondary text-sm font-mono"
              >
                <span
                  className={cn(
                    "px-1.5 py-0.5 border rounded text-xs",
                    methodColors[r.method]
                  )}
                >
                  {r.method}
                </span>
                <span>{r.path}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Path Params Input */}
      {pathParams.length > 0 && (
        <div className="space-y-1">
          {pathParams.map(p => (
            <input
              key={p}
              placeholder={`Enter ${p}`}
              className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-xs font-mono"
              value={params[p] || ""}
              onChange={e =>
                setParams(prev => ({ ...prev, [p]: e.target.value }))
              }
            />
          ))}
        </div>
      )}

      {/* Request Body */}
      {selected && ["POST", "PUT", "PATCH"].includes(selected.method) && (
        <div className="h-28 border border-border rounded overflow-hidden">
          <MonacoEditor
            value={body}
            onChange={v => setBody(v || "")}
            language="json"
            height="100%"
          />
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={sendRequest}
        disabled={!selected || loading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Send Request
      </button>

      {/* Response Panel (BIG 🔥) */}
      <div className="flex-1 border border-border rounded overflow-hidden">
        {response ? (
          <MonacoEditor value={response} language="json" readOnly height="100%" />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            Response will appear here...
          </div>
        )}
      </div>
    </div>
  );
}
