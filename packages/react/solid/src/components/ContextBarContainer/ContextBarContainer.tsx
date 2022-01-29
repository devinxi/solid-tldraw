import { useRendererContext } from "~/options/solid/src/hooks/useRendererContext";
import { TLBounds, BoundsUtils, TLOffset } from "@tldraw/core";
import { useCounterScaledPosition } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";
import { createRenderEffect } from "solid-js";
import { useRef } from "solid-react-compat";

const stopEventPropagation = (e: React.PointerEvent) => e.stopPropagation();

export interface TLContextBarContainerProps<S extends TLSolidShape> {
  shapes: S[];
  hidden: boolean;
  bounds: TLBounds;
  rotation?: number;
}

export const ContextBarContainer = function ContextBar<S extends TLSolidShape>({
  shapes,
  hidden,
  bounds,
  rotation = 0
}: TLContextBarContainerProps<S>) {
  const {
    components: { ContextBar },
    viewport: {
      bounds: vpBounds,
      camera: {
        point: [x, y],
        zoom
      }
    }
  } = useRendererContext();
  const rBounds = useRef<HTMLDivElement>(null);

  const rotatedBounds = BoundsUtils.getRotatedBounds(bounds, rotation);
  const scaledBounds = BoundsUtils.multiplyBounds(rotatedBounds, zoom);

  useCounterScaledPosition(rBounds, scaledBounds, zoom, 10003);

  if (!ContextBar) throw Error("Expected a ContextBar component.");

  const screenBounds = BoundsUtils.translateBounds(scaledBounds, [x, y]);
  const offsets: TLOffset = {
    left: screenBounds.minX,
    right: vpBounds.width - screenBounds.maxX,
    top: screenBounds.minY,
    bottom: vpBounds.height - screenBounds.maxY,
    width: screenBounds.width,
    height: screenBounds.height
  };
  const inView =
    BoundsUtils.boundsContain(vpBounds, screenBounds) ||
    BoundsUtils.boundsCollide(vpBounds, screenBounds);

  createRenderEffect(() => {
    const elm = rBounds.current;
    if (!elm) return;
    if (hidden || !inView) {
      elm.classList.add("tl-fade-out");
      elm.classList.remove("tl-fade-in");
    } else {
      elm.classList.add("tl-fade-in");
      elm.classList.remove("tl-fade-out");
    }
  }, [hidden, inView]);

  return (
    <div
      ref={rBounds}
      className="tl-counter-scaled-positioned tl-fade-out"
      aria-label="context-bar-container"
      onPointerMove={stopEventPropagation}
      onPointerUp={stopEventPropagation}
      onPointerDown={stopEventPropagation}
    >
      <ContextBar
        shapes={shapes}
        bounds={bounds}
        offset={offsets}
        scaledBounds={scaledBounds}
        rotation={rotation}
      />
    </div>
  );
};
