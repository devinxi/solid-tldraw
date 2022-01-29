import { useHandleEvents } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLHandle } from "@tldraw/core";
import type { TLHandleComponentProps } from "~/options/solid/src/types";

export const Handle = function Handle<S extends TLSolidShape, H extends TLHandle>({
  shape,
  handle,
  index
}: TLHandleComponentProps<S, H>) {
  const events = useHandleEvents(shape, index);
  const [x, y] = handle.point;

  return (
    <g className="tl-handle" aria-label="handle" {...events} transform={`translate(${x}, ${y})`}>
      <circle className="tl-handle-bg" pointerEvents="all" />
      <circle className="tl-counter-scaled tl-handle" pointerEvents="none" r={4} />
    </g>
  );
};
