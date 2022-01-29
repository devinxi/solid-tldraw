/* eslint-disable @typescript-eslint/no-unused-vars */
import Vec from "@tldraw/vec";
import { BoundsUtils } from "@tldraw/core";
import { intersectRayLineSegment } from "@tldraw/intersect";

import { useRendererContext } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLDirectionIndicatorProps } from "~/options/solid/src/types";
import { useRef } from "solid-react-compat";
import { createRenderEffect } from "solid-js";

export const DirectionIndicator = function DirectionIndicator<
  S extends TLSolidShape = TLSolidShape
>({ direction }: TLDirectionIndicatorProps<S>) {
  const {
    viewport: { bounds }
  } = useRendererContext();
  const rIndicator = useRef<HTMLDivElement>(null);
  createRenderEffect(() => {
    const elm = rIndicator.current;
    if (!elm) return;
    // Find the center of the bounds, offset by its point
    const center = [bounds.width / 2, bounds.height / 2];
    const insetBoundSides = BoundsUtils.getRectangleSides(
      [12, 12],
      [bounds.width - 24, bounds.height - 24]
    );
    for (const [A, B] of insetBoundSides) {
      const int = intersectRayLineSegment(center, direction, A, B);
      if (!int.didIntersect) continue;
      const point = int.points[0];
      elm.style.setProperty(
        "transform",
        `translate(${point[0] - 6}px,${point[1] - 6}px) rotate(${Vec.toAngle(direction)}rad)`
      );
    }
  }, [direction, bounds]);
  return (
    <div ref={rIndicator} className="tl-direction-indicator">
      <svg height={12} width={12}>
        <polygon points="0,0 12,6 0,12" />
      </svg>
    </div>
  );
};
