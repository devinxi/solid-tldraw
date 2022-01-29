import { createEffect } from "solid-js";
import { useRef } from "solid-react-compat";
import { JSX } from "solid-js";
import { useRendererContext } from "~/options/solid/src/hooks";

interface SVGLayerProps {
  children: JSX.Element;
}

export const SVGLayer = function SVGLayer({ children }: SVGLayerProps) {
  const rGroup = useRef<SVGGElement>(null);

  const { viewport } = useRendererContext();

  createEffect(() => {
    const group = rGroup.current;
    if (!group) return;

    const { zoom, point } = viewport.camera;
    group.style.setProperty(
      "transform",
      `scale(${zoom}) translateX(${point[0]}px) translateY(${point[1]}px)`
    );
  });

  return (
    <svg className="tl-absolute tl-overlay" pointer-events="none">
      <g ref={rGroup} pointer-events="none">
        {children}
      </g>
    </svg>
  );
};
