import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const buildFileTree = (files: Record<string, string>): FileNode[] => {
  const root: FileNode[] = [];
  
  Object.keys(files).sort().forEach(path => {
    const parts = path.split('/');
    let current = root;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existing = current.find(n => n.name === part);
      
      if (existing) {
        if (existing.children) {
          current = existing.children;
        }
      } else {
        const newNode: FileNode = {
          name: part,
          path: isFile ? path : parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        current.push(newNode);
        if (newNode.children) {
          current = newNode.children;
        }
      }
    });
  });
  
  return root;
};

const FileTreeNode = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { activeFile, openFile } = useProjectStore();
  
  const isActive = activeFile === node.path;
  
  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      openFile(node.path);
    }
  };
  
  const getFileIcon = (name: string) => {
    if (name.endsWith('.js')) return <File className="w-4 h-4 text-status-pending" />;
    if (name.endsWith('.json')) return <File className="w-4 h-4 text-primary" />;
    return <File className="w-4 h-4 text-muted-foreground" />;
  };
  
  return (
    <div>
      <div
        className={cn(
          'tree-item',
          isActive && 'tree-item-active'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate text-sm">{node.name}</span>
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map(child => (
            <FileTreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  const { files } = useProjectStore();
  
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  
  if (Object.keys(files).length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        <p>No files yet.</p>
        <p className="mt-1 text-xs">Generate a project to see files</p>
      </div>
    );
  }
  
  return (
    <div className="py-2 ide-scrollbar overflow-auto">
      {fileTree.map(node => (
        <FileTreeNode key={node.path} node={node} />
      ))}
    </div>
  );
};

export default FileExplorer;
