export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 p-4">
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Feedback
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0.0</span>
          <span className="text-xs bg-muted px-2 py-1 rounded">
            Powered by WebContainers
          </span>
        </div>
      </div>
    </footer>
  );
}