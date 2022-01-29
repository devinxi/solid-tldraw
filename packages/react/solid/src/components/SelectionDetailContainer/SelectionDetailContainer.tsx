import { useRendererContext } from "~/options/solid/src/hooks";
import { BoundsUtils } from "@tldraw/core";
import type { TLBounds } from "@tldraw/core";
import { useCounterScaledPosition } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";

export interface TLSelectionDetailContainerProps<S extends TLSolidShape> {
  hidden: boolean;
  bounds: TLBounds;
  shapes: S[];
  detail?: "size" | "rotation";
  rotation?: number;
}

export const SelectionDetailContainer = function SelectionDetail<S extends TLSolidShape>({
  bounds,
  hidden,
  shapes,
  rotation = 0,
  detail = "size"
}: TLSelectionDetailContainerProps<S>) {
  const {
    components: { SelectionDetail },
    viewport: {
      camera: { zoom }
    }
  } = useRendererContext();

  const rBounds = useRef<HTMLDivElement>(null);
  const scaledBounds = BoundsUtils.multiplyBounds(bounds, zoom);
  useCounterScaledPosition(rBounds, scaledBounds, zoom, 10003);

  if (!SelectionDetail) throw Error("Expected a SelectionDetail component.");

  return (
    <div
      ref={rBounds}
      className={`tl-counter-scaled-positioned ${hidden ? `tl-fade-out` : ""}`}
      aria-label="bounds-detail-container"
    >
      <SelectionDetail
        shapes={shapes}
        bounds={bounds}
        scaledBounds={scaledBounds}
        zoom={zoom}
        rotation={rotation}
        detail={detail}
      />
    </div>
  );
};
