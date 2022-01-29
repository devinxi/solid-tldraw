import { TLTargetType } from "@tldraw/core";
import { useRendererContext } from "~/options/solid/src/hooks";
import type { TLSolidShape } from "~/options/solid/src/lib";
import type { TLSolidCustomEvents } from "~/options/solid/src/types";
import { DOUBLE_CLICK_DURATION } from "~/options/solid/src/constants";

export function useShapeEvents<S extends TLSolidShape>(shape: S) {
  const { inputs, callbacks } = useRendererContext();

  const rDoubleClickTimer = useRef<number>(-1);

  const events = useMemo(() => {
    const onPointerMove: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      callbacks.onPointerMove?.({ type: TLTargetType.Shape, shape, order }, e);
      e.order = order + 1;
    };

    const onPointerDown: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.setPointerCapture(e.pointerId);
      callbacks.onPointerDown?.({ type: TLTargetType.Shape, shape, order }, e);
      e.order = order + 1;
    };

    const onPointerUp: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (!order) e.currentTarget?.releasePointerCapture(e.pointerId);
      callbacks.onPointerUp?.({ type: TLTargetType.Shape, shape, order }, e);

      const now = Date.now();
      const elapsed = now - rDoubleClickTimer.current;

      if (elapsed > DOUBLE_CLICK_DURATION) {
        rDoubleClickTimer.current = now;
      } else {
        if (elapsed <= DOUBLE_CLICK_DURATION) {
          callbacks.onDoubleClick?.({ type: TLTargetType.Shape, shape, order }, e);
          rDoubleClickTimer.current = -1;
        }
      }

      e.order = order + 1;
    };

    const onPointerEnter: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      callbacks.onPointerEnter?.({ type: TLTargetType.Shape, shape, order }, e);
      e.order = order + 1;
    };

    const onPointerLeave: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      callbacks.onPointerLeave?.({ type: TLTargetType.Shape, shape, order }, e);
      e.order = order + 1;
    };

    const onKeyDown: TLSolidCustomEvents["keyboard"] = e => {
      callbacks.onKeyDown?.({ type: TLTargetType.Shape, shape, order: -1 }, e);
    };

    const onKeyUp: TLSolidCustomEvents["keyboard"] = e => {
      callbacks.onKeyUp?.({ type: TLTargetType.Shape, shape, order: -1 }, e);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onKeyUp,
      onKeyDown
    };
  }, [shape.id, inputs, callbacks]);

  return events;
}

function setCaptureOnAncestorDiv(elm: Element, pointerId: number): void {
  if (elm.tagName === "DIV") elm.setPointerCapture(pointerId);
  else if (elm.parentElement) setCaptureOnAncestorDiv(elm.parentElement, pointerId);
}
