import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

const MonacoEditor = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '100%',
}: MonacoEditorProps) => {
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', monospace",
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        contextmenu: false,
        folding: true,
        lineDecorationsWidth: 8,
        lineNumbersMinChars: 3,
      }}
    />
  );
};

export default MonacoEditor;
