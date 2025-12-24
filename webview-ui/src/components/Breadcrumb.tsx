import { useBreadcrumb } from "../contexts/BreadcrumbContext";

interface BreadcrumbProps {
  filename: string;
}

export function Breadcrumb({ filename }: BreadcrumbProps) {
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
