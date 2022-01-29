import type { TLBounds } from "@tldraw/core";
import { ComponentProps } from "solid-js";
import { createRenderEffect, mergeProps } from "solid-js";
import { useRef } from "solid-react-compat";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface ContainerProps extends ComponentProps<"div"> {
  id?: string;
  bounds: TLBounds;
  zIndex?: number;
  rotation?: number;
  className?: string;
}

export const Container = function Container(_props: ContainerProps) {
  const props = mergeProps(
    {
      rotation: 0,
      class: ""
    },
    _props
  );
  const rBounds = useRef<HTMLDivElement>(null);

  createRenderEffect(() => {
    const elm = rBounds.current!;

    elm.style.setProperty(
      "transform",
      `translate(
          calc(${props.bounds.minX}px - var(--tl-padding)),
          calc(${props.bounds.minY}px - var(--tl-padding))
        )
        rotate(${props.rotation + (props.bounds.rotation || 0)}rad)`
    );
  }, [props.bounds.minX, props.bounds.minY, props.rotation, props.bounds.rotation]);

  createRenderEffect(() => {
    const elm = rBounds.current!;

    elm.style.setProperty(
      "width",
      `calc(${Math.floor(props.bounds.width)}px + (var(--tl-padding) * 2))`
    );

    elm.style.setProperty(
      "height",
      `calc(${Math.floor(props.bounds.height)}px + (var(--tl-padding) * 2))`
    );

    if (props.zIndex !== undefined) {
      elm.style.setProperty("z-index", props.zIndex?.toString());
    }
  });

  return (
    <div
      {...props}
      id={props.id}
      ref={ref => (rBounds.current = ref!)}
      aria-label="container"
      className={`tl-positioned ${props.class}`}
    />
  );
};
