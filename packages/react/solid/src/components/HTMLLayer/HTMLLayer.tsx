import { createEffect } from "solid-js";
import { useRef } from "solid-react-compat";
import { JSX } from "solid-js";
import { useRendererContext } from "~/options/solid/src/hooks";

interface HTMLLayerProps {
  children: JSX.Element;
}

export const HTMLLayer = function HTMLLayer(props: HTMLLayerProps) {
  const rLayer = useRef<HTMLDivElement>(null);

  const renderer = useRendererContext();

  createEffect(() => {
    const layer = rLayer.current;
    if (!layer) return;

    const { zoom, point } = renderer().viewport.camera;
    layer.style.setProperty("transform", `scale(${zoom}) translate(${point[0]}px, ${point[1]}px)`);
  });

  return (
    <div ref={r => (rLayer.current = r)} className="tl-absolute tl-layer">
      {props.children}
    </div>
  );
};
