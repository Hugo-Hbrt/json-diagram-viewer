import { useState, useEffect } from 'react';
import { JsonNode } from './components/JsonNode';

interface VsCodeMessage {
  type: string;
  content: string;
}

function App() {
  const [jsonContent, setJsonContent] = useState<string>('');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<VsCodeMessage>) => {
      const message = event.data;
      if (message.type === 'update') {
        setJsonContent(message.content);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!jsonContent) {
      setParsedData(null);
      setError(null);
      return;
    }

    try {
      const data = JSON.parse(jsonContent);
      setParsedData(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse JSON');
      setParsedData(null);
    }
  }, [jsonContent]);

  if (error) {
    return (
      <div className="diagram-container">
        <div className="error-message">
          Error parsing JSON:{'\n\n'}
          {error}
        </div>
      </div>
    );
  }

  if (parsedData === null && !jsonContent) {
    return (
      <div className="diagram-container">
        <div className="empty-message">Loading JSON diagram...</div>
      </div>
    );
  }

  const rootName = Array.isArray(parsedData) ? 'root[]' : 'root';

  return (
    <div className="diagram-container">
      <JsonNode
        nodeKey={rootName}
        value={parsedData}
        path={['root']}
        cardType="root"
        isRoot
      />
    </div>
  );
}

export default App;
