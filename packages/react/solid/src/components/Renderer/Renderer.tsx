import type { TLSolidShape } from "~/options/solid/src/lib";
import { Canvas, RendererContext, TLCanvasProps } from "~/options/solid/src/components";
import type { TLRendererContextProps } from "./RendererContext";
import { splitProps } from "solid-js";

export interface TLRendererProps<S extends TLSolidShape>
  extends TLRendererContextProps<S>,
    Partial<TLCanvasProps<S>> {}

export function Renderer<S extends TLSolidShape>(_props: TLRendererProps<S>) {
  const [{ viewport, inputs, callbacks, components }, rest] = splitProps(_props, [
    "viewport",
    "inputs",
    "callbacks",
    "components"
  ]);
  return (
    <RendererContext
      id={rest.id}
      viewport={viewport}
      inputs={inputs}
      callbacks={callbacks}
      components={components}
      meta={rest.meta}
    >
      <Canvas {...rest} />
    </RendererContext>
  );
}
