import { useState, useEffect } from "react";
import { JsonNode } from "./components/JsonNode";
import { BreadcrumbProvider, useBreadcrumb } from "./contexts/BreadcrumbContext";
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

function Breadcrumb({ filename }: { filename: string }) {
  const { path, scrollTo } = useBreadcrumb();

  const formatSegment = (segment: string | number): string => {
    if (typeof segment === "number") {
      return `[${segment}]`;
    }
    return segment;
  };

  const handleSegmentClick = (index: number) => {
    // Path includes "root" at index 0, displayed segments start at index 1
    // When clicking segment at display index, we want path up to and including that segment
    const targetPath = path.slice(0, index + 2); // +2 because: +1 for "root", +1 to include the clicked segment
    scrollTo(targetPath); // only scroll, don't change breadcrumb
  };

  const handleRootClick = () => {
    scrollTo(["root"]); // only scroll, don't change breadcrumb
  };

  return (
    <div className="breadcrumb" data-testid="breadcrumb">
      <ol>
        <li onClick={handleRootClick}>
          <span>{filename || "root"}</span>
        </li>
        {path.slice(1).map((segment, index) => (
          <li key={index} onClick={() => handleSegmentClick(index)}>
            <span>{formatSegment(segment)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
