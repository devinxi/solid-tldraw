/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TLSolidShape } from "~/options/solid/src/lib";
import { useApp } from "~/options/solid/src/hooks";
import type { AppProps } from "./App";
import { Renderer } from "./Renderer";
import { JSX } from "solid-js";
import { createEffect } from "solid-js";
export const AppCanvas = function InnerApp<S extends TLSolidShape>(
  props: AppProps<S>
): JSX.Element {
  const app = useApp<S>();

  createEffect(() => {
    console.log(app(), app().currentState.id);
  });

  return (
    <Renderer
      viewport={app().viewport}
      inputs={app().inputs}
      callbacks={app()._events as any}
      brush={app().brush}
      editingShape={app().editingShape}
      hoveredShape={app().hoveredShape}
      selectionDirectionHint={app().selectionDirectionHint}
      selectionBounds={app().selectionBounds}
      selectedShapes={app().selectedShapesArray}
      erasingShapes={app().erasingShapesArray}
      shapes={app().shapesInViewport}
      assets={app().assets}
      showGrid={app().settings.showGrid}
      showSelection={app().showSelection}
      showSelectionRotation={app().showSelectionRotation}
      showResizeHandles={app().showResizeHandles}
      showRotateHandles={app().showRotateHandles}
      showSelectionDetail={app().showSelectionDetail}
      showContextBar={app().showContextBar}
      cursor={app().cursors.cursor}
      cursorRotation={app().cursors.rotation}
      selectionRotation={app().selectionRotation}
      {...props}
    />
  );
};
