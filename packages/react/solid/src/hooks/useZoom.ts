import { createRenderEffect } from "solid-js";

import { useRendererContext } from "./useRendererContext";

export function useZoom(ref: React.RefObject<HTMLDivElement>) {
  const { viewport } = useRendererContext();
  createRenderEffect(() => {
    () => {
      const { zoom } = viewport.camera;
      const container = ref.current;
      if (!container) return;
      container.style.setProperty("--tl-zoom", zoom.toString());
    };
  }, []);
}
