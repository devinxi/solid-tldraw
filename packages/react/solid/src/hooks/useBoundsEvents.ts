import { useRendererContext } from "~/options/solid/src/hooks";
import { TLSelectionHandle, TLTargetType } from "@tldraw/core";
import type { TLSolidCustomEvents } from "~/options/solid/src/types";
import { DOUBLE_CLICK_DURATION } from "~/options/solid/src/constants";

export function useBoundsEvents(handle: TLSelectionHandle) {
  const { callbacks } = useRendererContext();

  const rDoubleClickTimer = useRef<number>(-1);

  const events = useMemo(() => {
    const onPointerMove: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (order) return;
      callbacks.onPointerMove?.({ type: TLTargetType.Selection, handle, order }, e);
      e.order = order + 1;
    };

    const onPointerDown: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (order) return;
      if (e.currentTarget.tagName === "g") {
        // Bounds events are set on SVG elements; we need to set
        // pointer capture on their parent,the SVG container (an
        // HMTL element).
        e.currentTarget?.parentElement?.setPointerCapture(e.pointerId);
      }
      callbacks.onPointerDown?.({ type: TLTargetType.Selection, handle, order }, e);
      e.order = order + 1;
    };

    const onPointerUp: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (order) return;
      if (e.currentTarget.tagName === "g") {
        e.currentTarget?.releasePointerCapture(e.pointerId);
      }
      callbacks.onPointerUp?.({ type: TLTargetType.Selection, handle, order }, e);

      const now = Date.now();
      const elapsed = now - rDoubleClickTimer.current;

      if (elapsed > DOUBLE_CLICK_DURATION) {
        rDoubleClickTimer.current = now;
      } else {
        if (elapsed <= DOUBLE_CLICK_DURATION) {
          callbacks.onDoubleClick?.({ type: TLTargetType.Selection, handle, order }, e);
          rDoubleClickTimer.current = -1;
        }
      }

      e.order = order + 1;
    };

    const onPointerEnter: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (order) return;
      callbacks.onPointerEnter?.({ type: TLTargetType.Selection, handle, order }, e);
      e.order = order + 1;
    };

    const onPointerLeave: TLSolidCustomEvents["pointer"] = e => {
      const { order = 0 } = e;
      if (order) return;
      callbacks.onPointerLeave?.({ type: TLTargetType.Selection, handle, order }, e);
      e.order = order + 1;
    };

    const onKeyDown: TLSolidCustomEvents["keyboard"] = e => {
      callbacks.onKeyDown?.({ type: TLTargetType.Selection, handle, order: -1 }, e);
    };

    const onKeyUp: TLSolidCustomEvents["keyboard"] = e => {
      callbacks.onKeyUp?.({ type: TLTargetType.Selection, handle, order: -1 }, e);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onKeyDown,
      onKeyUp
    };
  }, [callbacks]);

  return events;
}
