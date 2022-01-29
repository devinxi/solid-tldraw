import type { TLBounds } from "@tldraw/core";

export function useCounterScaledPosition(
  ref: React.RefObject<HTMLElement>,
  bounds: TLBounds,
  zoom: number,
  zIndex: number
) {
  createRenderEffect(() => {
    const elm = ref.current;
    if (!elm) return;

    elm.style.setProperty(
      "transform",
      `translate(
          calc(${bounds.minX - 64}px),
          calc(${bounds.minY - 64}px)
        )
        scale(var(--tl-scale))`
    );
  }, [bounds.minX, bounds.minY]);

  createRenderEffect(() => {
    const elm = ref.current;
    if (!elm) return;

    elm.style.setProperty("width", `calc(${Math.floor(bounds.width)}px + 64px * 2)`);
    elm.style.setProperty("height", `calc(${Math.floor(bounds.height)}px + 64px * 2)`);

    elm.style.setProperty("z-index", "10003");
  }, [bounds.width, bounds.height, zoom]);

  createRenderEffect(() => {
    const elm = ref.current;
    if (!elm) return;
    elm.style.setProperty("z-index", zIndex.toString());
  }, [zIndex]);
}
