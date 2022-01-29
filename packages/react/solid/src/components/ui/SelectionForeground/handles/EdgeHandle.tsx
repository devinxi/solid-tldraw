import { TLResizeEdge } from "@tldraw/core";
import { useBoundsEvents } from "~/options/solid/src/hooks/useBoundsEvents";

const edgeClassnames = {
  [TLResizeEdge.Top]: "tl-cursor-ns",
  [TLResizeEdge.Right]: "tl-cursor-ew",
  [TLResizeEdge.Bottom]: "tl-cursor-ns",
  [TLResizeEdge.Left]: "tl-cursor-ew"
};

interface EdgeHandleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  targetSize: number;
  edge: TLResizeEdge;
  isHidden?: boolean;
}

export const EdgeHandle = function EdgeHandle({
  x,
  y,
  width,
  height,
  targetSize,
  edge,
  isHidden
}: EdgeHandleProps): JSX.Element {
  const events = useBoundsEvents(edge);

  return (
    <rect
      pointerEvents={isHidden ? "none" : "all"}
      className={"tl-transparent tl-edge-handle " + (isHidden ? "" : edgeClassnames[edge])}
      aria-label={`${edge} target`}
      opacity={isHidden ? 0 : 1}
      x={x - targetSize}
      y={y - targetSize}
      width={Math.max(1, width + targetSize * 2)}
      height={Math.max(1, height + targetSize * 2)}
      {...events}
    />
  );
};
