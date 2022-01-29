/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { TLBounds } from "@tldraw/core";
import { useRendererContext } from "~/options/solid/src/hooks";

export function usePosition(ref: React.RefObject<HTMLElement>, bounds: TLBounds, zIndex: number) {
  const {
    viewport: {
      camera: {
        point: [x, y],
        zoom
      }
    }
  } = useRendererContext();

  const rWidth = useRef(0);
  const rHeight = useRef(0);

  createRenderEffect(() => {
    const elm = ref.current!;
    rWidth.current = bounds.width + 128 * (1 / zoom);
    rHeight.current = bounds.height + 128 * (1 / zoom);

    elm.style.setProperty("width", `${rWidth.current}px`);
    elm.style.setProperty("height", `${rHeight.current}px`);

    if (zIndex !== undefined) {
      elm.style.setProperty("z-index", zIndex?.toString());
    }
  }, [bounds.width, bounds.height, zIndex, zoom]);

  createRenderEffect(() => {
    const elm = ref.current!;

    let transform = `
      scale(${zoom})
      translate3d(
        ${x + bounds.minX - 64 * (1 / zoom)}px,
        ${y + bounds.minY - 64 * (1 / zoom)}px,
        0
      )`;

    if (bounds.rotation !== 0) {
      transform += `translate3d(${rWidth.current / 2}px, ${rHeight.current / 2}px,
      0)
      rotate(${bounds.rotation || 0}rad)
      translate(${-rWidth.current / 2}px, ${-rHeight.current / 2}px)`;
    }

    elm.style.setProperty("transform", transform);
  }, [bounds.minX, bounds.minY, bounds.rotation, x, y, zoom]);
}
