/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { TLBounds } from "@tldraw/core";

export function useCounterScaledPosition(
  ref: React.RefObject<HTMLElement>,
  bounds: TLBounds,
  camera: { point: number[]; zoom: number },
  zIndex: number
) {
  const {
    point: [x, y],
    zoom
  } = camera;

  const rWidth = useRef(0);
  const rHeight = useRef(0);

  createRenderEffect(() => {
    const elm = ref.current!;
    rWidth.current = (bounds.width + 128 * (1 / zoom)) * zoom;
    rHeight.current = (bounds.height + 128 * (1 / zoom)) * zoom;
    elm.style.setProperty("width", `${rWidth.current}px`);
    elm.style.setProperty("height", `${rHeight.current}px`);
    if (zIndex !== undefined) {
      elm.style.setProperty("z-index", zIndex?.toString());
    }
  }, [bounds.width, bounds.height, zIndex, zoom]);

  createRenderEffect(() => {
    const elm = ref.current!;
    let transform = `
      translate(
        ${(x + bounds.minX - 64 * (1 / zoom)) * zoom}px,
        ${(y + bounds.minY - 64 * (1 / zoom)) * zoom}px
      )`;
    if (bounds.rotation !== 0) {
      transform += `translate(${rWidth.current / 2}px, ${rHeight.current / 2}px)
      rotate(${bounds.rotation || 0}rad)
      translate(${-rWidth.current / 2}px, ${-rHeight.current / 2}px)`;
    }
    elm.style.setProperty("transform", transform);
  }, [bounds.minX, bounds.minY, bounds.rotation, x, y, zoom]);
}
