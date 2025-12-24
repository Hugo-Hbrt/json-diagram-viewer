import { useState, useEffect } from "react";
import { JsonNode } from "./components/JsonNode";
import { Breadcrumb } from "./components/Breadcrumb";
import { BreadcrumbProvider } from "./contexts/BreadcrumbContext";
import type { VsCodeMessage } from "@shared/types";

function App() {
  const [jsonContent, setJsonContent] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  const [parsedData, setParsedData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<VsCodeMessage>) => {
      const message = event.data;
      if (message.type === "update") {
        setJsonContent(message.content);
        setFilename(message.filename);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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
      setError(e instanceof Error ? e.message : "Failed to parse JSON");
      setParsedData(null);
    }
  }, [jsonContent]);

  if (error) {
    return (
      <div className="diagram-container">
        <div className="error-message">
          Error parsing JSON:{"\n\n"}
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

  // Get filename without extension for root card title
  const getBasename = (name: string): string => {
    const lastDot = name.lastIndexOf(".");
    return lastDot > 0 ? name.slice(0, lastDot) : name;
  };
  const rootName = filename ? getBasename(filename) : "root";

  return (
    <BreadcrumbProvider>
      <div className="diagram-container">
        <Breadcrumb filename={filename} />
        <JsonNode
          nodeKey={rootName}
          value={parsedData}
          path={["root"]}
          cardType="root"
          isRoot
          data-testid="root-node"
        />
      </div>
    </BreadcrumbProvider>
  );
}

export default App;
