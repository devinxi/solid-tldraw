/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  Shape,
  Indicator,
  HTMLLayer,
  Container,
  SelectionDetailContainer,
  ContextBarContainer,
  SVGContainer
} from "~/options/solid/src/components";
import {
  useCanvasEvents,
  useGestureEvents,
  useResizeObserver,
  useStylesheet,
  useRendererContext,
  usePreventNavigation,
  useCursor,
  useZoom
} from "~/options/solid/src/hooks";
import { useMemo, useRef } from "solid-react-compat";
import { TLAsset, TLBinding, TLBounds, TLCursor, TLTheme } from "@tldraw/core";
import { EMPTY_OBJECT } from "~/options/solid/src/constants";
import type { TLSolidShape } from "~/options/solid/src/lib";
import { DirectionIndicator } from "~/options/solid/src/components/ui/DirectionIndicator";
import { For, JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface TLCanvasProps<S extends TLSolidShape> {
  id?: string;
  className?: string;
  bindings?: TLBinding[];
  brush?: TLBounds;
  shapes?: S[];
  assets?: Record<string, TLAsset>;
  theme?: TLTheme;
  hoveredShape?: S;
  editingShape?: S;
  bindingShape?: S;
  selectionDirectionHint?: number[];
  selectionBounds?: TLBounds;
  selectedShapes?: S[];
  erasingShapes?: S[];
  gridSize?: number;
  cursor?: TLCursor;
  cursorRotation?: number;
  selectionRotation?: number;
  showGrid?: boolean;
  showSelection?: boolean;
  showHandles?: boolean;
  showResizeHandles?: boolean;
  showRotateHandles?: boolean;
  showContextBar?: boolean;
  showSelectionDetail?: boolean;
  showSelectionRotation?: boolean;
  children?: JSX.Element;
}

export const Canvas = function Renderer<S extends TLSolidShape>({
  id,
  className,
  brush,
  shapes,
  bindingShape,
  editingShape,
  hoveredShape,
  selectionBounds,
  selectedShapes,
  erasingShapes,
  selectionDirectionHint,
  cursor = TLCursor.Default,
  cursorRotation = 0,
  selectionRotation = 0,
  showSelection = true,
  showHandles = true,
  showSelectionRotation = false,
  showResizeHandles = true,
  showRotateHandles = true,
  showSelectionDetail = true,
  showContextBar = true,
  showGrid = true,
  gridSize = 8,
  theme = EMPTY_OBJECT,
  children
}: Partial<TLCanvasProps<S>>): JSX.Element {
  const rContainer = useRef<HTMLDivElement>(null);
  const context = useRendererContext();
  // const { zoom } = viewport.camera;

  useStylesheet(theme, id);
  // usePreventNavigation(rContainer);
  // useResizeObserver(rContainer, viewport);
  // useGestureEvents(rContainer);
  // useCursor(rContainer, cursor, cursorRotation);
  // useZoom(rContainer);

  const events = useCanvasEvents();

  const onlySelectedShape = selectedShapes?.length === 1 && selectedShapes[0];

  const onlySelectedShapeWithHandles =
    onlySelectedShape && "handles" in onlySelectedShape.props ? selectedShapes[0] : undefined;

  const selectedShapesSet = useMemo(() => new Set(selectedShapes || []));
  const erasingShapesSet = useMemo(() => new Set(erasingShapes || []));

  return (
    <div ref={r => (rContainer.current = r)} className={`tl-container ${className ?? ""}`}>
      <div tabindex={-1} class="tl-absolute tl-canvas" {...events}>
        {showGrid && context().components.Grid && (
          <Dynamic component={context().components.Grid!} size={gridSize} />
        )}
        <HTMLLayer>
          <Show
            when={
              context().components.SelectionBackground &&
              selectedShapes &&
              selectionBounds &&
              showSelection
            }
          >
            <Container bounds={selectionBounds!} zIndex={2}>
              <Dynamic
                component={context().components.SelectionBackground!}
                zoom={context().viewport.camera.zoom}
                shapes={selectedShapes!}
                bounds={selectionBounds!}
                showResizeHandles={showResizeHandles}
                showRotateHandles={showRotateHandles}
              />
            </Container>
          </Show>
          <Show when={shapes}>
            <For each={shapes}>
              {(shape, i) => (
                <Shape
                  // key={"shape_" + shape.id}
                  shape={shape}
                  // asset={shape.props.assetId ? assets[shape.props.assetId] : undefined}
                  isEditing={shape === editingShape}
                  isHovered={shape === hoveredShape}
                  isBinding={shape === bindingShape}
                  isSelected={selectedShapesSet.has(shape)}
                  isErasing={erasingShapesSet.has(shape)}
                  // meta={meta}
                  // zIndex={1000 + i}
                />
              )}
            </For>
          </Show>

          <For each={selectedShapes}>
            {shape => (
              <Indicator
                // key={"selected_indicator_" + shape.id}
                shape={shape}
                isEditing={shape === editingShape}
                isHovered={false}
                isBinding={false}
                isSelected={true}
              />
            )}
          </For>
          <Show when={hoveredShape}>
            <Indicator shape={hoveredShape!} />
          </Show>
          {/* {brush && components.Brush && <components.Brush bounds={brush} />}
          {selectedShapes && selectionBounds && (
            <>
              {showSelection && components.SelectionForeground && (
                <Container bounds={selectionBounds} zIndex={10002}>
                  <components.SelectionForeground
                    zoom={zoom}
                    shapes={selectedShapes}
                    bounds={selectionBounds}
                    showResizeHandles={showResizeHandles}
                    showRotateHandles={showRotateHandles}
                  />
                </Container>
              )}
              {showHandles && onlySelectedShapeWithHandles && components.Handle && (
                <Container bounds={selectionBounds} zIndex={10003}>
                  <SVGContainer>
                    {onlySelectedShapeWithHandles.props.handles!.map((handle, i) =>
                      React.createElement(components.Handle!, {
                        key: `${handle.id}_handle_${i}`,
                        shape: onlySelectedShapeWithHandles,
                        handle,
                        index: i
                      })
                    )}
                  </SVGContainer>
                </Container>
              )}
              {selectedShapes && components.SelectionDetail && (
                <SelectionDetailContainer
                  key={"detail" + selectedShapes.map(shape => shape.id).join("")}
                  shapes={selectedShapes}
                  bounds={selectionBounds}
                  detail={showSelectionRotation ? "rotation" : "size"}
                  hidden={!showSelectionDetail}
                  rotation={selectionRotation}
                />
              )}
              {selectedShapes && components.ContextBar && (
                <ContextBarContainer
                  key={"context" + selectedShapes.map(shape => shape.id).join("")}
                  shapes={selectedShapes}
                  hidden={!showContextBar}
                  bounds={selectedShapes.length === 1 ? selectedShapes[0].bounds : selectionBounds}
                  rotation={selectedShapes.length === 1 ? selectedShapes[0].props.rotation : 0}
                />
              )}
            </>
          )} */}
        </HTMLLayer>
        {selectionDirectionHint && selectionBounds && selectedShapes && (
          <DirectionIndicator
            direction={selectionDirectionHint}
            bounds={selectionBounds}
            shapes={selectedShapes}
          />
        )}
      </div>
      {children}
    </div>
  );
};
